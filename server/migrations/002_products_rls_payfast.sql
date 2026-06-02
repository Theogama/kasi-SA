-- Extend products catalog + seed data + RLS + stock helpers
-- Run in Supabase SQL Editor after setup.sql

ALTER TABLE products ADD COLUMN IF NOT EXISTS color VARCHAR(50);
ALTER TABLE products ADD COLUMN IF NOT EXISTS details TEXT[];

CREATE OR REPLACE FUNCTION decrement_product_stock(p_product_id UUID, p_qty INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE products
  SET stock_quantity = GREATEST(0, stock_quantity - p_qty),
      updated_at = CURRENT_TIMESTAMP
  WHERE id = p_product_id;
END;
$$;

-- Stable UUIDs for catalog items (safe to re-run with ON CONFLICT)
INSERT INTO products (
  id, name, description, price,
  image_url_front, image_url_back,
  sizes, stock_quantity, color, details
) VALUES
(
  'a0000001-0001-4000-8000-000000000001',
  'Muscle Car Tee — Black',
  'Classic black tee featuring our iconic muscle car design. Made from premium cotton blend for comfort and durability.',
  450.00,
  '/products/tee-black-front.png',
  '/products/tee-black-back.png',
  ARRAY['XS', 'S', 'M', 'L', 'XL', '2XL'],
  100,
  'black',
  ARRAY['100% Premium Cotton', 'Oversized Fit', 'Machine Washable', 'High-Quality Print', 'Comfortable & Breathable']
),
(
  'a0000002-0002-4000-8000-000000000002',
  'Muscle Car Tee — White',
  'Clean white tee with our signature muscle car design. Perfect for any occasion, versatile and timeless.',
  450.00,
  '/products/tee-white-front.png',
  '/products/tee-white-back.png',
  ARRAY['XS', 'S', 'M', 'L', 'XL', '2XL'],
  100,
  'white',
  ARRAY['100% Premium Cotton', 'Oversized Fit', 'Machine Washable', 'High-Quality Print', 'Comfortable & Breathable']
),
(
  'a0000003-0003-4000-8000-000000000003',
  'Kasi World Tee — Black',
  'Bold Kasi World graphic on premium black cotton. A statement piece for the streets.',
  450.00,
  '/products/kasi-world-tee-front.png',
  '/products/kasi-world-tee-back.png',
  ARRAY['XS', 'S', 'M', 'L', 'XL', '2XL'],
  100,
  'black',
  ARRAY['100% Premium Cotton', 'Oversized Fit', 'Machine Washable', 'High-Quality Print', 'Comfortable & Breathable']
),
(
  'a0000004-0004-4000-8000-000000000004',
  'From the Kasi Tee — White',
  'Clean white tee with a bold Kasi back graphic — made for everyday wear with premium comfort.',
  450.00,
  '/products/tee-white-front.png',
  '/products/kasi-wheelbarrow-tee-back.png',
  ARRAY['XS', 'S', 'M', 'L', 'XL', '2XL'],
  100,
  'white',
  ARRAY['100% Premium Cotton', 'Oversized Fit', 'Machine Washable', 'High-Quality Print', 'Comfortable & Breathable']
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url_front = EXCLUDED.image_url_front,
  image_url_back = EXCLUDED.image_url_back,
  sizes = EXCLUDED.sizes,
  color = EXCLUDED.color,
  details = EXCLUDED.details,
  updated_at = CURRENT_TIMESTAMP;

-- Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "products_public_read" ON products;
CREATE POLICY "products_public_read" ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS "orders_public_insert" ON orders;
CREATE POLICY "orders_public_insert" ON orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "orders_public_select" ON orders;
CREATE POLICY "orders_public_select" ON orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "order_items_public_insert" ON order_items;
CREATE POLICY "order_items_public_insert" ON order_items FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "order_items_public_select" ON order_items;
CREATE POLICY "order_items_public_select" ON order_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "addresses_public_insert" ON customer_addresses;
CREATE POLICY "addresses_public_insert" ON customer_addresses FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "addresses_public_select" ON customer_addresses;
CREATE POLICY "addresses_public_select" ON customer_addresses FOR SELECT USING (true);

DROP POLICY IF EXISTS "payments_public_select" ON payments;
CREATE POLICY "payments_public_select" ON payments FOR SELECT USING (true);

DROP POLICY IF EXISTS "users_public_select" ON users;
CREATE POLICY "users_public_select" ON users FOR SELECT USING (true);

DROP POLICY IF EXISTS "users_public_insert" ON users;
CREATE POLICY "users_public_insert" ON users FOR INSERT WITH CHECK (true);

-- Block client-side payment / order status tampering (server service role bypasses RLS)
DROP POLICY IF EXISTS "orders_no_client_update" ON orders;
CREATE POLICY "orders_no_client_update" ON orders FOR UPDATE USING (false);

DROP POLICY IF EXISTS "payments_no_client_insert" ON payments;
CREATE POLICY "payments_no_client_insert" ON payments FOR INSERT WITH CHECK (false);

DROP POLICY IF EXISTS "products_no_client_update" ON products;
CREATE POLICY "products_no_client_update" ON products FOR UPDATE USING (false);
