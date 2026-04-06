alter table product_pages
add column if not exists theme text default 'clean';
