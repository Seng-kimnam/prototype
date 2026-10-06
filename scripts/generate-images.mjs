/**
 * Generates every image asset used by the prototype so no emoji is needed.
 *
 *   node scripts/generate-images.mjs
 *
 * Output:
 *   public/images/brand/logo.svg
 *   public/images/ai/assistant.svg
 *   public/images/ai/sparkle.svg
 *   public/images/states/empty-search.svg
 *   public/images/states/empty-cart.svg
 *   public/images/categories/<shape>.svg
 *   public/images/products/<shape>-<n>.svg
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const IMG = join(ROOT, 'public', 'images');

const write = (relativePath, contents) => {
  const target = join(IMG, relativePath);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, contents.trim() + '\n', 'utf8');
  return relativePath;
};

/* ---------------------------------------------------------------- palettes */

const productPalettes = [
  { base: '#315775', dark: '#1d4562', accent: '#ff5a00', from: '#f4f7fa', to: '#e8eff5' },
  { base: '#1f7a6b', dark: '#12564a', accent: '#f59e0b', from: '#f3faf8', to: '#e4f3ef' },
  { base: '#5b4a86', dark: '#3b2f5c', accent: '#ff5a00', from: '#f7f5fc', to: '#ece7f6' },
  { base: '#2f68c5', dark: '#1d457f', accent: '#ff8a3d', from: '#f4f8fe', to: '#e6eefa' },
];

const iconPalette = {
  base: '#315775',
  dark: '#1d4562',
  accent: '#ff5a00',
  from: '#ffffff',
  to: '#eef4f7',
};

/* ------------------------------------------------------------ shape library */

