import { SERVICE_FEE } from '../data/categories.js';

export const money = (amount) => `$${Number(amount) || 0}`;

export const shippingMoney = (amount) => (amount > 0 ? money(amount) : 'Free');

export const shippingCopy = (product) => (product.shipping > 0 ? `${money(product.shipping)} shipping` : 'Free shipping');

export const deliveryCopy = (product) => `${product.deliveryDays} day${product.deliveryDays === 1 ? '' : 's'}`;

export const deliveryMeta = (product) => `${shippingCopy(product)} • ${deliveryCopy(product)}`;

export const lineTotal = (product) => product.price + product.shipping + (product.serviceFee ?? SERVICE_FEE);

export const formula = ({ subtotal, shipping, serviceFee }) => {
  const parts = [
    `${money(subtotal)} products`,
    `${shipping > 0 ? money(shipping) : '$0'} shipping`,
    serviceFee > 0 ? `${money(serviceFee)} service fee` : null,
  ].filter(Boolean);

  return `${parts.join(' + ')} = ${money(subtotal + shipping + serviceFee)}`;
};

/** Cart lines are stored as { product, qty, aiReason }. */
export const cartTotals = (lines) => {
  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.qty, 0);
  const shipping = lines.reduce((sum, line) => sum + line.product.shipping * line.qty, 0);
  const serviceFee = lines.reduce((sum, line) => sum + (line.product.serviceFee ?? SERVICE_FEE) * line.qty, 0);

  return {
    subtotal,
    shipping,
    serviceFee,
    total: subtotal + shipping + serviceFee,
    itemCount: lines.reduce((sum, line) => sum + line.qty, 0),
    lineCount: lines.length,
  };
};

export const ratingValue = (product) => Number(product.rating) || 0;

export const compactNumber = (value) =>
  new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value);