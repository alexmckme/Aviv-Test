CREATE TABLE IF NOT EXISTS public.prices
(
    id           serial           primary key,
    listing_id   integer          not null,
    price_eur    double precision not null,
    created_date timestamp,
    FOREIGN KEY (listing_id) REFERENCES public.listing(id)
);
