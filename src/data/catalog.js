import { SERVICE_FEE, categoryByQuery, categoryBySlug, categories } from './categories.js';

/**
 * Row order: id, name, brand, price, rating, reviews, shipping, deliveryDays, imageVariant, ...category specs
 * Spec column order follows the `specs` array of each category.
 */
const rows = {
  electronics: [
    ['aurio-air-2', 'Aurio Air 2', 'Aurio', 24, 4.6, 2431, 0, 2, 1, 32, 'IPX4', 4.2],
    ['lumo-wave-pro', 'Lumo Wave Pro', 'Lumo', 31, 4.8, 1204, 3, 3, 2, 38, 'IPX5', 5.1],
    ['kestrel-mini', 'Kestrel Mini Buds', 'Kestrel', 19, 4.3, 5912, 2, 2, 3, 24, 'IPX4', 4.0],
    ['orbit-echo-x', 'Orbit Echo X', 'Orbit', 27, 4.5, 3088, 0, 4, 4, 36, 'IPX5', 5.4],
    ['sona-flex-lite', 'Sona Flex Lite', 'Sona', 16, 4.1, 7540, 2, 3, 1, 20, 'IPX2', 3.6],
    ['vertex-anc-9', 'Vertex ANC-9', 'Vertex', 35, 4.7, 1876, 3, 2, 2, 30, 'IPX7', 5.6],
  ],
  fashion: [
    ['velo-run-flex', 'Velo Run Flex', 'Velo', 42, 4.5, 3412, 0, 3, 1, 4.5, 'Engineered knit', 240],
    ['atlas-court-low', 'Atlas Court Low', 'Atlas', 38, 4.3, 2190, 2, 2, 2, 3.8, 'Full-grain leather', 285],
    ['northline-trail-gtx', 'Northline Trail GTX', 'Northline', 56, 4.8, 986, 4, 4, 3, 4.8, 'Ripstop + GTX', 262],
    ['miro-street-01', 'Miro Street 01', 'Miro', 31, 4.2, 6704, 2, 3, 4, 3.4, 'Canvas blend', 268],
    ['terra-everyday-knit', 'Terra Everyday Knit', 'Terra', 27, 4.0, 4221, 0, 5, 1, 3.0, 'Recycled knit', 232],
    ['apex-lift-pro', 'Apex Lift Pro', 'Apex', 49, 4.7, 1532, 3, 2, 2, 4.6, 'Knit + suede', 255],
  ],
  beauty: [
    ['halo-vit-c-serum', 'Halo Vitamin C Serum', 'Halo', 22, 4.8, 6120, 1, 2, 1, 30, 'All skin types', true],
    ['dew-hydra-gel', 'Dew Hydra Gel', 'Dew', 17, 4.4, 3890, 0, 3, 2, 50, 'Dry skin', false],
    ['clara-gentle-cleanser', 'Clara Gentle Cleanser', 'Clara', 12, 4.5, 5410, 1, 2, 3, 150, 'Sensitive skin', false],
    ['solara-spf-fluid', 'Solara SPF 50 Fluid', 'Solara', 19, 4.6, 2744, 2, 2, 4, 60, 'All skin types', true],
    ['midnight-repair-cream', 'Midnight Repair Cream', 'Midnight', 26, 4.7, 1988, 3, 4, 1, 50, 'Dry skin', true],
    ['pure-barrier-toner', 'Pure Barrier Toner', 'Pure', 14, 4.2, 4332, 0, 3, 2, 200, 'Oily skin', false],
  ],
  home: [
    ['lumen-desk-mini', 'Lumen Desk Mini', 'Lumen', 21, 4.4, 2265, 2, 2, 1, 450, 'USB-C', true],
    ['arc-beam-pro', 'Arc Beam Pro', 'Arc', 34, 4.7, 1104, 0, 3, 2, 900, 'Mains', true],
    ['nord-cool-task', 'Nord Cool Task Light', 'Nord', 18, 4.2, 3890, 1, 4, 3, 400, 'USB-C', false],
    ['halo-recharge-lamp', 'Halo Recharge Lamp', 'Halo', 27, 4.5, 2044, 2, 2, 4, 600, 'Rechargeable', true],
    ['studio-bar-light', 'Studio Bar Light', 'Studio', 41, 4.6, 812, 3, 3, 1, 1100, 'Mains', false],
    ['pebble-clip-lamp', 'Pebble Clip Lamp', 'Pebble', 13, 4.0, 5021, 0, 5, 2, 260, 'Rechargeable', false],
  ],
  sports: [
    ['hydro-steel-750', 'Hydro Steel 750', 'Hydro', 24, 4.7, 4610, 0, 2, 1, 750, 'Stainless steel', true],
    ['trailtap-1l', 'Trailtap 1L', 'Trail', 18, 4.4, 3105, 2, 3, 2, 1000, 'Tritan', true],
    ['aqua-glide-500', 'Aqua Glide 500', 'Aqua', 11, 4.1, 6930, 1, 2, 3, 500, 'Tritan', false],
    ['summit-vacuum-900', 'Summit Vacuum 900', 'Summit', 29, 4.8, 1742, 3, 4, 4, 900, 'Stainless steel', true],
    ['metro-glass-650', 'Metro Glass 650', 'Metro', 15, 4.2, 2318, 0, 5, 1, 650, 'Glass', false],
    ['pulse-tracker-bottle', 'Pulse Tracker Bottle', 'Pulse', 21, 4.5, 1905, 2, 2, 2, 780, 'Stainless steel', true],
  ],
  accessories: [
    ['transit-24l-pack', 'Transit 24L Pack', 'Transit', 39, 4.6, 3388, 0, 2, 1, 24, true, 'Recycled nylon'],
    ['campus-lite-18l', 'Campus Lite 18L', 'Campus', 26, 4.3, 5204, 2, 3, 2, 18, true, 'Polyester'],
    ['ridge-commuter-32l', 'Ridge Commuter 32L', 'Ridge', 52, 4.8, 1470, 4, 4, 3, 32, true, 'Waxed canvas'],
    ['urban-sling-14l', 'Urban Sling 14L', 'Urban', 31, 4.1, 2880, 2, 3, 4, 14, false, 'Coated canvas'],
    ['dryline-waterproof-28l', 'Dryline Waterproof 28L', 'Dryline', 45, 4.5, 1612, 3, 3, 1, 28, true, 'TPU laminate'],
    ['daylight-mini-12l', 'Daylight Mini 12L', 'Daylight', 19, 4.0, 6011, 0, 5, 2, 12, false, 'Polyester'],
  ],
  wearables: [
    ['pulseband-s2', 'Pulseband S2', 'Pulseband', 74, 4.5, 4120, 0, 2, 1, 14, 'AMOLED', true],
    ['tempo-fit-5', 'Tempo Fit 5', 'Tempo', 96, 4.7, 2240, 4, 3, 2, 18, 'AMOLED', true],
    ['echo-wrist-lite', 'Echo Wrist Lite', 'Echo', 48, 4.1, 3880, 2, 4, 3, 7, 'LCD', false],
    ['orbit-gt-active', 'Orbit GT Active', 'Orbit', 128, 4.6, 1342, 5, 2, 4, 12, 'Always-on AMOLED', true],
    ['nova-sleep-tracker', 'Nova Sleep Tracker', 'Nova', 62, 4.3, 2760, 0, 3, 1, 10, 'LCD', false],
    ['vertex-wrist-ultra', 'Vertex Wrist Ultra', 'Vertex', 145, 4.8, 964, 3, 2, 2, 21, 'Always-on AMOLED', true],
  ],
  mobile: [
    ['shield-flex-clear', 'Shield Flex Clear', 'Shield', 11, 4.4, 7210, 1, 2, 1, 2, 'TPU', true],
    ['armorgrip-mag-case', 'Armorgrip Mag Case', 'Armorgrip', 19, 4.7, 3455, 2, 3, 2, 3.5, 'Polycarbonate', true],
    ['matte-slim-edge', 'Matte Slim Edge', 'Matte', 8, 4.2, 9104, 0, 4, 3, 1.5, 'Polycarbonate', true],
    ['trailshield-rubber', 'TrailShield Rubber', 'TrailShield', 16, 4.6, 2688, 2, 2, 4, 4, 'Rubber', false],
    ['leather-folio-wallet', 'Leather Folio Wallet', 'Folio', 24, 4.5, 1940, 3, 3, 1, 2, 'Vegan leather', false],
    ['feathercase-lite', 'FeatherCase Lite', 'Feather', 6, 3.9, 11320, 0, 5, 2, 1, 'Silicone', false],
  ],
  kitchen: [
    ['dawn-drip-6', 'Dawn Drip 6-Cup', 'Dawn', 39, 4.5, 3012, 0, 2, 1, 900, 900, true],
    ['barista-press-pro', 'Barista Press Pro', 'Barista', 58, 4.8, 1244, 4, 3, 2, 1200, 1400, true],
    ['quickbrew-mini', 'QuickBrew Mini', 'QuickBrew', 23, 4.2, 6730, 2, 4, 3, 450, 700, false],
    ['aera-cold-brew', 'Aera Cold Brew Coffeemaker', 'Aera', 74, 4.6, 1890, 3, 2, 4, 1300, 1200, true],
    ['nest-cup-single', 'Nest Cup Single Serve', 'Nest', 32, 4.3, 4505, 0, 3, 1, 350, 800, true],
    ['classic-perc-4', 'Classic Perc 4-Cup', 'Classic', 18, 4.0, 2377, 1, 5, 2, 600, 500, false],
  ],
  stationery: [
    ['focus-a5-grid', 'Focus A5 Grid Notebook', 'Focus', 9, 4.6, 5610, 1, 2, 1, 192, 'Grid', 'Soft-touch'],
    ['planner-weekly-2026', 'Weekly Planner 2026', 'Planner Co', 14, 4.5, 3204, 0, 3, 2, 160, 'Ruled', 'Hardcover'],
    ['dotgrid-essential', 'DotGrid Essential', 'DotGrid', 7, 4.3, 8940, 1, 4, 3, 128, 'Dotted', 'Soft-touch'],
    ['journal-linen-bound', 'Linen Bound Journal', 'Linen Press', 12, 4.7, 2418, 2, 2, 4, 240, 'Blank', 'Linen'],
    ['legalpad-multipack', 'Legal Pad Multipack', 'LegalPad', 6, 4.0, 4882, 0, 5, 1, 80, 'Ruled', 'Recycled'],
    ['sketchbook-heavyweight', 'Heavyweight Sketchbook', 'Sketch', 17, 4.8, 1655, 2, 3, 2, 320, 'Blank', 'Board'],
  ],
  gaming: [
    ['rapidclick-r2', 'RapidClick R2', 'RapidClick', 29, 4.5, 4120, 0, 2, 1, 16000, 78, true],
    ['pixelaim-elite', 'PixelAim Elite', 'PixelAim', 54, 4.8, 1988, 3, 3, 2, 26000, 58, true],
    ['lightspeed-mini', 'LightSpeed Mini', 'LightSpeed', 22, 4.2, 6410, 2, 4, 3, 8000, 66, false],
    ['clawfit-s2', 'ClawFit S2', 'ClawFit', 35, 4.6, 2744, 2, 2, 4, 12000, 82, false],
    ['quietclick-silent', 'QuietClick Silent', 'QuietClick', 26, 4.3, 3502, 0, 3, 1, 4000, 96, false],
    ['pulse-rgb-pro', 'Pulse RGB Pro', 'Pulse', 42, 4.7, 1433, 3, 2, 2, 20000, 72, true],
  ],
  travel: [
    ['packcube-set-6', 'PackCube Set of 6', 'PackCube', 22, 4.6, 5204, 0, 2, 1, 6, 'Recycled nylon', true],
    ['cablebraid-pro', 'CableBraid Pro Organizer', 'CableBraid', 13, 4.7, 3018, 1, 3, 2, 2, 'Silicone', false],
    ['passportfolio-travel', 'PassportFolio Travel Wallet', 'PassportFolio', 17, 4.4, 2460, 2, 2, 3, 3, 'Recycled fabric', false],
    ['toiletrytote-duo', 'ToiletryTote Duo', 'ToiletryTote', 21, 4.3, 1890, 2, 4, 4, 2, 'Water-resistant', true],
    ['compressionpacking-cube', 'Compression Packing Cubes', 'Compress', 28, 4.5, 2744, 3, 2, 1, 4, 'Recycled nylon', true],
    ['hardshell-tag-kit', 'Hardshell Luggage Tag Kit', 'Hardshell', 9, 4.1, 4102, 0, 5, 2, 5, 'Aluminium', false],
  ],
};

