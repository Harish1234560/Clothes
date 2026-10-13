export type Category = { slug: string; name: string };
export type Swatch = { name: string; hex: string };
export type Product = {
  id: number;
  slug: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  colors: Swatch[];
  sizes: string[];
  description: string;
  benefits: string[];
  care: string[];
  details: { reference: string; weight: string; material: string };
  tags: Array<'new' | 'featured' | 'bestseller'>;
  tint: string;
  image: string;
  wearingImage: string;
};

export const categories: Category[] = [
  { slug: 't-shirts', name: 'T-Shirts' },
  { slug: 'hoodies-sweatshirts', name: 'Hoodies & Sweatshirts' },
  { slug: 'jackets-outerwear', name: 'Jackets & Outerwear' },
  { slug: 'pants-trousers', name: 'Pants & Trousers' },
  { slug: 'shirts', name: 'Shirts' },
  { slug: 'shoes-sneakers', name: 'Shoes & Sneakers' },
  { slug: 'hats', name: 'Hats' },
];

export const USD_TO_INR_RATE = 85;
export const MIN_PRODUCT_PRICE_INR = 2000;
export const MAX_PRODUCT_PRICE_INR = 5000;

const SOURCE_PRICE_MIN = 29;
const SOURCE_PRICE_MAX = 449;
const priceInInr = (sourcePrice: number) =>
  Math.round(
    MIN_PRODUCT_PRICE_INR
      + ((sourcePrice - SOURCE_PRICE_MIN) / (SOURCE_PRICE_MAX - SOURCE_PRICE_MIN))
        * (MAX_PRODUCT_PRICE_INR - MIN_PRODUCT_PRICE_INR),
  );

type Row = [
  name: string, cat: string, price: number, old: number, rating: number,
  tags: string, tint: string, color: string, material: string, kg: number,
];

