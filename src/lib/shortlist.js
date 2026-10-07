import { preferencesFor, specByField } from '../data/categories.js';
import { compactNumber, deliveryCopy, lineTotal, money } from './pricing.js';

export const BADGES = {
  fit: { id: 'fit', label: 'Best Fit', tone: 'green', icon: 'medal', blurb: 'Top AI match for your priorities' },
  value: { id: 'value', label: 'Best Value', tone: 'blue', icon: 'coins', blurb: 'The cheaper alternative' },
  fast: { id: 'fast', label: 'Fast Delivery', tone: 'amber', icon: 'bolt', blurb: 'The quicker alternative' },
};

export const TONE_CLASS = {
  green: 'bg-grass-tint text-grass',
  blue: 'bg-azure-tint text-azure',
  amber: 'bg-amber-tint text-amber',
};

export const TONE_BORDER = {
  green: 'border-[#bfe2c6]',
  blue: 'border-[#a9c7ef]',
  amber: 'border-[#f7d6a8]',
};

const clamp01 = (value) => Math.min(1, Math.max(0, value));

const rangeOf = (values) => ({ min: Math.min(...values), max: Math.max(...values) });

const spreadScore = (value, range, dir = 'high') => {
  if (!Number.isFinite(value)) return 0;
  if (range.max === range.min) return 1;
  const ratio = (value - range.min) / (range.max - range.min);
  return clamp01(dir === 'high' ? ratio : 1 - ratio);
};

export const defaultPreferenceIds = (category) => preferencesFor(category).filter((pref) => pref.defaultOn).map((pref) => pref.id);

const specText = (product, spec) => {
  const value = product[spec.field];
  if (spec.kind === 'bool') return value ? 'Yes' : 'No';
  if (spec.kind === 'number') return `${value}${spec.unit ?? ''}`;
  return String(value);
};

function buildRanges(products, activePreferences) {
  const ranges = {};
  for (const preference of activePreferences) {
    if (preference.type !== 'spec') continue;
    ranges[preference.field] = rangeOf(products.map((product) => Number(product[preference.field]) || 0));
  }
  return ranges;
}

function scorePreference(preference, product, ranges, category, deliveryRange) {
  switch (preference.type) {
    case 'budget': {
      const cap = preference.cap ?? category.budgetCap;
      const total = lineTotal(product);
      if (total <= cap) return 1;
      return clamp01(1 - (total - cap) / (cap * 0.5));
    }
    case 'reviews': {
      const ratingScore = clamp01((product.rating - 3.8) / 1.2);
      const volumeScore = clamp01(Math.log10(product.reviews + 1) / 4.2);
      return ratingScore * 0.7 + volumeScore * 0.3;
    }
    case 'delivery':
      return spreadScore(product.deliveryDays, deliveryRange, 'low');
    case 'spec':
      return spreadScore(Number(product[preference.field]) || 0, ranges[preference.field], category.highlight.dir);
    default:
      return 0;
  }
}

function reasonFor(preference, product, category) {
  switch (preference.type) {
    case 'budget': {
      const cap = preference.cap ?? category.budgetCap;
      const total = lineTotal(product);
      return total <= cap
        ? `final total ${money(total)} sits under your ${money(cap)} budget`
        : `closest total to your ${money(cap)} budget at ${money(total)}`;
    }
    case 'reviews':
      return `rated ${product.rating} from ${compactNumber(product.reviews)} reviews`;
    case 'delivery':
      return `arrives in ${deliveryCopy(product)}`;
    case 'spec': {
      const spec = specByField(category, preference.field);
      return `${category.highlight.chip.toLowerCase()} of ${specText(product, spec)}`;
    }
    default:
      return '';
  }
}

/** Scores every candidate against the shopper's selected priorities. */
export function scoreProducts(products, activePreferences, category) {
  const specRanges = buildRanges(products, activePreferences);
  const deliveryRange = rangeOf(products.map((product) => product.deliveryDays));

  return products.map((product) => {
    const parts = activePreferences.map((preference) => ({
      preference,
      score: scorePreference(preference, product, specRanges, category, deliveryRange),
      reason: reasonFor(preference, product, category),
    }));

    const score = parts.length ? parts.reduce((sum, part) => sum + part.score, 0) / parts.length : 0;

    return { product, score, parts, total: lineTotal(product) };
  });
}

const strengthsOf = (pick, exclude = []) =>
  [...pick.parts]
    .filter((part) => part.score >= 0.55 && part.reason && !exclude.includes(part.preference.type))
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((part) => part.reason)
    .join(' and ');

