export const SERVICE_FEE = 1;

/**
 * Every category carries its own AI preference schema:
 *  - budget   : hard cap on the final delivered price
 *  - reviews  : rating + review volume
 *  - spec     : the one attribute that matters most for this category
 *  - delivery : delivery speed
 */
export const categories = [
  {
    slug: 'electronics',
    name: 'Electronics',
    query: 'wireless earbuds',
    shape: 'earbuds',
    blurb: 'Everyday audio and smart tech',
    budgetCap: 30,
    highlight: { field: 'batteryHours', chip: 'Battery life', label: 'Long battery life', dir: 'high' },
    specs: [
      { field: 'batteryHours', label: 'Battery', kind: 'number', unit: 'h' },
      { field: 'waterRating', label: 'Water rating', kind: 'text' },
      { field: 'weightG', label: 'Weight', kind: 'number', unit: 'g' },
    ],
  },
  {
    slug: 'fashion',
    name: 'Fashion',
    query: 'sneakers',
    shape: 'sneaker',
    blurb: 'Footwear built for the street and the gym',
    budgetCap: 50,
    highlight: { field: 'cushioning', chip: 'Cushioning', label: 'Plush cushioning', dir: 'high' },
    specs: [
      { field: 'cushioning', label: 'Cushioning', kind: 'number', unit: '/5' },
      { field: 'material', label: 'Upper', kind: 'text' },
      { field: 'weightG', label: 'Weight', kind: 'number', unit: 'g' },
    ],
  },
  {
    slug: 'beauty',
    name: 'Beauty',
    query: 'skincare',
    shape: 'skincare',
    blurb: 'Daily routines for every skin type',
    budgetCap: 25,
    highlight: { field: 'volumeMl', chip: 'Bottle size', label: 'Bigger bottle', dir: 'high' },
    specs: [
      { field: 'volumeMl', label: 'Volume', kind: 'number', unit: 'ml' },
      { field: 'skinType', label: 'Suits', kind: 'text' },
      { field: 'organic', label: 'Organic', kind: 'bool' },
    ],
  },
  {
    slug: 'home',
    name: 'Home',
    query: 'desk lamp',
    shape: 'lamp',
    blurb: 'Lighting, desks and small-space upgrades',
    budgetCap: 35,
    highlight: { field: 'lumens', chip: 'Brightness', label: 'Maximum brightness', dir: 'high' },
    specs: [
      { field: 'lumens', label: 'Brightness', kind: 'number', unit: 'lm' },
      { field: 'powerSource', label: 'Power', kind: 'text' },
      { field: 'adjustable', label: 'Adjustable', kind: 'bool' },
    ],
  },
  {
    slug: 'sports',
    name: 'Sports',
    query: 'water bottle',
    shape: 'bottle',
    blurb: 'Hydration and training gear',
    budgetCap: 25,
    highlight: { field: 'capacityMl', chip: 'Capacity', label: 'Bigger capacity', dir: 'high' },
    specs: [
      { field: 'capacityMl', label: 'Capacity', kind: 'number', unit: 'ml' },
      { field: 'material', label: 'Material', kind: 'text' },
      { field: 'insulated', label: 'Insulated', kind: 'bool' },
    ],
  },
  {
    slug: 'accessories',
    name: 'Accessories',
    query: 'backpack',
    shape: 'backpack',
    blurb: 'Bags that carry a full day',
    budgetCap: 45,
    highlight: { field: 'capacityL', chip: 'Capacity', label: 'More carrying space', dir: 'high' },
    specs: [
      { field: 'capacityL', label: 'Capacity', kind: 'number', unit: 'L' },
      { field: 'laptopSleeve', label: 'Laptop sleeve', kind: 'bool' },
      { field: 'material', label: 'Fabric', kind: 'text' },
    ],
  },
  {
    slug: 'wearables',
    name: 'Wearables',
    query: 'smart watch',
    shape: 'watch',
    blurb: 'Fitness and health on your wrist',
    budgetCap: 100,
    highlight: { field: 'batteryDays', chip: 'Battery life', label: 'Multi-day battery', dir: 'high' },
    specs: [
      { field: 'batteryDays', label: 'Battery', kind: 'number', unit: 'days' },
      { field: 'display', label: 'Display', kind: 'text' },
      { field: 'waterproof', label: 'Waterproof', kind: 'bool' },
    ],
  },
  {
    slug: 'mobile',
    name: 'Mobile',
    query: 'phone case',
    shape: 'phoneCase',
    blurb: 'Cases and protection for every phone',
    budgetCap: 20,
    highlight: { field: 'dropRating', chip: 'Drop protection', label: 'Serious drop protection', dir: 'high' },
    specs: [
      { field: 'dropRating', label: 'Drop rating', kind: 'number', unit: 'm' },
      { field: 'material', label: 'Material', kind: 'text' },
      { field: 'wirelessCharging', label: 'Wireless charging', kind: 'bool' },
    ],
  },
  {
    slug: 'kitchen',
    name: 'Kitchen',
    query: 'coffee maker',
    shape: 'coffeeMaker',
    blurb: 'Morning brewing, done your way',
    budgetCap: 60,
    highlight: { field: 'capacityMl', chip: 'Brew size', label: 'Brew more at once', dir: 'high' },
    specs: [
      { field: 'capacityMl', label: 'Capacity', kind: 'number', unit: 'ml' },
      { field: 'wattage', label: 'Power', kind: 'number', unit: 'W' },
      { field: 'programmable', label: 'Programmable', kind: 'bool' },
    ],
  },
  {
    slug: 'stationery',
    name: 'Stationery',
    query: 'notebook',
    shape: 'notebook',
    blurb: 'Paper for planning and sketching',
    budgetCap: 15,
    highlight: { field: 'pages', chip: 'Page count', label: 'More pages', dir: 'high' },
    specs: [
      { field: 'pages', label: 'Pages', kind: 'number' },
      { field: 'ruling', label: 'Ruling', kind: 'text' },
      { field: 'coverMaterial', label: 'Cover', kind: 'text' },
    ],
  },
  {
    slug: 'gaming',
    name: 'Gaming',
    query: 'gaming mouse',
    shape: 'mouse',
    blurb: 'Mice tuned for competitive play',
    budgetCap: 45,
    highlight: { field: 'dpi', chip: 'Sensor precision', label: 'Higher sensor precision', dir: 'high' },
    specs: [
      { field: 'dpi', label: 'Max DPI', kind: 'number' },
      { field: 'weightG', label: 'Weight', kind: 'number', unit: 'g' },
      { field: 'wireless', label: 'Wireless', kind: 'bool' },
    ],
  },
  {
    slug: 'travel',
    name: 'Travel',
    query: 'travel organizer',
    shape: 'suitcase',
    blurb: 'Packing and passport essentials',
    budgetCap: 25,
    highlight: { field: 'pieces', chip: 'Piece count', label: 'More pieces in the set', dir: 'high' },
    specs: [
      { field: 'pieces', label: 'Pieces', kind: 'number' },
      { field: 'material', label: 'Material', kind: 'text' },
      { field: 'compression', label: 'Compression', kind: 'bool' },
    ],
  },
];

export const categoryBySlug = Object.fromEntries(categories.map((category) => [category.slug, category]));

export const categoryByQuery = new Map(categories.map((category) => [category.query.toLowerCase(), category]));

/** The four preference chips shown on the preferences screen, derived from the category. */
export const preferencesFor = (category) => [
  {
    id: 'budget',
    type: 'budget',
    label: 'Stay on budget',
    hint: `Keep the final delivered price under $${category.budgetCap}`,
    icon: 'wallet',
    defaultOn: true,
  },
  {
    id: 'reviews',
    type: 'reviews',
    label: 'Strong reviews',
    hint: 'Favour highly rated products with many reviews',
    icon: 'star',
    defaultOn: true,
  },
  {
    id: `spec-${category.highlight.field}`,
    type: 'spec',
    field: category.highlight.field,
    label: category.highlight.label,
    hint: `Compare ${category.highlight.chip.toLowerCase()} across the results`,
    icon: 'gauge',
    defaultOn: true,
  },
  {
    id: 'delivery',
    type: 'delivery',
    label: 'Fast delivery',
    hint: 'Prefer products arriving sooner',
    icon: 'truck',
    defaultOn: false,
  },
];

export const specByField = (category, field) => category.specs.find((spec) => spec.field === field);