const rows: Row[] = [
  ['Dark Brown Leather Biker Jacket', 'jackets-outerwear', 349, 429, 3.8, 'bestseller,featured', '#3b2a22', 'Dark Brown', 'Leather', 1.6],
  ['Camel Wool Trench Coat', 'jackets-outerwear', 449, 0, 3.9, 'featured,new', '#b9803f', 'Camel', 'Wool blend', 1.4],
  ['Army Green Puffer Jacket', 'jackets-outerwear', 189, 229, 4.3, 'new,bestseller', '#4b5a3a', 'Army Green', 'Recycled polyester', 0.9],
  ['Indigo Denim Trucker Jacket', 'jackets-outerwear', 119, 0, 3.6, 'new', '#31507a', 'Indigo', 'Cotton denim', 0.8],
  ['Olive Bomber Jacket', 'jackets-outerwear', 159, 0, 4.4, 'new,featured', '#5a5f3a', 'Olive', 'Nylon', 0.7],
  ['Navy Striped Polo Shirt', 'shirts', 49, 59, 4.0, 'new', '#1d2540', 'Navy', 'Cotton piqué', 0.25],
  ['Forest Green Half-Zip Sweatshirt', 'hoodies-sweatshirts', 89, 109, 3.9, 'new', '#1f4d3a', 'Forest Green', 'Cotton fleece', 0.6],
  ['Khaki Chinos', 'pants-trousers', 79, 99, 4.3, 'new', '#b79b72', 'Khaki', 'Cotton twill', 0.5],
  ['Camel Wool Flat Cap', 'hats', 45, 55, 3.8, 'new', '#c49a6c', 'Camel', 'Wool', 0.13],
  ['Rust Corduroy Baseball Cap', 'hats', 39, 49, 4.1, 'new,bestseller', '#b4521f', 'Rust', 'Cotton corduroy', 0.1],
  ['Tan Leather Chelsea Boots', 'shoes-sneakers', 199, 249, 3.1, 'new', '#a5622f', 'Tan', 'Leather', 1.2],
  ['Forest Green Ribbed Beanie', 'hats', 32, 0, 4.0, 'new', '#1f4d3a', 'Forest Green', 'Acrylic knit', 0.1],
  ['Mustard Bucket Hat', 'hats', 35, 0, 4.2, 'new', '#d79a2a', 'Mustard', 'Cotton twill', 0.1],
  ['Teal Five-Panel Cap', 'hats', 37, 0, 4.0, 'new', '#1f5a66', 'Teal', 'Nylon', 0.1],
  ['Plain White Crew-Neck T-Shirt', 't-shirts', 29, 39, 4.4, 'bestseller', '#eeeeee', 'White', 'Cotton', 0.2],
  ['Navy Zip-Up Hoodie', 'hoodies-sweatshirts', 79, 99, 3.7, 'bestseller', '#15203c', 'Navy', 'Cotton fleece', 0.7],
  ['Slim-Fit Raw Indigo Jeans', 'pants-trousers', 109, 0, 3.7, 'bestseller,featured', '#243b63', 'Indigo', 'Raw denim', 0.8],
  ['Red & Black Flannel Shirt', 'shirts', 69, 89, 4.1, 'featured', '#8a1c1c', 'Red & Black', 'Cotton flannel', 0.45],
  ['Grey Performance Runners', 'shoes-sneakers', 149, 0, 4.2, 'new', '#5b6068', 'Grey', 'Mesh and rubber', 0.6],
  ['Beige Linen Shirt', 'shirts', 59, 0, 4.0, 'featured', '#cbbfa8', 'Beige', 'Linen', 0.3],
  ['White Oxford Button-Down Shirt', 'shirts', 65, 0, 3.8, 'bestseller', '#f1f1ee', 'White', 'Cotton oxford', 0.3],
  ['Chambray Work Shirt', 'shirts', 69, 0, 3.9, '', '#6c88a8', 'Chambray', 'Cotton chambray', 0.35],
  ['Olive Cargo Pants', 'pants-trousers', 89, 0, 4.0, 'featured', '#5b5f3d', 'Olive', 'Cotton twill', 0.6],
  ['Washed Black Jeans', 'pants-trousers', 99, 0, 3.8, '', '#2a2a2d', 'Washed Black', 'Stretch denim', 0.75],
  ['Black Slim Chinos', 'pants-trousers', 79, 0, 3.9, '', '#1b1b1d', 'Black', 'Cotton twill', 0.5],
  ['Cream Oversized Hoodie', 'hoodies-sweatshirts', 85, 0, 4.1, 'featured', '#e4d9c5', 'Cream', 'Cotton fleece', 0.7],
  ['Charcoal Pullover Hoodie', 'hoodies-sweatshirts', 75, 0, 4.0, '', '#3a3b3f', 'Charcoal', 'Cotton fleece', 0.7],
  ['Heather Grey T-Shirt', 't-shirts', 29, 0, 3.9, 'bestseller', '#9a9ca1', 'Heather Grey', 'Cotton', 0.2],
  ['Black Henley T-Shirt', 't-shirts', 39, 0, 3.8, '', '#141416', 'Black', 'Cotton', 0.22],
  ['Olive Puffer Vest', 'jackets-outerwear', 99, 0, 4.0, '', '#4b5a3a', 'Olive', 'Recycled polyester', 0.5],
  ['Charcoal Wool Overcoat', 'jackets-outerwear', 399, 0, 3.7, 'featured', '#3d3e42', 'Charcoal', 'Wool blend', 1.5],
  ['Tan Suede Penny Loafers', 'shoes-sneakers', 139, 0, 4.0, 'featured', '#a8744a', 'Tan', 'Suede', 0.8],
  ['White Leather Sneakers', 'shoes-sneakers', 119, 0, 4.1, 'bestseller', '#f0f0f0', 'White', 'Leather', 0.9],
  ['White High-Top Canvas Sneakers', 'shoes-sneakers', 89, 0, 4.1, '', '#e8e8e8', 'White', 'Canvas', 0.8],
  ['Black Merino Beanie', 'hats', 34, 0, 4.0, '', '#151517', 'Black', 'Merino wool', 0.1],
];

const wearingPhotos: Record<string, string[]> = {
  't-shirts': ['tan-jacket.jpg', 'striped-scarf.jpg', 'black-suit.jpg'],
  'hoodies-sweatshirts': ['tan-jacket.jpg', 'winter-coat.jpg', 'black-suit.jpg'],
  'jackets-outerwear': ['tan-jacket.jpg', 'winter-coat.jpg', 'black-suit.jpg'],
  'pants-trousers': ['tan-jacket.jpg', 'winter-coat.jpg', 'blue-suit.jpg'],
  shirts: ['blue-suit.jpg', 'striped-scarf.jpg', 'black-suit.jpg'],
  'shoes-sneakers': ['blue-suit.jpg', 'winter-coat.jpg', 'tan-jacket.jpg'],
  hats: ['beret-look.jpg', 'striped-scarf.jpg', 'tan-jacket.jpg'],
};

const prefix: Record<string, string> = {
  't-shirts': 'TEE', 'hoodies-sweatshirts': 'HOD', 'jackets-outerwear': 'JKT',
  'pants-trousers': 'PNT', shirts: 'SHT', 'shoes-sneakers': 'SHO', hats: 'HAT',
};

