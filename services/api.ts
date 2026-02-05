import { getDB } from "./db";
import { Product } from "../types";

// Helper to map DB snake_case to TS camelCase
const mapProduct = (row: any): Product => ({
  id: row.id,
  name: row.name,
  price: parseFloat(row.price),
  category: row.category,
  description: row.description,
  images: row.images,
  sizes: row.sizes,
  colors: row.colors,
  isNew: row.is_new,
  rating: parseFloat(row.rating),
  reviewCount: row.review_count
});

export const api = {
  getProducts: async (category?: string, sort?: string): Promise<Product[]> => {
    const db = await getDB();
    let query = "SELECT * FROM products";
    const params: any[] = [];

    if (category && category !== 'All') {
      query += " WHERE category = $1";
      params.push(category);
    }

    if (sort === 'Price: Low to High') {
      query += " ORDER BY price ASC";
    } else if (sort === 'Price: High to Low') {
      query += " ORDER BY price DESC";
    } else {
       // Default Sort
       query += " ORDER BY id ASC";
    }

    const result = await db.query(query, params);
    return result.rows.map(mapProduct);
  },

  getProductById: async (id: string): Promise<Product | undefined> => {
    const db = await getDB();
    const result = await db.query("SELECT * FROM products WHERE id = $1", [id]);
    if (result.rows.length === 0) return undefined;
    return mapProduct(result.rows[0]);
  },

  createOrder: async (orderData: {
    customerName: string;
    customerEmail: string;
    totalAmount: number;
    items: any[];
  }) => {
    const db = await getDB();
    const orderId = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    try {
      // Start Transaction
      await db.query('BEGIN');

      // Insert Order
      await db.query(
        `INSERT INTO orders (id, customer_name, customer_email, total_amount, status)
         VALUES ($1, $2, $3, $4, 'confirmed')`,
        [orderId, orderData.customerName, 'customer@example.com', orderData.totalAmount]
      );

      // Insert Items
      for (const item of orderData.items) {
        await db.query(
          `INSERT INTO order_items (order_id, product_id, quantity, selected_size, selected_color, price_at_purchase)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [orderId, item.id, item.quantity, item.selectedSize, item.selectedColor, item.price]
        );
      }

      await db.query('COMMIT');
      return { success: true, orderId };
    } catch (e) {
      await db.query('ROLLBACK');
      console.error("Order failed", e);
      throw e;
    }
  },
  
  // Newsletter subscription (Simulated for now as we don't have a newsletter table)
  subscribeNewsletter: async (email: string) => {
      // We could add a subscribers table here easily with SQL
      return new Promise<{ success: true }>(resolve => setTimeout(() => resolve({ success: true }), 500));
  }
};