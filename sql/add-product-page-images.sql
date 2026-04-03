create table if not exists product_page_images (
  id uuid primary key default gen_random_uuid(),
  product_page_id uuid not null references product_pages(id) on delete cascade,
  image_url text not null,
  sort_order int default 0,
  created_at timestamptz default now()
);

create index if not exists idx_product_page_images_product_page_id
on product_page_images(product_page_id);

create index if not exists idx_product_page_images_sort_order
on product_page_images(product_page_id, sort_order);