const copy: Record<string, { benefits: string[]; care: string[] }> = {
  't-shirts': {
    benefits: ['Soft, breathable fabric for all-day comfort.', 'Pre-shrunk and holds its shape wash after wash.', 'Clean neckline that layers well.'],
    care: ['Machine wash cold with similar colours.', 'Tumble dry low.', 'Do not bleach.'],
  },
  'hoodies-sweatshirts': {
    benefits: ['Brushed interior for warmth without bulk.', 'Reinforced seams and ribbed cuffs.', 'Relaxed fit that sits well over a tee.'],
    care: ['Machine wash cold, inside out.', 'Line dry or tumble dry low.', 'Do not iron the print or trims.'],
  },
  'jackets-outerwear': {
    benefits: ['Built to insulate and block the wind.', 'Reinforced seams and finished edges throughout.', 'Tailored shoulder line that layers over knitwear.'],
    care: ['Dry clean or spot clean only.', 'Steam rather than iron to release creases.', 'Store on a wide hanger to hold the shoulder line.'],
  },
  'pants-trousers': {
    benefits: ['Durable fabric with a clean, structured drape.', 'Reinforced pockets and stitched seams.', 'Comfortable through the waist and seat.'],
    care: ['Machine wash cold, inside out.', 'Hang dry to keep the fit.', 'Iron on medium heat if needed.'],
  },
  shirts: {
    benefits: ['Breathable fabric that softens with every wash.', 'Reinforced seams and finished edges throughout.', 'Colour-fast dye that resists fading.'],
    care: ['Machine wash cold.', 'Hang dry to prevent shrinking.', 'Iron on medium heat while slightly damp.'],
  },
  'shoes-sneakers': {
    benefits: ['Cushioned insole for everyday comfort.', 'Durable outsole with reliable grip.', 'Clean profile that works with most outfits.'],
    care: ['Wipe clean with a soft damp cloth.', 'Air dry away from direct heat.', 'Use shoe trees to keep the shape.'],
  },
  hats: {
    benefits: ['Holds its shape and insulates without bulk.', 'Reinforced seams and finished edges throughout.', 'Colour-fast dye that resists fading in the wash.'],
    care: ['Spot clean or hand wash cold.', 'Steam rather than iron to release creases.', 'Store flat or on a hat stand.'],
  },
};

const sizesFor = (cat: string) =>
  cat === 'hats' ? ['One Size']
    : cat === 'shoes-sneakers' ? ['7', '8', '9', '10', '11', '12']
    : cat === 'pants-trousers' ? ['28', '30', '32', '34', '36']
    : ['S', 'M', 'L', 'XL', 'XXL'];

export const slugify = (s: string) =>
  s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const counters: Record<string, number> = {};
const wearingCounters: Record<string, number> = {};

export const products: Product[] = rows.map((r, i) => {
  const [name, category, price, old, rating, tags, tint, color, material, kg] = r;
  counters[category] = (counters[category] ?? 0) + 1;
  const wearingOptions = wearingPhotos[category];
  const wearingIndex = wearingCounters[category] ?? 0;
  wearingCounters[category] = wearingIndex + 1;
  const priceInr = priceInInr(price);
  const slug = slugify(name);
  const base: Swatch[] = [
    { name: color, hex: tint },
    { name: 'Black', hex: '#111113' },
    { name: 'Slate', hex: '#3a3f45' },
    { name: 'Navy', hex: '#1b2340' },
  ];
  const colors = base.filter((c, idx) => base.findIndex((x) => x.name === c.name) === idx);
  return {
    id: i + 1,
    slug,
    name,
    category,
    price: priceInr,
    oldPrice: old > 0 ? priceInInr(old) : undefined,
    rating,
    reviews: 8 + ((i + 1) * 7) % 40,
    colors,
    sizes: sizesFor(category),
    description: `${name}: ${material.toLowerCase()} construction in ${color.toLowerCase()}, cut for a clean modern line and made to be worn for years.`,
    benefits: copy[category].benefits,
    care: copy[category].care,
    details: {
      reference: `${prefix[category]}-${String(counters[category]).padStart(3, '0')}`,
      weight: `${kg} kg`,
      material,
    },
    tags: tags.split(',').filter(Boolean) as Product['tags'],
    tint,
    image: `/products/${slug}.jpg`,
    wearingImage: `/products/worn/${wearingOptions[wearingIndex % wearingOptions.length]}`,
  };
});

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const byCategory = (cat: string) => products.filter((p) => p.category === cat);
export const categoryName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? slug;

export const money = (n: number, decimals = false) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: decimals ? 2 : 0,
    maximumFractionDigits: decimals ? 2 : 0,
  }).format(n);

export const FREE_SHIPPING_OVER = 75 * USD_TO_INR_RATE;
export const SHIPPING_FEE = 7.5 * USD_TO_INR_RATE;
export const shippingFor = (subtotal: number) =>
  subtotal === 0 || subtotal >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FEE;
