import { money, shippingMoney } from '../lib/pricing.js';

/**
 * The price transparency block reused on the product page, the AI shortlist cards
 * and the cart: product price, shipping, service fee and the final total.
 */
export function CostBreakdown({ price, shipping, serviceFee, total, compact = false, className = '' }) {
  return (
    <div className={`mt-3 border-t border-line pt-3 ${className}`}>
      <div className="grid gap-1.5 text-[13px]">
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted">Product</span>
          <b className="text-ink">{money(price)}</b>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted">Shipping</span>
          <b className="text-ink">{shippingMoney(shipping)}</b>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted">Service fee</span>
          <b className="text-ink">{money(serviceFee)}</b>
        </div>
      </div>
      <div
        className={`mt-2.5 flex items-center justify-between gap-3 border-t border-line ${
          compact ? 'pt-2.5 text-[15px] font-black' : 'pt-3 text-[17px] font-black'
        }`}
      >
        <span>Final total</span>
        <span className="text-navy">{money(total)}</span>
      </div>
    </div>
  );
}

export function PriceFormula({ children, className = '' }) {
  return (
    <p className={`mt-3 rounded-xl bg-[#eef4f7] px-3.5 py-3 text-center text-[13px] font-extrabold text-navy ${className}`}>
      {children}
    </p>
  );
}

export function TotalHero({ label, amount, formula, className = '' }) {
  return (
    <div className={`mt-3.5 rounded-[18px] bg-[linear-gradient(135deg,#315775,#24445d)] px-4.5 py-4 text-white ${className}`}>
      <div className="text-sm font-extrabold tracking-wider uppercase opacity-85">{label}</div>
      <div className="mt-1 text-[42px] leading-none font-black sm:text-[52px]">{amount}</div>
      {formula ? <div className="mt-2 text-[13px] text-[#dbe8f0]">{formula}</div> : null}
    </div>
  );
}