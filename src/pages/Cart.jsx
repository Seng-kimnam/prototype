import { Link, useNavigate } from 'react-router-dom';
import { Breadcrumb } from '../components/Breadcrumb.jsx';
import { PriceFormula, TotalHero } from '../components/CostBreakdown.jsx';
import { ProductImage } from '../components/ProductImage.jsx';
import { Rating } from '../components/Rating.jsx';
import { Icon } from '../components/icons.jsx';
import { deliveryMeta, formula, money, shippingMoney } from '../lib/pricing.js';
import { useShop } from '../store/ShopContext.jsx';

export default function Cart() {
  const navigate = useNavigate();
  const { cart, cartTotals, changeQty, removeFromCart, query, placeOrder } = useShop();

  const checkout = () => {
    const order = placeOrder();
    if (order) navigate(`/order/${order.id}`);
  };

  return (
    <div className="animate-rise">
      <Breadcrumb
        items={[
          { label: 'Home', to: '/' },
          { label: 'Search results', to: query ? `/search?q=${encodeURIComponent(query)}` : '/' },
          { label: 'Product details' },
          { label: 'Cart' },
        ]}
      />

      <h2 className="text-[28px] font-black">
        Your Cart{' '}
        <span className="ml-1 inline-flex min-w-[25px] items-center justify-center rounded-full bg-flame px-2 py-0.5 text-xs font-black text-white">
          {cartTotals.itemCount}
        </span>
      </h2>
      <p className="mt-1 max-w-[720px] text-muted">
        Products you added earlier stay in the cart while you keep shopping, and every line keeps its full delivered
        price.
      </p>

      <div className="mt-5 grid items-start gap-5 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="card p-0 sm:p-5">
          {cart.length === 0 ? (
            <div className="px-8 py-12 text-center">
              <img src="/images/states/empty-cart.svg" alt="" className="mx-auto h-32 w-auto" />
              <h3 className="mt-3 text-xl font-black">Your cart is empty</h3>
              <p className="mt-1 text-muted">Find a product or let the AI narrow the options for you.</p>
              <div className="mt-5 flex flex-wrap justify-center gap-2.5">
                <Link to="/" className="btn btn-primary">
                  Back to products
                </Link>
                <Link to="/preferences" className="btn btn-secondary">
                  Try the AI shortlist
                </Link>
              </div>
            </div>
          ) : (
            <div>
              {cart.map((line) => (
                <article key={line.product.id} className="cart-line grid grid-cols-[90px_minmax(0,1fr)] gap-4 border-b border-line py-4 last:border-0 sm:grid-cols-[110px_minmax(0,1fr)_auto]">
                  <ProductImage src={line.product.image} alt={line.product.name} className="h-[90px] w-[90px] sm:h-[110px] sm:w-[110px]" />

                  <div className="min-w-0">
                    <span className="text-[11px] font-bold tracking-wide text-muted uppercase">
                      {line.product.brand}
                    </span>
                    <h3 className="text-base font-black">{line.product.name}</h3>
                    <Rating value={line.product.rating} reviews={line.product.reviews} className="mt-0.5" />
                    <p className="mt-1 text-xs text-muted">{deliveryMeta(line.product)}</p>
                    {line.aiReason ? (
                      <p className="mt-1.5 flex items-start gap-1.5 text-xs font-bold text-grass">
                        <img src="/images/ai/sparkle-dark.svg" alt="" className="mt-0.5 h-3 w-3 flex-none" />
                        {line.aiReason}
                      </p>
                    ) : null}

                    <div className="mt-2.5 flex items-center gap-2.5">
                      <span className="text-xs text-muted">Quantity</span>
                      <button
                        type="button"
                        onClick={() => changeQty(line.product.id, -1)}
                        aria-label={`Decrease quantity of ${line.product.name}`}
                        className="grid h-8 w-8 cursor-pointer place-items-center rounded-[10px] bg-[#eef3f7] text-navy transition hover:bg-[#e3ebf2]"
                      >
                        <Icon name="minus" className="h-4 w-4" />
                      </button>
                      <b className="w-5 text-center">{line.qty}</b>
                      <button
                        type="button"
                        onClick={() => changeQty(line.product.id, 1)}
                        aria-label={`Increase quantity of ${line.product.name}`}
                        className="grid h-8 w-8 cursor-pointer place-items-center rounded-[10px] bg-[#eef3f7] text-navy transition hover:bg-[#e3ebf2]"
                      >
                        <Icon name="plus" className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="col-span-2 text-right sm:col-span-1">
                    <span className="text-xs text-muted">Item price</span>
                    <div className="text-[22px] font-black text-navy">{money(line.product.price)}</div>
                    <div className="text-xs text-muted">
                      {line.qty} × {money(line.product.price)} = {money(line.product.price * line.qty)}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(line.product.id)}
                      className="btn btn-ghost mt-2 px-3 py-2 text-xs"
                    >
                      <Icon name="trash" className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <aside className="card sticky top-[95px] p-5.5">
          <h3 className="text-xl font-black">Order Summary</h3>

          <div className="mt-2 text-sm">
            <div className="flex items-center justify-between gap-4 py-2">
              <span className="text-muted">Products subtotal</span>
              <b>{money(cartTotals.subtotal)}</b>
            </div>
            <div className="flex items-center justify-between gap-4 py-2">
              <span className="text-muted">Shipping</span>
              <b>{shippingMoney(cartTotals.shipping)}</b>
            </div>
            <div className="flex items-center justify-between gap-4 py-2">
              <span className="text-muted">Service fee</span>
              <b>{cartTotals.serviceFee ? money(cartTotals.serviceFee) : '$0'}</b>
            </div>
          </div>

          <TotalHero
            label="Final total"
            amount={money(cartTotals.total)}
            formula={formula(cartTotals)}
          />

          <div className="mt-3.5 rounded-[10px] border-l-4 border-flame bg-[#fff7ef] px-3.5 py-3 text-[13px] leading-relaxed text-[#5c4a40]">
            Final total = all product prices + shipping + service fees. The full amount is visible before checkout.
          </div>

          <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
            <Link to={query ? `/search?q=${encodeURIComponent(query)}` : '/'} className="btn btn-secondary flex-1">
              Continue shopping
            </Link>
            <button type="button" onClick={checkout} disabled={!cart.length} className="btn btn-primary flex-1">
              Proceed to checkout
            </button>
          </div>

          <PriceFormula className="mt-3.5">{formula(cartTotals)}</PriceFormula>
        </aside>
      </div>
    </div>
  );
}