/**
 * Builds the three card shortlist. Best Fit is the highest AI score, then the
 * cheapest delivered total and the quickest arrival are taken from what is left,
 * so every card is a distinct product and the two alternatives always state a
 * real advantage over the top pick.
 */
export function buildShortlist({ products, preferences, category }) {
  const ranked = scoreProducts(products, preferences, category).sort(
    (a, b) => b.score - a.score || lineTotal(a.product) - lineTotal(b.product) || b.product.rating - a.product.rating,
  );

  const fit = ranked[0];
  if (!fit) return [];

  const take = (pool, compare) => {
    const sorted = [...pool].sort(compare);
    const winner = sorted[0];
    return {
      winner,
      rest: sorted.slice(1),
    };
  };

  const restOfFit = ranked.slice(1);
  const { winner: value, rest: restOfValue } = take(restOfFit, (a, b) => lineTotal(a.product) - lineTotal(b.product));
  const { winner: fast, rest: restOfFast } = take(restOfValue, (a, b) => a.product.deliveryDays - b.product.deliveryDays);

  const picks = [fit, value, fast].filter(Boolean);

  const spare = [...restOfFast, ...ranked].filter(
    (candidate) => !picks.some((pick) => pick.product.id === candidate.product.id),
  );
  const fillerBadges = ['value', 'fast', 'fit'];
  for (const candidate of spare) {
    if (picks.length >= Math.min(3, ranked.length)) break;
    picks.push({ ...candidate, badge: fillerBadges[picks.length - 1] ?? 'fit' });
  }

  const [fitPick, valuePick, fastPick] = [fit, value, fast];
  const lowestTotal = Math.min(...picks.map((pick) => lineTotal(pick.product)));
  const fewestDays = Math.min(...picks.map((pick) => pick.product.deliveryDays));

  const explain = (pick) => {
    if (!pick) return '';

    if (pick === valuePick) {
      const strengths = strengthsOf(pick, ['budget']);
      const claim =
        pick.total === lowestTotal
          ? `Lowest final total of the three at ${money(pick.total)}, which is ${money(
              lineTotal(fitPick.product) - pick.total,
            )} less than ${fitPick.product.name}`
          : `Lowest price among the alternatives at ${money(pick.total)}`;
      return strengths ? `${claim}, plus ${strengths}.` : `${claim}.`;
    }

    if (pick === fastPick) {
      const strengths = strengthsOf(pick, ['delivery']);
      const claim =
        pick.product.deliveryDays === fewestDays
          ? `Fastest arrival of the three, in ${deliveryCopy(pick.product)}`
          : `Arrives in ${deliveryCopy(pick.product)}, quicker than ${valuePick.product.name}`;
      return strengths ? `${claim}, plus ${strengths}.` : `${claim}.`;
    }

    const strengths = strengthsOf(pick);
    return strengths
      ? `Highest AI match score of the three, thanks to ${strengths}.`
      : 'Highest AI match score of the three — the strongest overall balance for this category.';
  };

  return picks.map((pick, index) => ({
    ...pick,
    badge: pick.badge ?? ['fit', 'value', 'fast'][index],
    total: lineTotal(pick.product),
    why: explain(pick),
    badgeMeta: BADGES[pick.badge ?? ['fit', 'value', 'fast'][index]],
  }));
}

/** Side-by-side table rows, each flagged with which card wins it. */
export function compareRows(picks, category) {
  const spec = specByField(category, category.highlight.field);
  const direction = category.highlight.dir === 'high' ? 'max' : 'min';

  const rows = [
    {
      label: 'Final total',
      values: picks.map((pick) => money(lineTotal(pick.product))),
      numbers: picks.map((pick) => lineTotal(pick.product)),
      better: 'min',
    },
    {
      label: 'Rating',
      values: picks.map((pick) => pick.product.rating),
      numbers: picks.map((pick) => pick.product.rating),
      better: 'max',
    },
    {
      label: spec.label,
      values: picks.map((pick) => specText(pick.product, spec)),
      numbers: picks.map((pick) => Number(pick.product[spec.field])),
      better: direction,
    },
    {
      label: 'Delivery',
      values: picks.map((pick) => deliveryCopy(pick.product)),
      numbers: picks.map((pick) => pick.product.deliveryDays),
      better: 'min',
    },
  ];

  return rows.map(({ label, values, numbers, better }) => {
    const target = better === 'min' ? Math.min(...numbers) : Math.max(...numbers);
    return { label, values, bestIndex: numbers.indexOf(target) };
  });
}