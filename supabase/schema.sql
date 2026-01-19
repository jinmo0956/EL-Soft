-- EL SOFT Web3 Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (wallet-based authentication)
CREATE TABLE IF NOT EXISTS users (
  wallet_address TEXT PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  nickname TEXT,
  email TEXT,
  last_login TIMESTAMP WITH TIME ZONE
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address TEXT NOT NULL REFERENCES users(wallet_address),
  product_id TEXT NOT NULL,
  product_name TEXT,
  amount DECIMAL(20, 6) NOT NULL, -- USDT amount with 6 decimals
  tx_hash TEXT,
  chain_id INTEGER DEFAULT 137, -- Polygon mainnet
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'paid', 'failed', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paid_at TIMESTAMP WITH TIME ZONE,
  block_number BIGINT,
  gas_used BIGINT,
  error_message TEXT
);

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
  u.nickname,
  u.email
FROM orders o
LEFT JOIN users u ON o.wallet_address = u.wallet_address
ORDER BY o.created_at DESC;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_wallet_address ON orders(wallet_address);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_tx_hash ON orders(tx_hash);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Users can only read/update their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (wallet_address = current_setting('app.wallet_address', true));

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (wallet_address = current_setting('app.wallet_address', true));

-- Users can view their own orders
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (wallet_address = current_setting('app.wallet_address', true));

-- Service role can do everything (for backend verification)
CREATE POLICY "Service role full access to users" ON users
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to orders" ON orders
  FOR ALL USING (auth.role() = 'service_role');

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
BEGIN
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
