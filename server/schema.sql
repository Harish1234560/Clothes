CREATE TABLE IF NOT EXISTS products (
  id text PRIMARY KEY,
  name text NOT NULL,
  price_cents integer NOT NULL CHECK (price_cents >= 0),
  old_price_cents integer CHECK (old_price_cents >= 0),
  image_url text NOT NULL,
  rating numeric(2, 1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
  tag text
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  email text PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO products (id, name, price_cents, old_price_cents, image_url, rating, tag)
VALUES
  ('dark-brown-leather-biker-jacket', 'Dark Brown Leather Biker Jacket', 428600, 485700, 'https://images.pexels.com/photos/12955710/pexels-photo-12955710.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 3.8, 'JUST IN'),
  ('rust-corduroy-baseball-cap', 'Rust Corduroy Baseball Cap', 207100, 214300, 'https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 4.1, NULL),
  ('beige-linen-shirt', 'Beige Linen Shirt', 221400, NULL, 'https://images.pexels.com/photos/22441291/pexels-photo-22441291.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 4.9, 'BESTSELLER'),
  ('tobacco-suede-chelsea-boots', 'Tobacco Suede Chelsea Boots', 321400, NULL, 'https://images.pexels.com/photos/9397837/pexels-photo-9397837.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 4.7, NULL)
ON CONFLICT (id) DO NOTHING;
