import { catalog } from '../data/catalog.js';

const normalise = (value) => String(value ?? '').trim().toLowerCase();

const haystack = (product) =>
  [product.name, product.brand, product.categoryName, product.query, ...Object.values(product)]
    .filter((value) => typeof value === 'string')
    .join(' ')
    .toLowerCase();

/** Every word of the query must appear somewhere on the product. */
const matchesAll = (product, words) => {
  const text = haystack(product);
  return words.every((word) => text.includes(word));
};

export const searchProducts = (rawQuery) => {
  const query = normalise(rawQuery);
  if (!query) return { query: '', words: [], results: [] };

  const words = query.split(/\s+/).filter(Boolean);
  const results = catalog.filter((product) => matchesAll(product, words));

  return { query: String(rawQuery ?? '').trim(), words, results };
};

/** Loose alternative used for the "did you mean" hint on empty results. */
const editDistance = (a, b) => {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > 2) return 99;

  let previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    const current = [i];
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(current[j - 1] + 1, previous[j] + 1, previous[j - 1] + cost);
    }
    previous = current;
  }
  return previous[b.length];
};

const tokensOf = (product) => haystack(product).split(/[^a-z0-9]+/).filter(Boolean);

export const suggestQueries = (rawQuery, limit = 4) => {
  const words = normalise(rawQuery).split(/\s+/).filter(Boolean);
  if (!words.length) return [];

  const scored = catalog.map((product) => {
    const text = haystack(product);
    const tokens = tokensOf(product);

    const overlap = words.filter((word) => text.includes(word)).length;
    const close = words.filter((word) => tokens.some((token) => Math.abs(token.length - word.length) <= 2 && editDistance(token, word) <= 2))
      .length;

    return { product, strength: overlap * 3 + close };
  });

  return scored
    .filter((entry) => entry.strength > 0)
    .sort((a, b) => b.strength - a.strength || b.product.rating - a.product.rating)
    .map((entry) => entry.product.query)
    .filter((query, index, all) => all.indexOf(query) === index)
    .slice(0, limit);
};