const shapes = {
  earbuds: (p) => `
    <rect x="146" y="248" width="108" height="62" rx="26" fill="${p.base}"/>
    <path d="M146 274h108" stroke="${p.dark}" stroke-width="4" opacity="0.45"/>
    <circle cx="200" cy="292" r="5" fill="${p.accent}"/>
    <rect x="126" y="194" width="28" height="60" rx="14" fill="${p.dark}"/>
    <circle cx="140" cy="176" r="32" fill="${p.base}"/>
    <ellipse cx="130" cy="168" rx="12" ry="8" fill="#ffffff" opacity="0.28"/>
    <circle cx="140" cy="180" r="9" fill="${p.accent}" opacity="0.9"/>
    <rect x="248" y="194" width="28" height="60" rx="14" fill="${p.dark}"/>
    <circle cx="262" cy="176" r="32" fill="${p.base}"/>
    <ellipse cx="252" cy="168" rx="12" ry="8" fill="#ffffff" opacity="0.28"/>
    <circle cx="262" cy="180" r="9" fill="${p.accent}" opacity="0.9"/>`,

  sneaker: (p) => `
    <path d="M104 262c0-16 8-28 12-46l14-58c3-11 15-11 18 0l18 58c3 9 10 14 24 18l62 20c15 5 24 14 24 26v12c0 7-5 12-12 12H116c-7 0-12-5-12-12z" fill="${p.base}"/>
    <path d="M100 276h176c9 0 16 7 16 16v4c0 7-6 12-13 12H113c-7 0-13-5-13-12z" fill="${p.accent}"/>
    <g stroke="#ffffff" stroke-width="7" stroke-linecap="round" opacity="0.75">
      <path d="M168 214h34"/><path d="M176 234h36"/><path d="M186 254h38"/>
    </g>
    <circle cx="252" cy="240" r="17" fill="#ffffff" opacity="0.22"/>`,

  skincare: (p) => `
    <rect x="176" y="124" width="48" height="30" rx="10" fill="${p.dark}"/>
    <rect x="164" y="80" width="72" height="52" rx="16" fill="${p.dark}"/>
    <rect x="136" y="146" width="128" height="168" rx="26" fill="${p.base}"/>
    <rect x="152" y="164" width="96" height="134" rx="18" fill="#ffffff" opacity="0.12"/>
    <rect x="152" y="194" width="96" height="70" rx="16" fill="#ffffff" opacity="0.92"/>
    <rect x="168" y="214" width="64" height="9" rx="4.5" fill="${p.base}" opacity="0.85"/>
    <rect x="182" y="234" width="36" height="7" rx="3.5" fill="${p.base}" opacity="0.5"/>
    <circle cx="256" cy="196" r="13" fill="${p.accent}" opacity="0.9"/>`,

  lamp: (p) => `
    <ellipse cx="200" cy="310" rx="74" ry="16" fill="${p.dark}"/>
    <rect x="192" y="178" width="16" height="132" rx="8" fill="${p.base}"/>
    <circle cx="200" cy="178" r="14" fill="${p.accent}"/>
    <path d="M138 182h124l-24-76h-76z" fill="${p.base}"/>
    <path d="M152 182h96l-19-62h-58z" fill="#ffffff" opacity="0.2"/>
    <ellipse cx="200" cy="184" rx="52" ry="10" fill="${p.accent}" opacity="0.55"/>
    <g stroke="${p.accent}" stroke-width="7" stroke-linecap="round" opacity="0.55">
      <path d="M172 212v20"/><path d="M200 216v26"/><path d="M228 212v20"/>
    </g>`,

  bottle: (p) => `
    <rect x="174" y="68" width="52" height="32" rx="13" fill="${p.dark}"/>
    <rect x="166" y="94" width="68" height="20" rx="10" fill="${p.accent}"/>
    <rect x="152" y="110" width="96" height="202" rx="32" fill="${p.base}"/>
    <rect x="166" y="128" width="20" height="166" rx="10" fill="#ffffff" opacity="0.2"/>
    <rect x="152" y="194" width="96" height="34" fill="${p.dark}" opacity="0.18"/>
    <rect x="166" y="230" width="68" height="48" rx="14" fill="#ffffff" opacity="0.92"/>
    <rect x="180" y="248" width="40" height="8" rx="4" fill="${p.base}" opacity="0.85"/>`,

  backpack: (p) => `
    <path d="M178 158v-20a22 22 0 0 1 44 0v20" fill="none" stroke="${p.dark}" stroke-width="12" stroke-linecap="round"/>
    <path d="M120 166h160a26 26 0 0 1 26 26v124a26 26 0 0 1-26 26H120a26 26 0 0 1-26-26V192a26 26 0 0 1 26-26z" fill="${p.base}"/>
    <path d="M94 206h212v34a12 12 0 0 1-12 12H106a12 12 0 0 1-12-12z" fill="${p.dark}"/>
    <rect x="182" y="202" width="36" height="28" rx="9" fill="${p.accent}"/>
    <rect x="140" y="274" width="120" height="46" rx="16" fill="#ffffff" opacity="0.2"/>`,

  watch: (p) => `
    <rect x="176" y="64" width="48" height="94" rx="16" fill="${p.dark}"/>
    <rect x="176" y="242" width="48" height="94" rx="16" fill="${p.dark}"/>
    <rect x="146" y="146" width="108" height="108" rx="32" fill="${p.base}"/>
    <rect x="162" y="162" width="76" height="76" rx="22" fill="#163249"/>
    <path d="M200 200l22-14" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>
    <path d="M178 212a26 26 0 0 0 44 0" fill="none" stroke="${p.accent}" stroke-width="6" stroke-linecap="round"/>
    <circle cx="200" cy="200" r="6" fill="${p.accent}"/>
    <rect x="252" y="186" width="14" height="28" rx="7" fill="${p.dark}"/>`,

  phoneCase: (p) => `
    <rect x="128" y="102" width="144" height="196" rx="32" fill="${p.dark}"/>
    <rect x="142" y="116" width="116" height="168" rx="22" fill="${p.base}"/>
    <rect x="152" y="128" width="54" height="54" rx="16" fill="${p.dark}"/>
    <circle cx="168" cy="144" r="9" fill="#ffffff" opacity="0.35"/>
    <circle cx="190" cy="166" r="9" fill="#ffffff" opacity="0.35"/>
    <circle cx="192" cy="140" r="4.5" fill="${p.accent}"/>
    <g stroke="#ffffff" stroke-width="7" stroke-linecap="round" opacity="0.2">
      <path d="M166 222h72"/><path d="M166 244h72"/><path d="M166 266h46"/>
    </g>`,

  coffeeMaker: (p) => `
    <rect x="130" y="74" width="140" height="26" rx="13" fill="${p.dark}"/>
    <path d="M116 100h168a16 16 0 0 1 16 16v92H100v-92a16 16 0 0 1 16-16z" fill="${p.base}"/>
    <rect x="130" y="124" width="82" height="54" rx="14" fill="#ffffff" opacity="0.22"/>
    <circle cx="252" cy="152" r="17" fill="${p.accent}"/>
    <rect x="188" y="206" width="24" height="24" rx="9" fill="${p.dark}"/>
    <path d="M160 238h80v44a26 26 0 0 1-26 26h-28a26 26 0 0 1-26-26z" fill="#ffffff" opacity="0.95"/>
    <path d="M160 262h80v14h-80z" fill="${p.accent}" opacity="0.85"/>
    <path d="M240 248h14a12 12 0 0 1 0 24h-14" fill="none" stroke="#ffffff" stroke-width="10" opacity="0.85"/>
    <rect x="126" y="306" width="148" height="20" rx="10" fill="${p.dark}"/>`,

  notebook: (p) => `
    <rect x="118" y="94" width="166" height="212" rx="18" fill="${p.base}"/>
    <path d="M118 112a18 18 0 0 1 18-18h20v230h-20a18 18 0 0 1-18-18z" fill="${p.dark}"/>
    <rect x="266" y="106" width="18" height="188" rx="9" fill="#ffffff" opacity="0.85"/>
    <rect x="228" y="94" width="13" height="212" fill="${p.accent}"/>
    <rect x="158" y="138" width="58" height="76" rx="14" fill="#ffffff" opacity="0.92"/>
    <rect x="172" y="160" width="32" height="8" rx="4" fill="${p.base}" opacity="0.8"/>
    <rect x="182" y="178" width="12" height="7" rx="3.5" fill="${p.base}" opacity="0.5"/>
    <g stroke="${p.accent}" stroke-width="6" stroke-linecap="round" opacity="0.9">
      <path d="M124 142h30"/><path d="M124 178h30"/><path d="M124 214h30"/><path d="M124 250h30"/>
    </g>`,

  mouse: (p) => `
    <path d="M200 86c52 0 82 44 82 100v26c0 50-36 92-82 92s-82-42-82-92v-26c0-56 30-100 82-100z" fill="${p.base}"/>
    <path d="M200 92v104" stroke="${p.dark}" stroke-width="6" opacity="0.55"/>
    <path d="M120 196h160" stroke="${p.dark}" stroke-width="4" opacity="0.3"/>
    <rect x="188" y="136" width="24" height="52" rx="12" fill="${p.accent}"/>
    <path d="M132 212c0 44 30 78 68 78s68-34 68-78" fill="none" stroke="${p.accent}" stroke-width="8" stroke-linecap="round" opacity="0.9"/>
    <g fill="#ffffff" opacity="0.22">
      <circle cx="150" cy="242" r="4.5"/><circle cx="168" cy="254" r="4.5"/><circle cx="188" cy="262" r="4.5"/>
    </g>`,

  suitcase: (p) => `
    <rect x="176" y="56" width="48" height="24" rx="12" fill="${p.dark}"/>
    <rect x="180" y="76" width="10" height="76" rx="5" fill="${p.dark}"/>
    <rect x="210" y="76" width="10" height="76" rx="5" fill="${p.dark}"/>
    <rect x="104" y="146" width="192" height="154" rx="28" fill="${p.base}"/>
    <path d="M104 216h192" stroke="${p.dark}" stroke-width="6" opacity="0.45"/>
    <rect x="186" y="146" width="28" height="154" fill="${p.dark}" opacity="0.5"/>
    <rect x="180" y="202" width="40" height="26" rx="9" fill="${p.accent}"/>
    <rect x="122" y="238" width="62" height="36" rx="11" fill="#ffffff" opacity="0.85"/>
    <circle cx="140" cy="310" r="14" fill="${p.dark}"/>
    <circle cx="260" cy="310" r="14" fill="${p.dark}"/>`,
};

