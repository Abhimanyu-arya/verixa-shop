-- ============================================================
-- VERIXA SHOP - SUPABASE DATABASE SCHEMA
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ── 1. PROFILES (extends Supabase auth.users) ──────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT,
  avatar_url  TEXT,
  phone       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create a profile row whenever a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ── 2. PRODUCTS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.products (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  price         NUMERIC(10, 2) NOT NULL,
  category      TEXT NOT NULL,
  description   TEXT,
  images        TEXT[]  DEFAULT '{}',
  sizes         TEXT[]  DEFAULT '{}',
  colors        TEXT[]  DEFAULT '{}',
  is_new        BOOLEAN DEFAULT FALSE,
  rating        NUMERIC(3, 2) DEFAULT 0,
  review_count  INT DEFAULT 0,
  stock         INT DEFAULT 100,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Seed with existing products
INSERT INTO public.products (id, name, price, category, description, images, sizes, colors, is_new, rating, review_count) VALUES
('1', 'The Classic Essential', 35.00, 'Basics',
  'A timeless staple crafted from 100% organic cotton. Features a relaxed fit and breathable fabric for everyday comfort.',
  ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=800&fit=crop'],
  ARRAY['XS','S','M','L','XL'], ARRAY['White','Black','Navy'], TRUE, 4.8, 124),
('2', 'Urban Abstract Tee', 48.00, 'Graphic',
  'Bold, artistic expression meets premium streetwear. Screen-printed with eco-friendly inks on heavyweight cotton.',
  ARRAY['https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&h=800&fit=crop'],
  ARRAY['S','M','L','XL','XXL'], ARRAY['Charcoal','Sand'], FALSE, 4.9, 89),
('3', 'Serenity Linen Blend', 55.00, 'Premium',
  'Experience the ultimate lightweight luxury. A flax-cotton blend perfect for summer evenings and layered looks.',
  ARRAY['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=600&h=800&fit=crop'],
  ARRAY['XS','S','M','L'], ARRAY['Sage','Cream','Dusty Rose'], FALSE, 4.7, 56),
('4', 'Vintage Wash Crew', 42.00, 'Vintage',
  'Pre-shrunk and garment-dyed for that perfect lived-in feel from day one. Each piece is unique.',
  ARRAY['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=800&fit=crop'],
  ARRAY['S','M','L','XL'], ARRAY['Faded Black','Olive','Brick'], TRUE, 4.5, 32),
('5', 'Minimalist Logo Tee', 38.00, 'Basics',
  'Subtle branding for the modern minimalist. Soft-touch fabric with a tailored fit.',
  ARRAY['https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&h=800&fit=crop'],
  ARRAY['S','M','L','XL'], ARRAY['White','Grey Melange'], FALSE, 4.6, 210),
('6', 'Artisan Dyed Henley', 65.00, 'Premium',
  'Hand-dyed by local artisans using natural indigo. A statement piece that tells a story.',
  ARRAY['https://images.unsplash.com/photo-1527719327859-c6ce80353573?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1622445275463-afa2ab738c73?w=600&h=800&fit=crop'],
  ARRAY['M','L','XL'], ARRAY['Indigo'], FALSE, 5.0, 15)
ON CONFLICT (id) DO NOTHING;


-- ── 3. ORDERS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.orders (
  id              TEXT PRIMARY KEY,
  user_id         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name   TEXT NOT NULL,
  customer_email  TEXT NOT NULL,
  total_amount    NUMERIC(10, 2) NOT NULL,
  status          TEXT DEFAULT 'confirmed'
                  CHECK (status IN ('pending','confirmed','shipped','delivered','cancelled')),
  shipping_address JSONB,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);


-- ── 4. ORDER ITEMS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.order_items (
  id                  SERIAL PRIMARY KEY,
  order_id            TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id          TEXT REFERENCES public.products(id) ON DELETE SET NULL,
  quantity            INT NOT NULL,
  selected_size       TEXT,
  selected_color      TEXT,
  price_at_purchase   NUMERIC(10, 2) NOT NULL
);


-- ── 5. ANALYTICS EVENTS ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id          BIGSERIAL PRIMARY KEY,
  user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type  TEXT NOT NULL,   -- 'page_view' | 'product_view' | 'add_to_cart' | 'purchase'
  product_id  TEXT REFERENCES public.products(id) ON DELETE SET NULL,
  metadata    JSONB,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);


-- ── 6. ROW LEVEL SECURITY (RLS) ─────────────────────────────

-- Products: anyone can read, only service role can write
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are public" ON public.products FOR SELECT USING (TRUE);

-- Profiles: users can only read/update their own profile
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile"   ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Orders: users can read their own orders; service role can insert
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role can insert orders" ON public.orders FOR INSERT WITH CHECK (TRUE);

-- Order Items: accessible through order relationship
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));

-- Analytics: insert allowed for all (including anon), read only for service role
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can log analytics" ON public.analytics_events FOR INSERT WITH CHECK (TRUE);


-- ── 7. HELPFUL VIEWS ────────────────────────────────────────

-- Dashboard: orders with customer info
CREATE OR REPLACE VIEW public.orders_overview AS
SELECT
  o.id,
  o.customer_name,
  o.customer_email,
  o.total_amount,
  o.status,
  o.created_at,
  COUNT(oi.id) AS item_count
FROM public.orders o
LEFT JOIN public.order_items oi ON oi.order_id = o.id
GROUP BY o.id;

-- Dashboard: top products by sales
CREATE OR REPLACE VIEW public.top_products AS
SELECT
  p.id,
  p.name,
  p.category,
  p.price,
  SUM(oi.quantity) AS total_sold,
  SUM(oi.quantity * oi.price_at_purchase) AS total_revenue
FROM public.products p
LEFT JOIN public.order_items oi ON oi.product_id = p.id
GROUP BY p.id
ORDER BY total_sold DESC NULLS LAST;
