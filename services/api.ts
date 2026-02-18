import { supabase } from './supabase';
import { Product } from '../types';

// ── Helper: map DB snake_case → TS camelCase ────────────────
const mapProduct = (row: any): Product => ({
  id: row.id,
  name: row.name,
  price: parseFloat(row.price),
  category: row.category,
  description: row.description,
  images: row.images ?? [],
  sizes: row.sizes ?? [],
  colors: row.colors ?? [],
  isNew: row.is_new,
  rating: parseFloat(row.rating),
  reviewCount: row.review_count,
});

export const api = {
  // ── PRODUCTS ───────────────────────────────────────────────
  getProducts: async (category?: string, sort?: string): Promise<Product[]> => {
    let query = supabase.from('products').select('*');

    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    if (sort === 'Price: Low to High') {
      query = query.order('price', { ascending: true });
    } else if (sort === 'Price: High to Low') {
      query = query.order('price', { ascending: false });
    } else {
      query = query.order('id', { ascending: true });
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return (data ?? []).map(mapProduct);
  },

  getProductById: async (id: string): Promise<Product | undefined> => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return undefined;
    return mapProduct(data);
  },

  // ── ORDERS ─────────────────────────────────────────────────
  createOrder: async (orderData: {
    customerName: string;
    customerEmail: string;
    totalAmount: number;
    items: any[];
    shippingAddress?: object;
  }) => {
    const { data: { user } } = await supabase.auth.getUser();
    const orderId = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    const { error: orderError } = await supabase.from('orders').insert({
      id: orderId,
      user_id: user?.id ?? null,
      customer_name: orderData.customerName,
      customer_email: orderData.customerEmail,
      total_amount: orderData.totalAmount,
      status: 'confirmed',
      shipping_address: orderData.shippingAddress ?? null,
    });

    if (orderError) throw new Error(orderError.message);

    const orderItems = orderData.items.map(item => ({
      order_id: orderId,
      product_id: item.id,
      quantity: item.quantity,
      selected_size: item.selectedSize,
      selected_color: item.selectedColor,
      price_at_purchase: item.price,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
    if (itemsError) throw new Error(itemsError.message);

    await api.logEvent('purchase', undefined, { order_id: orderId, total: orderData.totalAmount });

    return { success: true, orderId };
  },

  // ── GET ORDERS BY EMAIL ────────────────────────────────────
  getOrdersByEmail: async (email: string) => {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(product_id, quantity, price_at_purchase, selected_size, selected_color, products(name))')
      .eq('customer_email', email)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return (data ?? []).map((order: any) => ({
      ...order,
      items: (order.order_items ?? []).map((item: any) => ({
        name: item.products?.name ?? 'Product',
        quantity: item.quantity,
        price: parseFloat(item.price_at_purchase),
      })),
    }));
  },

  // ── NEWSLETTER ─────────────────────────────────────────────
  subscribeNewsletter: async (email: string) => {
    await api.logEvent('newsletter_signup', undefined, { email });
    return { success: true };
  },

  // ── ANALYTICS ──────────────────────────────────────────────
  logEvent: async (
    eventType: 'page_view' | 'product_view' | 'add_to_cart' | 'purchase' | 'newsletter_signup',
    productId?: string,
    metadata?: object
  ) => {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('analytics_events').insert({
      user_id: user?.id ?? null,
      event_type: eventType,
      product_id: productId ?? null,
      metadata: metadata ?? null,
    });
  },
};
