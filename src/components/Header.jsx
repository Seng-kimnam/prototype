import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useShop } from '../store/ShopContext.jsx';
import { Icon } from './icons.jsx';

const STEP_BY_PATH = [
  { prefix: '/search', step: 'search' },
  { prefix: '/product', step: 'product' },
  { prefix: '/preferences', step: 'preferences' },
  { prefix: '/shortlist', step: 'shortlist' },
  { prefix: '/choice', step: 'choice' },
  { prefix: '/cart', step: 'cart' },
  { prefix: '/order', step: 'success' },
];

export function ProgressTrail() {
  const { pathname } = useLocation();
  const { query, activeProductId, order } = useShop();

  const activeStep = useMemo(() => {
    const match = STEP_BY_PATH.find((entry) => pathname.startsWith(entry.prefix));
    return match ? match.step : 'home';
  }, [pathname]);

  const steps = useMemo(() => {
    const searchTo = query ? `/search?q=${encodeURIComponent(query)}` : '/';
    const productTo = activeProductId ? `/product/${activeProductId}` : searchTo;
    const orderTo = order ? `/order/${order.id}` : '/order';

    return [
      { key: 'home', label: 'Home', to: '/' },
      { key: 'search', label: 'Search', to: searchTo },
      { key: 'product', label: 'Product', to: productTo },
      { key: 'preferences', label: 'Ask AI', to: '/preferences' },
      { key: 'shortlist', label: 'Shortlist', to: '/shortlist' },
      { key: 'choice', label: 'Choice', to: '/choice' },
      { key: 'cart', label: 'Cart', to: '/cart' },
      { key: 'success', label: 'Success', to: orderTo },
    ];
  }, [query, activeProductId, order]);

  const currentIndex = steps.findIndex((step) => step.key === activeStep);

  return (
    <nav aria-label="Prototype progress" className="hidden items-center gap-2 text-xs text-muted lg:flex">
      {steps.map((step, index) => {
        const state = index < currentIndex ? 'done' : index === currentIndex ? 'active' : 'todo';
        return (
          <span key={step.key} className="flex items-center gap-2">
            {index > 0 ? <span className="h-px w-4 bg-[#dfe5eb]" aria-hidden="true" /> : null}
            <Link
              to={step.to}
              aria-current={state === 'active' ? 'step' : undefined}
              className={`flex items-center gap-1.5 rounded-full px-1.5 py-1 transition ${
                state === 'todo' ? 'hover:text-navy' : ''
              }`}
            >
              <span
                className={`h-2.25 w-2.25 rounded-full transition ${
                  state === 'active'
                    ? 'bg-flame ring-4 ring-[rgba(255,90,0,0.15)]'
                    : state === 'done'
                      ? 'bg-navy'
                      : 'bg-[#cbd4dc]'
                }`}
              />
              <span className={state === 'active' ? 'font-extrabold text-ink' : ''}>{step.label}</span>
            </Link>
          </span>
        );
      })}
    </nav>
  );
}

export function Header() {
  const { cartTotals } = useShop();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white">
      <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-3 px-5 py-4">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/images/brand/logo.svg" alt="" className="h-8 w-8" />
          <span className="leading-tight font-extrabold text-ink">
            ShopNow Smart Choice
            <small className="block text-[11px] font-bold text-muted">Low-fidelity test prototype</small>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <ProgressTrail />
          <Link
            to="/cart"
            aria-label={`Cart with ${cartTotals.itemCount} items`}
            className="relative grid h-11 w-11 place-items-center rounded-2xl border border-line bg-white text-navy transition hover:-translate-y-px hover:border-[#c9d3dc]"
          >
            <Icon name="cart" className="h-5.5 w-5.5" />
            {cartTotals.itemCount > 0 ? (
              <span className="absolute -top-2 -right-2 grid h-6 min-w-6 place-items-center rounded-full bg-flame px-1.5 text-[11px] font-black text-white">
                {cartTotals.itemCount}
              </span>
            ) : null}
          </Link>
        </div>
      </div>
    </header>
  );
}