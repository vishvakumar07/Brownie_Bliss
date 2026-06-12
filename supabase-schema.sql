-- ============================================================
-- BROWNIE BLISS — SUPABASE DATABASE SCHEMA & MIGRATION
-- Run this entire script in your Supabase SQL Editor.
-- Dashboard → SQL Editor → New Query → Paste → Run
-- ============================================================

-- ──────────────────────────────────────────────────────────
-- 1. PRODUCTS TABLE
-- ──────────────────────────────────────────────────────────
create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  price       numeric(10, 2) not null default 0,
  stock       integer not null default 0,
  active      boolean not null default true,
  image_url   text,
  category    text default 'classic',
  badge       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Alter existing products table to ensure all columns exist
alter table public.products add column if not exists description text;
alter table public.products add column if not exists price numeric(10, 2) not null default 0;
alter table public.products add column if not exists stock integer not null default 0;
alter table public.products add column if not exists active boolean not null default true;
alter table public.products add column if not exists image_url text;
alter table public.products add column if not exists category text default 'classic';
alter table public.products add column if not exists badge text;
alter table public.products add column if not exists updated_at timestamptz not null default now();

-- Auto-update updated_at on row change
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at
before update on public.products
for each row execute procedure public.set_updated_at();


-- ──────────────────────────────────────────────────────────
-- 2. ORDERS TABLE
-- ──────────────────────────────────────────────────────────
create table if not exists public.orders (
  id                  uuid primary key default gen_random_uuid(),
  customer_name       text not null,
  phone               text,
  email               text,
  address             text,
  house_number        text,
  street_address      text,
  area                text,
  city                text,
  state               text,
  pincode             text,
  landmark            text,
  product_name        text not null,
  product_id          uuid references public.products(id) on delete set null,
  quantity            integer not null default 1,
  total               numeric(10, 2) not null default 0,
  payment_method      text not null default 'COD',
  special_instructions text,
  status              text not null default 'Pending'
                      check (status in ('Pending','Processing','Delivered','Cancelled')),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Alter existing products table to ensure slug column exists and is unique
alter table public.products add column if not exists slug text;
alter table public.products drop constraint if exists products_slug_key;
alter table public.products add constraint products_slug_key unique (slug);

-- ──────────────────────────────────────────────────────────
-- 1B. REVIEWS TABLE
-- ──────────────────────────────────────────────────────────
create table if not exists public.reviews (
  id             uuid primary key default gen_random_uuid(),
  product_id     uuid references public.products(id) on delete cascade,
  customer_name  text not null,
  customer_email text not null,
  rating         integer not null check (rating >= 1 and rating <= 5),
  review_title   text,
  review_content text not null,
  created_at     timestamptz not null default now()
);

-- Ensure RLS on reviews table
alter table public.reviews enable row level security;

drop policy if exists "Public can read reviews" on public.reviews;
create policy "Public can read reviews"
  on public.reviews for select
  using (true);

drop policy if exists "Anyone can insert reviews" on public.reviews;
create policy "Anyone can insert reviews"
  on public.reviews for insert
  with check (true);

-- ──────────────────────────────────────────────────────────
-- 2. ORDERS TABLE
-- ──────────────────────────────────────────────────────────
create table if not exists public.orders (
  id                  uuid primary key default gen_random_uuid(),
  customer_name       text not null,
  phone               text,
  email               text,
  address             text,
  house_number        text,
  street_address      text,
  area                text,
  city                text,
  state               text,
  pincode             text,
  landmark            text,
  product_name        text not null,
  product_id          uuid references public.products(id) on delete set null,
  quantity            integer not null default 1,
  total               numeric(10, 2) not null default 0,
  payment_method      text not null default 'COD',
  special_instructions text,
  status              text not null default 'Pending'
                      check (status in ('Pending','Processing','Delivered','Cancelled')),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Alter existing orders table to ensure all columns exist
alter table public.orders add column if not exists phone text;
alter table public.orders add column if not exists email text;
alter table public.orders add column if not exists address text;
alter table public.orders add column if not exists house_number text;
alter table public.orders add column if not exists street_address text;
alter table public.orders add column if not exists area text;
alter table public.orders add column if not exists city text;
alter table public.orders add column if not exists state text;
alter table public.orders add column if not exists pincode text;
alter table public.orders add column if not exists landmark text;
alter table public.orders add column if not exists product_name text not null default 'Classic Brownie';
alter table public.orders add column if not exists product_id uuid references public.products(id) on delete set null;
alter table public.orders add column if not exists quantity integer not null default 1;
alter table public.orders add column if not exists total numeric(10, 2) not null default 0;
alter table public.orders add column if not exists payment_method text not null default 'COD';
alter table public.orders add column if not exists special_instructions text;
alter table public.orders add column if not exists status text not null default 'Pending';
alter table public.orders add column if not exists updated_at timestamptz not null default now();

-- Ensure status check constraint exists
alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders add constraint orders_status_check 
  check (status in ('Pending','Processing','Delivered','Cancelled'));

drop trigger if exists trg_orders_updated_at on public.orders;
create trigger trg_orders_updated_at
before update on public.orders
for each row execute procedure public.set_updated_at();


-- ──────────────────────────────────────────────────────────
-- 3. CONTACT MESSAGES TABLE
-- ──────────────────────────────────────────────────────────
create table if not exists public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  phone      text,
  message    text not null,
  read       boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.contact_messages add column if not exists name text not null default '';
alter table public.contact_messages add column if not exists email text not null default '';
alter table public.contact_messages add column if not exists phone text;
alter table public.contact_messages add column if not exists message text not null default '';
alter table public.contact_messages add column if not exists read boolean not null default false;
alter table public.contact_messages add column if not exists created_at timestamptz not null default now();


-- ──────────────────────────────────────────────────────────
-- 4. ROW LEVEL SECURITY (RLS) & POLICIES
-- ──────────────────────────────────────────────────────────

-- Enable RLS on all tables
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.contact_messages enable row level security;

-- Products policies
drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products"
  on public.products for select
  using (active = true);

drop policy if exists "Service role full access products" on public.products;
create policy "Service role full access products"
  on public.products for all
  using (auth.role() = 'service_role');

drop policy if exists "Anon can manage products" on public.products;
create policy "Anon can manage products"
  on public.products for all
  using (true)
  with check (true);

-- Orders policies
drop policy if exists "Anyone can insert orders" on public.orders;
create policy "Anyone can insert orders"
  on public.orders for insert
  with check (true);

drop policy if exists "Anon can manage orders" on public.orders;
create policy "Anon can manage orders"
  on public.orders for all
  using (true)
  with check (true);

-- Contact messages policies
drop policy if exists "Anyone can insert contact messages" on public.contact_messages;
create policy "Anyone can insert contact messages"
  on public.contact_messages for insert
  with check (true);

drop policy if exists "Anon can read contact messages" on public.contact_messages;
create policy "Anon can read contact messages"
  on public.contact_messages for select
  using (true);

drop policy if exists "Anon can manage contact messages" on public.contact_messages;
create policy "Anon can manage contact messages"
  on public.contact_messages for all
  using (true)
  with check (true);


-- ──────────────────────────────────────────────────────────
-- 5. ENABLE REALTIME
-- ──────────────────────────────────────────────────────────
-- Required for live dashboard & orders updates
-- Note: Re-enabling publications to ensure no errors
drop publication if exists supabase_realtime;
create publication supabase_realtime;
alter publication supabase_realtime add table public.products;
alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.contact_messages;
alter publication supabase_realtime add table public.reviews;


-- ──────────────────────────────────────────────────────────
-- 6. SAMPLE PRODUCTS (2 demo records for analytics)
-- ──────────────────────────────────────────────────────────
-- Note: inserting with unique slug values
insert into public.products (name, slug, description, price, stock, active, category, badge)
values
  (
    'Classic Brownie',
    'classic-brownie',
    'Our signature rich, fudgy chocolate brownie with a perfect crackly top. Made with premium cocoa and Belgian chocolate.',
    149.00, 50, true, 'classic', 'Best Seller'
  ),
  (
    'Nutella Brownie',
    'nutella-brownie',
    'Decadent brownie swirled with creamy Nutella hazelnut spread. A chocolate lover''s dream come true.',
    179.00, 30, true, 'premium', 'Popular'
  )
on conflict (slug) do update
set name = excluded.name,
    description = excluded.description,
    price = excluded.price,
    stock = excluded.stock,
    active = excluded.active,
    category = excluded.category,
    badge = excluded.badge;


-- ──────────────────────────────────────────────────────────
-- 7. STORAGE BUCKETS & POLICIES
-- ──────────────────────────────────────────────────────────

-- Create the bucket for product photos if it doesn't exist
insert into storage.buckets (id, name, public)
values ('product-photos', 'product-photos', true)
on conflict (id) do nothing;

-- Set up policies for the product-photos bucket to allow uploads and access
drop policy if exists "Public Access" on storage.objects;
create policy "Public Access"
  on storage.objects for select
  using (bucket_id = 'product-photos');

drop policy if exists "Allow Public Insert" on storage.objects;
create policy "Allow Public Insert"
  on storage.objects for insert
  with check (bucket_id = 'product-photos');

drop policy if exists "Allow Public Update" on storage.objects;
create policy "Allow Public Update"
  on storage.objects for update
  using (bucket_id = 'product-photos');

drop policy if exists "Allow Public Delete" on storage.objects;
create policy "Allow Public Delete"
  on storage.objects for delete
  using (bucket_id = 'product-photos');


-- ──────────────────────────────────────────────────────────
-- DONE ✓ All tables, storage buckets, RLS policies, and realtime are set up.
-- ──────────────────────────────────────────────────────────
