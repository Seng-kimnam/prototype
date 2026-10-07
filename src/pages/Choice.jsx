import { Link } from 'react-router-dom';
import { Breadcrumb } from '../components/Breadcrumb.jsx';
import { ProductImage } from '../components/ProductImage.jsx';
import { Icon } from '../components/icons.jsx';
import { deliveryCopy, lineTotal, money, shippingMoney } from '../lib/pricing.js';
import { TONE_CLASS } from '../lib/shortlist.js';
import { useShop } from '../store/ShopContext.jsx';

const SUCCESS_POINTS = [
  'One clear product selected — the shopper moved from many similar options to a single preferred choice.',
  'The recommendation matched the stated needs — the pick reflects the budget, review, feature and delivery needs described in the shopper\'s request.',
  'Less choice overload — there is no long comparison list left to work through by hand.',
];

export default function Choice() {
  const { chosen } = useShop();

  if (!chosen) {
    return (
      <div className="animate-rise">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Choice' }]} />
        <div className="card mt-4 px-8 py-12 text-center">
          <h2 className="text-[28px] font-black">Nothing chosen yet</h2>
          <p className="mx-auto mt-2 max-w-[520px] text-muted">
            Describe what you need to the AI and this screen will confirm the choice and its final price.
          </p>
          <Link to="/preferences" className="btn btn-primary mt-5">
            <img src="/images/ai/sparkle.svg" alt="" className="h-4.5 w-4.5" />
            Ask the AI
          </Link>
        </div>
      </div>
    );
  }

  const { product, badge, badgeMeta, why } = chosen;
  const total = lineTotal(product);

  return (
    <div className="animate-rise">
      <Breadcrumb
        items={[
          { label: 'Home', to: '/' },
          { label: 'Shortlist', to: '/shortlist' },
          { label: 'Choice' },
        ]}
      />

      <div className="grid items-start gap-5 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-[20px] border border-[#c9e8d1] bg-[#eef8f1] p-5.5">
          <span className="pill bg-white">
            <Icon name="check" className="h-4 w-4 text-grass" />
            Choice made
          </span>

          <div className="mt-3.5 flex items-start gap-4">
            <ProductImage src={product.image} alt={product.name} className="h-24 w-24 flex-none" />
            <div>
              <h2 className="text-3xl leading-tight font-black">{product.name}</h2>
              <p className="text-sm text-muted">{product.brand}</p>
              <span
                className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-extrabold ${
                  TONE_CLASS[badge]
                }`}
              >
                <Icon name={badgeMeta.icon} className="h-4 w-4" />
                {badgeMeta.label}
              </span>
            </div>
          </div>

          <p className="mt-3 text-[15px] leading-relaxed text-[#3c4955]">{why}</p>

          <div className="mt-4 flex items-center justify-between gap-4 border-t border-[#c9e8d1] pt-3.5 text-xl font-black">
            <span>Final price you will pay</span>
            <span>{money(total)}</span>
          </div>
          <p className="mt-1 text-xs text-muted">
            Includes {money(product.price)} product price, {shippingMoney(product.shipping)} shipping and{' '}
            {money(product.serviceFee)} service fee · {deliveryCopy(product)}
          </p>
        </div>

        <div className="card p-6">
          <div className="mb-3.5 grid h-14 w-14 place-items-center rounded-full bg-grass-tint text-grass">
            <Icon name="check" className="h-7 w-7" strokeWidth={2.6} />
          </div>
          <h3 className="text-[26px] font-black">Recommendation Success</h3>
          <p className="mt-2 text-base leading-relaxed text-muted">
            The smart shortlist narrowed many similar products into a single clear choice that matches the shopper's
            priorities.
          </p>

          <div className="mt-5 grid gap-3">
            {SUCCESS_POINTS.map((point) => (
              <div key={point} className="rounded-[14px] bg-[#f7f9fb] px-4 py-3.5">
                <b className="flex items-center gap-2 text-grass">
                  <Icon name="check" className="h-4 w-4" strokeWidth={2.4} />
                  {point.split(' — ')[0]}
                </b>
                <div className="mt-1 pl-6 text-xs text-muted">{point.split(' — ')[1]}</div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap justify-end gap-2.5">
            <Link to="/shortlist" className="btn btn-secondary">
              Back to shortlist
            </Link>
            <Link to="/cart" className="btn btn-primary">
              <Icon name="cart" className="h-4.5 w-4.5" />
              Go to cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}