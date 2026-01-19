-- EL SOFT Web3 Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Users table (wallet-based authentication)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  wallet_address TEXT PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  nickname TEXT,
  email TEXT,
  last_login TIMESTAMP WITH TIME ZONE,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'))
);

-- ============================================
-- Products table (Security Fix #3)
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_ko TEXT,  -- Korean name
  description TEXT,
  description_ko TEXT,  -- Korean description
  price DECIMAL(20, 6) NOT NULL,  -- Price in USDT (6 decimals)
  currency TEXT DEFAULT 'USDT',
  category TEXT DEFAULT 'software',
  
  -- Download & License info
  download_url TEXT,  -- Encrypted/secure download URL (legacy)
  file_path TEXT,  -- Path in private storage bucket (software-files)
  license_type TEXT DEFAULT 'single' CHECK (license_type IN ('single', 'team', 'enterprise', 'subscription')),
  license_duration_days INTEGER,  -- NULL for permanent licenses
  
  -- Product status
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  
  -- Metadata
  image_url TEXT,
  version TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Orders table
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address TEXT NOT NULL REFERENCES users(wallet_address),
  product_id TEXT NOT NULL REFERENCES products(id),
  product_name TEXT,
  amount DECIMAL(20, 6) NOT NULL, -- USDT amount with 6 decimals
  tx_hash TEXT,
  chain_id INTEGER DEFAULT 137, -- Polygon mainnet
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'paid', 'delivered', 'failed', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paid_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  block_number BIGINT,
  gas_used BIGINT,
  error_message TEXT
);

-- ============================================
-- Downloads table (Track delivery)
-- ============================================
CREATE TABLE IF NOT EXISTS downloads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id),
  wallet_address TEXT NOT NULL REFERENCES users(wallet_address),
  product_id TEXT NOT NULL REFERENCES products(id),
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT,
  download_count INTEGER DEFAULT 1
);

-- ============================================
-- Partner/Referral table
-- ============================================
CREATE TABLE IF NOT EXISTS partners (
  wallet_address TEXT PRIMARY KEY REFERENCES users(wallet_address),
  partner_code TEXT UNIQUE NOT NULL,
  commission_rate DECIMAL(5, 4) DEFAULT 0.05, -- 5% default
  is_approved BOOLEAN DEFAULT false,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  total_referrals INTEGER DEFAULT 0,
  total_earnings DECIMAL(20, 6) DEFAULT 0
);

-- ============================================
-- Views
-- ============================================

-- Purchase history view (for easy querying)
CREATE OR REPLACE VIEW purchase_history AS
SELECT 
  o.id,
  o.wallet_address,
  o.product_id,
  o.product_name,
  o.amount,
  o.tx_hash,
  o.status,
  o.created_at,
  o.paid_at,
  o.delivered_at,
  p.download_url,
  p.license_type,
  u.nickname,
  u.email
FROM orders o
LEFT JOIN users u ON o.wallet_address = u.wallet_address
LEFT JOIN products p ON o.product_id = p.id
ORDER BY o.created_at DESC;

-- ============================================
-- Indexes for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_orders_wallet_address ON orders(wallet_address);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_tx_hash ON orders(tx_hash);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_downloads_wallet ON downloads(wallet_address);
CREATE INDEX IF NOT EXISTS idx_downloads_order ON downloads(order_id);

-- ============================================
-- Row Level Security (RLS)
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- Users can only read/update their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (wallet_address = current_setting('app.wallet_address', true));

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (wallet_address = current_setting('app.wallet_address', true));

-- Users can view their own orders
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (wallet_address = current_setting('app.wallet_address', true));

-- Users can view their own downloads
CREATE POLICY "Users can view own downloads" ON downloads
  FOR SELECT USING (wallet_address = current_setting('app.wallet_address', true));

-- Everyone can view active products
CREATE POLICY "Anyone can view active products" ON products
  FOR SELECT USING (is_active = true);

-- Admins can manage products (Insert/Update/Delete)
CREATE POLICY "Admins can manage products" ON products
  FOR ALL USING (
    (SELECT role FROM users WHERE wallet_address = current_setting('app.wallet_address', true)) = 'admin'
  );

-- Admins can update orders (e.g. mark as paid)
CREATE POLICY "Admins can update orders" ON orders
  FOR UPDATE USING (
    (SELECT role FROM users WHERE wallet_address = current_setting('app.wallet_address', true)) = 'admin'
  );

-- Service role can do everything (for backend verification)
CREATE POLICY "Service role full access to users" ON users
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to orders" ON orders
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to products" ON products
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to downloads" ON downloads
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to partners" ON partners
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- Functions
-- ============================================

-- Function to create order
CREATE OR REPLACE FUNCTION create_order(
  p_wallet_address TEXT,
  p_product_id TEXT,
  p_product_name TEXT,
  p_amount DECIMAL,
  p_chain_id INTEGER DEFAULT 137
) RETURNS UUID AS $$
DECLARE
  new_order_id UUID;
  v_product_price DECIMAL;
