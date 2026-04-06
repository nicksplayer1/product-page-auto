create table if not exists product_page_clicks (
  id uuid primary key default gen_random_uuid(),
  product_page_id uuid not null references product_pages(id) on delete cascade,
  button_type text not null,
  destination_url text,
  created_at timestamptz default now()
);

create index if not exists idx_product_page_clicks_product_page_id
on product_page_clicks(product_page_id);

create index if not exists idx_product_page_clicks_created_at
on product_page_clicks(created_at);
