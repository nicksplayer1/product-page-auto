alter table product_pages
add column if not exists website_url text,
add column if not exists shopee_url text,
add column if not exists mercadolivre_url text,
add column if not exists instagram_url text,
add column if not exists custom_button_label text,
add column if not exists custom_button_url text;
