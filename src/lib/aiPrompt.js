import { catalog } from '../data/catalog.js';
import { categories, categoryBySlug, preferencesFor } from '../data/categories.js';
import { money } from './pricing.js';

const tokens = (text) =>
  String(text ?? '')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);

const CATEGORY_SYNONYMS = {
  electronics: ['earbud', 'earbuds', 'earphone', 'earphones', 'headphone', 'headphones', 'buds', 'audio', 'bluetooth'],
  fashion: ['shoe', 'shoes', 'sneaker', 'sneakers', 'trainer', 'trainers', 'footwear', 'running shoe'],
  beauty: ['skincare', 'serum', 'cream', 'cleanser', 'toner', 'moisturizer', 'spf', 'skin care'],
  home: ['lamp', 'light', 'lighting', 'task light', 'desk light'],
  sports: ['bottle', 'water bottle', 'flask', 'hydration', 'drink bottle'],
  accessories: ['backpack', 'bag', 'pack', 'rucksack', 'daypack', 'rucksack'],
  wearables: ['watch', 'smartwatch', 'smart watch', 'fitness tracker', 'tracker', 'wristband'],
  mobile: ['phone case', 'case', 'phone cover', 'cover'],
  kitchen: ['coffee', 'coffee maker', 'coffeemaker', 'brewer', 'espresso', 'brew'],
  stationery: ['notebook', 'journal', 'planner', 'stationery', 'sketchbook', 'paper'],
  gaming: ['mouse', 'gaming mouse', 'gamer', 'gaming'],
  travel: ['organizer', 'packing', 'luggage', 'suitcase', 'travel', 'travel gear'],
};

const REVIEW_WORDS = ['review', 'reviews', 'rated', 'rating', 'popular', 'reliable', 'trusted', 'proven', 'well reviewed', 'highly rated', 'top rated'];
const DELIVERY_WORDS = ['fast', 'quick', 'quickly', 'fastest', 'speedy', 'rapid', 'soon', 'asap', 'urgent', 'expedited', 'tomorrow', 'early', 'delivery'];

const FIELD_LABELS = {
  waterRating: 'Best water resistance',
  weightG: 'Lightest build',
  material: 'Best material',
  volumeMl: 'Best bottle size',
  skinType: 'Best for your skin',
  organic: 'Organic formula',
  powerSource: 'Best power option',
  adjustable: 'Adjustable',
  capacityMl: 'Best capacity',
  insulated: 'Insulated',
  capacityL: 'Most carrying space',
  laptopSleeve: 'Laptop sleeve',
  batteryDays: 'Longest battery life',
  display: 'Best display',
  waterproof: 'Waterproof',
  dropRating: 'Best drop protection',
  wirelessCharging: 'Wireless charging',
  wattage: 'Most power',
  programmable: 'Programmable',
  pages: 'Most pages',
  ruling: 'Best ruling',
  coverMaterial: 'Best cover',
  dpi: 'Highest precision',
  wireless: 'Wireless',
  pieces: 'Most pieces',
  compression: 'Compression',
};

const FIELD_KEYWORDS = {
  batteryHours: ['battery', 'charge', 'charging'],
  waterRating: ['water', 'waterproof', 'water resistant'],
  weightG: ['weight', 'light', 'lightweight'],
  cushioning: ['cushion', 'cushioning', 'comfort', 'comfortable', 'plush'],
  material: ['material', 'fabric', 'leather', 'upper'],
  volumeMl: ['volume', 'size', 'ml'],
  skinType: ['skin', 'sensitive', 'dry', 'oily', 'combination'],
  organic: ['organic', 'natural'],
  lumens: ['bright', 'brightness', 'lumen', 'lumens'],
  powerSource: ['power', 'rechargeable', 'usb', 'cordless'],
  adjustable: ['adjustable', 'flexible', 'tilt'],
  capacityMl: ['capacity', 'size', 'ml'],
  insulated: ['insulated', 'insulation', 'cold', 'hot', 'thermal'],
  capacityL: ['capacity', 'size', 'space', 'litre', 'liter', 'litres'],
  laptopSleeve: ['laptop', 'sleeve'],
  batteryDays: ['battery', 'days', 'charge'],
  display: ['display', 'screen', 'amoled', 'always on'],
  waterproof: ['water', 'waterproof', 'swim'],
  dropRating: ['drop', 'protection', 'durable', 'durability', 'shock'],
  wirelessCharging: ['wireless', 'charging', 'qi'],
  wattage: ['power', 'watt', 'wattage', 'strong'],
  programmable: ['programmable', 'timer', 'program', 'schedule'],
  pages: ['page', 'pages', 'thick'],
  ruling: ['ruling', 'ruled', 'grid', 'dotted', 'lined', 'blank'],
  coverMaterial: ['cover', 'hardcover', 'linen'],
  dpi: ['dpi', 'sensor', 'precision', 'accurate'],
  wireless: ['wireless', 'cordless'],
  pieces: ['piece', 'pieces', 'count', 'set'],
  compression: ['compression', 'compress'],
};