/* --------------------------------------------------------------- templates */

const svg = (body, { size, label }) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="${label}">${body}</svg>`;

const productImage = (shape, palette, label) =>
  svg(
    `
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${palette.from}"/>
        <stop offset="1" stop-color="${palette.to}"/>
      </linearGradient>
    </defs>
    <rect width="400" height="400" rx="52" fill="url(#bg)"/>
    <circle cx="336" cy="64" r="76" fill="${palette.accent}" opacity="0.1"/>
    <circle cx="60" cy="336" r="92" fill="${palette.base}" opacity="0.08"/>
    <ellipse cx="200" cy="348" rx="124" ry="20" fill="${palette.dark}" opacity="0.1"/>
    ${shapes[shape](palette)}`,
    { size: 400, label },
  );

const categoryIcon = (shape, label) =>
  svg(
    `
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${iconPalette.from}"/>
        <stop offset="1" stop-color="${iconPalette.to}"/>
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="196" height="196" rx="48" fill="url(#bg)" stroke="#dfe5eb" stroke-width="4"/>
    <g transform="translate(100 100) scale(0.66) translate(-200 -200)">${shapes[shape](iconPalette)}</g>`,
    { size: 200, label },
  );

/* ------------------------------------------------------------ extra assets */

const brandLogo = () =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="ShopNow">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ff8a3d"/><stop offset="1" stop-color="#ff5a00"/>
    </linearGradient>
  </defs>
  <path d="M32 4c3.4 14.6 9.4 20.6 24 24-14.6 3.4-20.6 9.4-24 24-3.4-14.6-9.4-20.6-24-24C22.6 24.6 28.6 18.6 32 4z" fill="url(#g)"/>
  <path d="M48 40c1.7 7.3 4.7 10.3 12 12-7.3 1.7-10.3 4.7-12 12-1.7-7.3-4.7-10.3-12-12 7.3-1.7 10.3-4.7 12-12z" fill="#ff8a3d" opacity="0.85"/>
</svg>`;

