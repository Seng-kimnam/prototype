/**
 * Downloads real product photos for the prototype from DummyJSON.
 *
 *   node scripts/fetch-product-images.mjs
 *
 * Source: https://dummyjson.com (free demo e-commerce catalogue, no API key).
 * Output: public/images/products/<shape>-<n>.webp  (6 per shape)
 *
 * Products are mapped to the closest DummyJSON category. A couple of categories
 * (notebook, mouse) have no exact match, so their nearest product photos are used.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public', 'images', 'products');
const API = 'https://dummyjson.com/products?limit=0';
const UA = 'Mozilla/5.0 (compatible; ShopNowPrototype/1.0)';
const PER_SHAPE = 6;

const MAP = {
  earbuds: { categories: ['mobile-accessories'], keywords: ['airpod', 'earphone', 'beats', 'headphone'] },
  sneaker: { categories: ['mens-shoes', 'womens-shoes'], keywords: ['sneaker', 'trainer', 'shoe', 'jordan'] },
  skincare: { categories: ['skin-care', 'beauty'], keywords: ['skin', 'lotion', 'soap', 'body', 'cream'] },
  lamp: { categories: ['home-decoration', 'mobile-accessories'], keywords: ['lamp', 'light'] },
  bottle: { categories: ['groceries'], keywords: ['water', 'juice', 'milk', 'drink', 'oil'] },
  backpack: { categories: ['womens-bags'], keywords: ['backpack', 'bag'] },
  watch: { categories: ['mens-watches', 'womens-watches', 'mobile-accessories'], keywords: ['watch', 'wrist'] },
  phoneCase: { categories: ['mobile-accessories'], keywords: ['case', 'cover', 'magsafe'] },
  coffeeMaker: { categories: ['kitchen-accessories', 'groceries'], keywords: ['coffee', 'blender', 'microwave', 'stove', 'kettle', 'nescafe'] },
  notebook: { categories: ['groceries', 'kitchen-accessories'], keywords: ['tissue', 'paper', 'board', 'tray', 'plate', 'box'] },
  mouse: { categories: ['mobile-accessories'], keywords: ['charger', 'power', 'battery', 'echo', 'pedestal', 'monopod'] },
  suitcase: { categories: ['womens-bags'], keywords: ['bag', 'handbag', 'leather', 'prada'] },
};

const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

async function fetchCatalog() {
  const res = await fetch(API, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(30000) });
  if (!res.ok) throw new Error(`catalogue request failed: ${res.status}`);
  return (await res.json()).products ?? [];
}

async function download(url, file, attempt = 0) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(30000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    if (!(res.headers.get('content-type') ?? '').startsWith('image/')) throw new Error('not an image');
    writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  } catch (error) {
    if (attempt < 3) {
      await sleep(400 * (attempt + 1));
      return download(url, file, attempt + 1);
    }
    throw error;
  }
}

const poolFor = (products, { categories, keywords }) => {
  const inScope = products.filter((product) => categories.includes(product.category));
  const matches = inScope.filter((product) =>
    keywords.some((keyword) => String(product.title).toLowerCase().includes(keyword)),
  );

  const urls = [];
  const seen = new Set();
  for (const product of [...matches, ...inScope]) {
    for (const image of product.images?.length ? product.images : [product.thumbnail]) {
      if (image && !seen.has(image)) {
        seen.add(image);
        urls.push(image);
      }
    }
  }
  return urls;
};

async function main() {
  mkdirSync(OUT, { recursive: true });
  const catalog = await fetchCatalog();
  let downloaded = 0;

  for (const [shape, config] of Object.entries(MAP)) {
    const pool = poolFor(catalog, config);
    if (!pool.length) {
      console.warn(`! ${shape}: no images found`);
      continue;
    }

    for (let index = 0; index < PER_SHAPE; index += 1) {
      const url = pool[index % pool.length];
      const file = join(OUT, `${shape}-${index + 1}.webp`);
      try {
        await download(url, file);
        downloaded += 1;
      } catch (error) {
        console.warn(`! ${shape}-${index + 1}: ${error.message}`);
      }
      await sleep(120);
    }

    console.log(`  ${shape}: ${Math.min(PER_SHAPE, pool.length)} unique photo(s) available`);
  }

  console.log(`\nDownloaded ${downloaded} product photos into public/images/products`);
}

main();
