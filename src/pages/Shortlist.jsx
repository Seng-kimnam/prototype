import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Breadcrumb } from '../components/Breadcrumb.jsx';
import { CostBreakdown } from '../components/CostBreakdown.jsx';
import { ProductImage } from '../components/ProductImage.jsx';
import { Rating } from '../components/Rating.jsx';
import { Icon } from '../components/icons.jsx';
import { money } from '../lib/pricing.js';
import { TONE_BORDER, TONE_CLASS, compareRows } from '../lib/shortlist.js';
import { useShop } from '../store/ShopContext.jsx';

export default function Shortlist() {
  const navigate = useNavigate();
  const { shortlist, preferenceCategory, preferences, aiPrompt, addToCart, confirmChoice, generateShortlist } = useShop();
  const [showCompare, setShowCompare] = useState(false);

  if (!shortlist.length) {
    return (
      <div className="animate-rise">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Ask AI' }, { label: 'Shortlist' }]} />
        <div className="card mt-4 px-8 py-12 text-center">
          <h2 className="text-[28px] font-black">No shortlist yet</h2>
          <p className="mx-auto mt-2 max-w-180 text-muted">
            Describe what you need and the AI will rank the matching products for you.
          </p>
          <Link to="/preferences" className="btn btn-primary mt-5">
            <img src="/images/ai/sparkle.svg" alt="" className="h-4.5 w-4.5" />
            Ask the AI
          </Link>
        </div>
      </div>
    );
  }

  const category = preferenceCategory;
  const rows = compareRows(shortlist, category);

  const choose = (pick) => {
    confirmChoice(pick);
    addToCart(pick.product, { aiReason: `${pick.badgeMeta.label}: ${pick.why}`, badge: pick.badge });
    navigate('/choice');
  };

  const rebuild = () => generateShortlist(category.slug, preferences);

  return (
    <div className="animate-rise">
      <Breadcrumb
        items={[{ label: 'Home', to: '/' }, { label: 'Preferences', to: '/preferences' }, { label: 'Your shortlist' }]}
      />

      <h2 className="text-[28px] font-black">Your Smart Shortlist</h2>
      {aiPrompt ? (
        <p className="mt-2 inline-flex max-w-180 items-start gap-2 rounded-2xl bg-flame-tint px-3.5 py-2.5 text-sm text-ink">
          <img src="/images/ai/sparkle.svg" alt="" className="mt-0.5 h-4 w-4 flex-none" />
          <span>
            <b>You asked:</b> “{aiPrompt}”
          </span>
        </p>
      ) : null}
      <p className="mt-2 max-w-180 text-muted">
        {shortlist.length} options were ranked against your request
        {preferences.length
          ? `: ${preferences.map((preference) => preference.label.toLowerCase()).join(', ')}.`
          : '.'}{' '}
        Each card shows the full delivered price before you add it.
      </p>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {shortlist.map((pick) => (
          <article
            key={pick.product.id}
            className={`flex flex-col rounded-[22px] border-2 bg-white p-4.5 ${TONE_BORDER[pick.badge]}`}
          >
            <span
              className={`mb-2 inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-extrabold ${
                TONE_CLASS[pick.badge]
              }`}
            >
              <Icon name={pick.badgeMeta.icon} className="h-4 w-4" />
              {pick.badgeMeta.label}
            </span>

            {pick.badge === 'fit' ? (
              <p className="mb-2 text-xs font-extrabold text-grass">Top AI recommendation</p>
            ) : (
              <p className="mb-2 text-xs font-extrabold text-muted">{pick.badgeMeta.blurb}</p>
            )}

            <ProductImage src={pick.product.image} alt={pick.product.name} className="mb-3 aspect-4/3 w-full" />
            <span className="text-[11px] font-bold tracking-wide text-muted uppercase">{pick.product.brand}</span>
            <h3 className="text-lg font-black">{pick.product.name}</h3>
            <div className="my-1 text-[22px] font-black text-navy">{money(pick.total)}</div>
            <Rating value={pick.product.rating} reviews={pick.product.reviews} />

            <div className="mt-3 rounded-[14px] bg-[#f7f9fb] px-3.5 py-3 text-[13px] leading-relaxed text-[#3c4955]">
              <b className="text-ink">Why this fits you</b>
              <br />
              {pick.why}
            </div>

            <CostBreakdown
              price={pick.product.price}
              shipping={pick.product.shipping}
              serviceFee={pick.product.serviceFee}
              total={pick.total}
              className="mt-3"
            />

            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={() => choose(pick)} className="btn btn-primary flex-1">
                <Icon name="cart" className="h-4.5 w-4.5" />
                Add to cart
              </button>
              <Link to={`/product/${pick.product.id}`} className="btn btn-ghost">
                Details
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap justify-end gap-2.5">
        <Link to="/preferences" className="btn btn-secondary">
          <Icon name="sliders" className="h-4.5 w-4.5" />
          Ask again
        </Link>
        {/* <button type="button" onClick={rebuild} className="btn btn-secondary">
          <Icon name="refresh" className="h-4.5 w-4.5" />
          Re-rank
        </button> */}
        <button type="button" onClick={() => setShowCompare((open) => !open)} className="btn btn-primary">
          {showCompare ? 'Hide comparison' : `Compare the ${shortlist.length}`}
        </button>
      </div>

      {showCompare ? (
        <div className="mt-4 overflow-x-auto rounded-[18px] border border-line bg-white">
          <table className="w-full min-w-180 border-collapse">
            <thead>
              <tr>
                <th className="bg-[#f4f7fa] px-3.5 py-3 text-left text-sm font-extrabold">What matters</th>
                {shortlist.map((pick) => (
                  <th key={pick.product.id} className="bg-[#f4f7fa] px-3.5 py-3 text-left text-sm font-extrabold">
                    {pick.product.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-t border-line">
                  <td className="px-3.5 py-3 text-sm text-muted">{row.label}</td>
                  {row.values.map((value, cellIndex) => (
                    <td
                      key={cellIndex}
                      className={`px-3.5 py-3 text-sm ${
                        cellIndex === row.bestIndex ? 'font-black text-grass' : 'font-semibold text-ink'
                      }`}
                    >
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}