const sparkle = (fill = '#ffffff') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="AI sparkle">
  <path d="M30 6c2.6 11.2 7.2 15.8 18.4 18.4C37.2 27 32.6 31.6 30 42.8 27.4 31.6 22.8 27 11.6 24.4 22.8 21.8 27.4 17.2 30 6z" fill="${fill}"/>
  <path d="M47 38c1.4 5.6 3.6 7.8 9.2 9.2-5.6 1.4-7.8 3.6-9.2 9.2-1.4-5.6-3.6-7.8-9.2-9.2 5.6-1.4 7.8-3.6 9.2-9.2z" fill="${fill}" opacity="0.8"/>
</svg>`;

const aiAssistant = () =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200" role="img" aria-label="ShopNow AI assistant">
  <defs>
    <linearGradient id="body" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#1d4562"/><stop offset="1" stop-color="#3f739c"/>
    </linearGradient>
    <linearGradient id="face" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#dcecf8"/>
    </linearGradient>
  </defs>
  <rect width="200" height="200" rx="56" fill="url(#body)"/>
  <circle cx="150" cy="46" r="52" fill="#ffffff" opacity="0.07"/>
  <rect x="92" y="26" width="16" height="26" rx="8" fill="#ff8a3d"/>
  <circle cx="100" cy="26" r="11" fill="#ff5a00"/>
  <rect x="38" y="56" width="124" height="104" rx="38" fill="url(#face)"/>
  <rect x="58" y="86" width="84" height="52" rx="26" fill="#163249"/>
  <circle cx="80" cy="112" r="9" fill="#7fd4ff"/>
  <circle cx="120" cy="112" r="9" fill="#7fd4ff"/>
  <path d="M86 128q14 12 28 0" stroke="#ff8a3d" stroke-width="7" stroke-linecap="round" fill="none"/>
  <path d="M30 132a12 12 0 0 0 0 24" stroke="#3f739c" stroke-width="10" stroke-linecap="round" fill="none"/>
  <path d="M170 132a12 12 0 0 1 0 24" stroke="#3f739c" stroke-width="10" stroke-linecap="round" fill="none"/>
  <path d="M76 176h48" stroke="#0f2b3f" stroke-width="10" stroke-linecap="round" opacity="0.5"/>
</svg>`;

const emptySearch = () =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 160" width="200" height="160" role="img" aria-label="No matching products">
  <ellipse cx="100" cy="140" rx="66" ry="12" fill="#dfe5eb" opacity="0.7"/>
  <circle cx="88" cy="70" r="40" fill="#eef4f7" stroke="#315775" stroke-width="10"/>
  <circle cx="88" cy="70" r="22" fill="#ffffff" opacity="0.85"/>
  <path d="M118 100l30 30" stroke="#ff5a00" stroke-width="16" stroke-linecap="round"/>
  <path d="M74 68h28M74 80h18" stroke="#6f7b86" stroke-width="6" stroke-linecap="round"/>
</svg>`;

const emptyCart = () =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 160" width="200" height="160" role="img" aria-label="Empty cart">
  <ellipse cx="100" cy="140" rx="70" ry="12" fill="#dfe5eb" opacity="0.7"/>
  <path d="M28 34h26l22 66h70l18-46H64" fill="none" stroke="#315775" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="86" cy="122" r="12" fill="#ff5a00"/>
  <circle cx="136" cy="122" r="12" fill="#ff5a00"/>
  <path d="M96 62h44" stroke="#6f7b86" stroke-width="8" stroke-linecap="round"/>
</svg>`;

/* -------------------------------------------------------------------- build */

const written = [];

written.push(write('brand/logo.svg', brandLogo()));
written.push(write('ai/sparkle.svg', sparkle()));
written.push(write('ai/sparkle-dark.svg', sparkle('#ff5a00')));
written.push(write('ai/assistant.svg', aiAssistant()));
written.push(write('states/empty-search.svg', emptySearch()));
written.push(write('states/empty-cart.svg', emptyCart()));

for (const shape of Object.keys(shapes)) {
  written.push(write(`categories/${shape}.svg`, categoryIcon(shape, shape)));
  productPalettes.forEach((palette, index) => {
    written.push(
      write(`products/${shape}-${index + 1}.svg`, productImage(shape, palette, `${shape} ${index + 1}`)),
    );
  });
}

console.log(`Generated ${written.length} SVG assets into public/images`);