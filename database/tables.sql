create table categories (
  id bigint primary key generated always as identity,
  name text not null,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz,
  deleted_at timestamptz
);

create table products (
  id bigint primary key generated always as identity,
  name text not null,
  description text,
  category_id bigint references categories (id),
  price numeric(10, 2) not null,
  created_at timestamptz default now(),
  updated_at timestamptz,
  deleted_at timestamptz
);

create table purchases (
  id bigint primary key generated always as identity,
  supplier_name text not null,
  total_amount numeric(10, 2) not null,
  purchase_date timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz,
  deleted_at timestamptz
);

create table purchase_details (
  id bigint primary key generated always as identity,
  purchase_id bigint references purchases (id),
  product_id bigint references products (id),
  quantity int not null,
  unit_price numeric(10, 2) not null,
  created_at timestamptz default now(),
  updated_at timestamptz,
  deleted_at timestamptz
);

create table sales (
  id bigint primary key generated always as identity,
  customer_name text not null,
  total_amount numeric(10, 2) not null,
  sale_date timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz,
  deleted_at timestamptz
);

create table sale_details (
  id bigint primary key generated always as identity,
  sale_id bigint references sales (id),
  product_id bigint references products (id),
  quantity int not null,
  unit_price numeric(10, 2) not null,
  created_at timestamptz default now(),
  updated_at timestamptz,
  deleted_at timestamptz
);

create table inventory_batches (
  id bigint primary key generated always as identity,
  product_id bigint references products (id),
  batch_number text not null,
  expiration_date date,
  quantity int not null,
  created_at timestamptz default now(),
  updated_at timestamptz,
  deleted_at timestamptz
);

create table inventory_movements (
  id bigint primary key generated always as identity,
  product_id bigint references products (id),
  movement_type text check (
    movement_type in ('purchase', 'sale', 'adjustment', 'waste')
  ),
  quantity int not null,
  movement_date timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz,
  deleted_at timestamptz
);

create table product_wastes (
  id bigint primary key generated always as identity,
  product_id bigint references products (id),
  reason text not null,
  quantity int not null,
  waste_date timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz,
  deleted_at timestamptz
);

create table users (
  id bigint primary key generated always as identity,
  username text not null unique,
  email text not null unique,
  avatar_url text null ,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz,
  deleted_at timestamptz
);

create table roles (
  id bigint primary key generated always as identity,
  name text not null unique,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz,
  deleted_at timestamptz
);

create table permissions (
  id bigint primary key generated always as identity,
  name text not null unique,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz,
  deleted_at timestamptz
);

create table role_permissions (
  role_id bigint references roles (id),
  permission_id bigint references permissions (id),
  primary key (role_id, permission_id)
);

alter table users
add column role_id bigint references roles (id);

create table inventory_audit (
  id bigint primary key generated always as identity,
  user_id bigint references users (id),
  action text not null,
  product_id bigint references products (id),
  quantity int,
  action_date timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz,
  deleted_at timestamptz
);

alter table purchases
add column user_id bigint references users (id);

alter table sales
add column user_id bigint references users (id);

alter table inventory_movements
add column user_id bigint references users (id);

alter table product_wastes
add column user_id bigint references users (id);