const build = (categorySlug) =>
  rows[categorySlug].map((row, index) => {
    const category = categoryBySlug[categorySlug];
    const [id, name, brand, price, rating, reviews, shipping, deliveryDays, , ...specValues] = row;
    const specs = Object.fromEntries(category.specs.map((spec, specIndex) => [spec.field, specValues[specIndex]]));

    return {
      id,
      name,
      brand,
      category: category.slug,
      categoryName: category.name,
      query: category.query,
      shape: category.shape,
      icon: `/images/categories/${category.shape}.svg`,
      image: `/images/products/${category.shape}-${(index % 6) + 1}.webp`,
      price,
      rating,
      reviews,
      shipping,
      deliveryDays,
      serviceFee: SERVICE_FEE,
      total: price + shipping + SERVICE_FEE,
      ...specs,
    };
  });

export const catalog = categories.flatMap((category) => build(category.slug));

export const productById = (id) => catalog.find((product) => product.id === id);

export const categoryOf = (product) => categoryBySlug[product.category];

/** Exact category result set, used by the AI shortlist. */
export const productsForQuery = (query) => {
  const category = categoryByQuery.get(String(query ?? '').trim().toLowerCase());
  return category ? catalog.filter((product) => product.query === category.query) : [];
};

const FEATURED_IDS = [
  'lumo-wave-pro',
  'apex-lift-pro',
  'halo-vit-c-serum',
  'hydro-steel-750',
  'transit-24l-pack',
  'tempo-fit-5',
  'arc-beam-pro',
  'packcube-set-6',
];

export const featured = FEATURED_IDS.map(productById).filter(Boolean);