const detectCategory = (prompt) => {
  const text = prompt.toLowerCase();
  const promptTokens = new Set(tokens(text));
  let best = null;

  for (const category of categories) {
    let score = 0;
    for (const word of tokens(category.query)) if (promptTokens.has(word)) score += 4;
    if (promptTokens.has(category.name.toLowerCase())) score += 4;
    for (const synonym of CATEGORY_SYNONYMS[category.slug] ?? []) {
      if (synonym.includes(' ')) {
        if (text.includes(synonym)) score += 3;
      } else if (promptTokens.has(synonym)) {
        score += 3;
      }
    }
    if (score > 0 && (!best || score > best.score)) best = { category, score };
  }

  if (best) return best.category;

  const words = new Set(tokens(text));
  const hit = catalog.find((product) => tokens(`${product.name} ${product.brand} ${product.query}`).some((word) => words.has(word)));
  return hit ? categoryBySlug[hit.category] : null;
};

const detectBudget = (prompt) => {
  const match =
    prompt.match(/(?:under|below|less than|lower than|max(?:imum)?|up to|no more than|within|budget(?: of)?|around|about|~)\s*\$?\s*(\d+(?:\.\d+)?)/i) ||
    prompt.match(/\$\s*(\d+(?:\.\d+)?)/) ||
    prompt.match(/(\d+(?:\.\d+)?)\s*(?:dollars|bucks|usd)/i);
  return match ? Number(match[1]) : null;
};

const detectSpec = (category, promptTokens, text) => {
  let best = null;

  for (const spec of category.specs) {
    const keywords = [
      ...(FIELD_KEYWORDS[spec.field] ?? []),
      ...tokens(spec.label),
      ...(category.highlight.field === spec.field ? [...tokens(category.highlight.chip), ...tokens(category.highlight.label)] : []),
    ];

    let score = 0;
    for (const keyword of keywords) {
      if (keyword.includes(' ')) {
        if (text.includes(keyword)) score += 2;
      } else if (promptTokens.has(keyword) || (keyword.length >= 4 && text.includes(keyword))) {
        score += 2;
      }
    }
    if (score > 0 && (!best || score > best.score)) best = { field: spec.field, score };
  }

  return best?.field ?? null;
};

const budgetPreference = (category, cap) => ({
  id: 'budget',
  type: 'budget',
  label: 'Stay on budget',
  hint: `Keep the final delivered price under ${money(cap)}`,
  icon: 'wallet',
  defaultOn: true,
  cap,
});

const specPreference = (category, field) => {
  const spec = category.specs.find((entry) => entry.field === field) ?? category.specs[0];
  const isHighlight = field === category.highlight.field;
  return {
    id: `spec-${spec.field}`,
    type: 'spec',
    field: spec.field,
    label: isHighlight ? category.highlight.label : (FIELD_LABELS[spec.field] ?? `Best ${spec.label.toLowerCase()}`),
    hint: `Compare ${spec.label.toLowerCase()} across the results`,
    icon: 'gauge',
    defaultOn: true,
  };
};

/**
 * Turns a free-text request like "wireless earbuds under $30 with long battery
 * life and fast delivery" into the category + scoring preferences the shortlist
 * engine understands. Deterministic so the prototype works without a backend.
 */
export function interpretPrompt(rawPrompt) {
  const prompt = String(rawPrompt ?? '').trim();
  const text = prompt.toLowerCase();
  const promptTokens = new Set(tokens(text));

  const category = detectCategory(prompt);
  if (!category) {
    return { prompt, ok: false, category: null, preferences: [], understood: [] };
  }

  const base = preferencesFor(category);
  const reviews = base.find((preference) => preference.type === 'reviews');
  const delivery = base.find((preference) => preference.type === 'delivery');

  const cap = detectBudget(prompt);
  const specField = detectSpec(category, promptTokens, text) ?? category.highlight.field;
  const wantsDelivery = DELIVERY_WORDS.some((word) => text.includes(word));

  const preferences = [budgetPreference(category, cap ?? category.budgetCap), reviews, specPreference(category, specField)];
  if (wantsDelivery) preferences.push(delivery);

  const spec = preferences.find((preference) => preference.type === 'spec');
  const understood = [
    { icon: 'store', label: category.name },
    { icon: 'wallet', label: `Under ${money(cap ?? category.budgetCap)}` },
    { icon: 'star', label: 'Strong reviews' },
    { icon: 'gauge', label: spec.label },
  ];
  if (wantsDelivery) understood.push({ icon: 'truck', label: 'Fast delivery' });

  return { prompt, ok: true, category, preferences, understood };
}
