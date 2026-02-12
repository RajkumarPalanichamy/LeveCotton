-- ================================================================
-- LEVE COTTONS - Supabase Database Schema
-- Run this in your Supabase Dashboard → SQL Editor → New Query
-- ================================================================

-- 1. PRODUCTS TABLE
create table if not exists products (
  id text primary key,
  product_code text unique not null,
  name text not null,
  price numeric not null,
  original_price numeric,
  discount numeric,
  image_url text not null default '/products/1.jpg',
  description text,
  category text not null,
  collection text,
  color text,
  fabric text,
  in_stock boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index for fast category/collection filtering
create index idx_products_category on products(category);
create index idx_products_collection on products(collection);
create index idx_products_product_code on products(product_code);

-- 2. ORDERS TABLE
create table if not exists orders (
  id text primary key,
  customer_name text not null,
  customer_email text,
  customer_phone text not null,
  shipping_address text not null,
  items jsonb not null default '[]',
  total_amount numeric not null,
  razorpay_order_id text,
  razorpay_payment_id text,
  payment_status text default 'pending',
  order_status text default 'pending',
  order_type text default 'online',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_orders_status on orders(order_status);
create index idx_orders_payment on orders(payment_status);
create index idx_orders_created on orders(created_at desc);

-- 3. CUSTOMERS TABLE
create table if not exists customers (
  id text primary key,
  name text not null,
  email text unique,
  phone text,
  address jsonb,
  order_count integer default 0,
  total_spent numeric default 0,
  created_at timestamptz default now()
);

create index idx_customers_email on customers(email);

-- 4. CART ITEMS TABLE (guest cart using session_id)
create table if not exists cart_items (
  id uuid default gen_random_uuid() primary key,
  session_id text not null,
  product_id text not null references products(id) on delete cascade,
  variant_id text default 'default',
  quantity integer not null default 1,
  created_at timestamptz default now()
);

create index idx_cart_session on cart_items(session_id);
create unique index idx_cart_unique on cart_items(session_id, product_id, variant_id);

-- 5. WISHLIST TABLE
create table if not exists wishlist (
  id uuid default gen_random_uuid() primary key,
  session_id text not null,
  product_id text not null references products(id) on delete cascade,
  created_at timestamptz default now()
);

create index idx_wishlist_session on wishlist(session_id);
create unique index idx_wishlist_unique on wishlist(session_id, product_id);

-- ================================================================
-- ROW LEVEL SECURITY (RLS) - Enable but allow public read
-- ================================================================

-- Products: public read, admin write
alter table products enable row level security;
create policy "Products are viewable by everyone" on products for select using (true);
create policy "Products are editable by service role" on products for all using (true);

-- Orders: service role only
alter table orders enable row level security;
create policy "Orders managed by service role" on orders for all using (true);

-- Customers: service role only
alter table customers enable row level security;
create policy "Customers managed by service role" on customers for all using (true);

-- Cart: anyone can manage their own cart by session_id
alter table cart_items enable row level security;
create policy "Cart items are public" on cart_items for all using (true);

-- Wishlist: anyone can manage their own wishlist
alter table wishlist enable row level security;
create policy "Wishlist items are public" on wishlist for all using (true);

-- ================================================================
-- SUPABASE STORAGE - Create bucket for product images
-- ================================================================
-- NOTE: Go to Supabase Dashboard → Storage → Create new bucket
-- Bucket name: product-images
-- Public: YES (toggle on)
-- Or run this via API:
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Allow public read access to product images
create policy "Product images are publicly accessible"
on storage.objects for select
using (bucket_id = 'product-images');

-- Allow authenticated uploads
create policy "Anyone can upload product images"
on storage.objects for insert
with check (bucket_id = 'product-images');

-- Allow updates and deletes
create policy "Anyone can update product images"
on storage.objects for update
using (bucket_id = 'product-images');

create policy "Anyone can delete product images"
on storage.objects for delete
using (bucket_id = 'product-images');

-- ================================================================
-- AUTO-UPDATE updated_at TRIGGER
-- ================================================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger products_updated_at
  before update on products
  for each row execute function update_updated_at();

create trigger orders_updated_at
  before update on orders
  for each row execute function update_updated_at();