BEGIN
  -- Check if product exists and is active
  SELECT price INTO v_product_price
  FROM products
  WHERE id = p_product_id AND is_active = true;
  
  IF v_product_price IS NULL THEN
    RAISE EXCEPTION 'Product does not exist or is not active';
  END IF;
  
  -- Validate amount matches product price
  IF p_amount < v_product_price THEN
    RAISE EXCEPTION 'Payment amount is less than product price';
  END IF;

  -- Ensure user exists
  INSERT INTO users (wallet_address)
  VALUES (LOWER(p_wallet_address))
  ON CONFLICT (wallet_address) DO NOTHING;
  
  -- Create order
  INSERT INTO orders (wallet_address, product_id, product_name, amount, chain_id)
  VALUES (LOWER(p_wallet_address), p_product_id, p_product_name, p_amount, p_chain_id)
  RETURNING id INTO new_order_id;
  
  RETURN new_order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to verify and complete payment
CREATE OR REPLACE FUNCTION verify_payment(
  p_order_id UUID,
  p_tx_hash TEXT,
  p_block_number BIGINT,
  p_gas_used BIGINT
) RETURNS BOOLEAN AS $$
BEGIN
  UPDATE orders
  SET 
    status = 'paid',
    tx_hash = p_tx_hash,
    block_number = p_block_number,
    gas_used = p_gas_used,
    paid_at = NOW()
  WHERE id = p_order_id AND status = 'pending';
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get download link (only for paid orders)
CREATE OR REPLACE FUNCTION get_download_link(
  p_wallet_address TEXT,
  p_product_id TEXT
) RETURNS TABLE(download_url TEXT, product_name TEXT, license_type TEXT) AS $$
BEGIN
  -- Check if user has paid for this product
  IF NOT EXISTS (
    SELECT 1 FROM orders 
    WHERE wallet_address = LOWER(p_wallet_address)
    AND product_id = p_product_id 
    AND status IN ('paid', 'delivered')
  ) THEN
    RETURN;
  END IF;
  
  -- Return download info
  RETURN QUERY
  SELECT p.download_url, p.name, p.license_type
  FROM products p
  WHERE p.id = p_product_id AND p.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to record download
CREATE OR REPLACE FUNCTION record_download(
  p_wallet_address TEXT,
  p_product_id TEXT,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_order_id UUID;
  v_download_id UUID;
BEGIN
  -- Find the paid order
  SELECT id INTO v_order_id
  FROM orders
  WHERE wallet_address = LOWER(p_wallet_address)
  AND product_id = p_product_id
  AND status IN ('paid', 'delivered')
  ORDER BY paid_at DESC
  LIMIT 1;
  
  IF v_order_id IS NULL THEN
    RAISE EXCEPTION 'No valid order found for this product';
  END IF;
  
  -- Record download
  INSERT INTO downloads (order_id, wallet_address, product_id, ip_address, user_agent)
  VALUES (v_order_id, LOWER(p_wallet_address), p_product_id, p_ip_address, p_user_agent)
  RETURNING id INTO v_download_id;
  
  -- Update order status to delivered
  UPDATE orders
  SET status = 'delivered', delivered_at = NOW()
  WHERE id = v_order_id AND status = 'paid';
  
  RETURN v_download_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark payment as failed
CREATE OR REPLACE FUNCTION fail_payment(
  p_order_id UUID,
  p_error_message TEXT
) RETURNS BOOLEAN AS $$
BEGIN
  UPDATE orders
  SET 
    status = 'failed',
    error_message = p_error_message
  WHERE id = p_order_id AND status IN ('pending', 'processing');
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Sample Products (for testing)
-- ============================================
INSERT INTO products (id, name, name_ko, price, description, description_ko, category, license_type, is_active, is_featured)
VALUES 
  ('jetbrains-all', 'JetBrains All Products Pack', 'JetBrains 전체 제품 팩', 249.00, 'Access to all JetBrains IDEs including IntelliJ IDEA, PyCharm, WebStorm, and more', 'IntelliJ IDEA, PyCharm, WebStorm 등 모든 JetBrains IDE 이용 가능', 'ide', 'single', true, true),
  ('ms365-personal', 'Microsoft 365 Personal', 'Microsoft 365 개인용', 99.00, 'Word, Excel, PowerPoint, Outlook and 1TB OneDrive storage', 'Word, Excel, PowerPoint, Outlook 및 1TB OneDrive 저장공간', 'office', 'subscription', true, true),
  ('adobe-cc', 'Adobe Creative Cloud', 'Adobe Creative Cloud', 599.00, 'Full access to Photoshop, Illustrator, Premiere Pro and all Creative Cloud apps', 'Photoshop, Illustrator, Premiere Pro 등 모든 Creative Cloud 앱 이용 가능', 'design', 'subscription', true, true)
ON CONFLICT (id) DO NOTHING;
