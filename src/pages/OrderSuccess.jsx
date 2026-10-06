import { Link, useNavigate, useParams } from 'react-router-dom';
import { PriceFormula } from '../components/CostBreakdown.jsx';
import { Icon } from '../components/icons.jsx';
import { formula, money, shippingMoney } from '../lib/pricing.js';
import { useShop } from '../store/ShopContext.jsx';
import NotFound from './NotFound.jsx';

export default function OrderSuccess() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { order, startNewOrder } = useShop();

  if (!order || (orderId && order.id !== orderId)) {
    return (
      <div className="animate-rise mx-auto max-w-[760px] py-10 text-center">
        <h1 className="text-3xl font-black">No recent order to show</h1>
        <p className="mx-auto mt-2 max-w-[520px] text-muted">
          Checkout an order and the full receipt with the price breakdown will appear here.
        </p>
        <Link to="/" className="btn btn-primary mt-6">
          <Icon name="store" className="h-4.5 w-4.5" />
          Back to home
        </Link>
      </div>
    );
  }

  const placed = new Date(order.placedAt);

  return (
    <div className="animate-rise mx-auto max-w-[760px]">
      <div className="rounded-[26px] border border-[#cfe8d6] bg-[linear-gradient(135deg,#eef9f1,#ffffff)] px-7 py-7.5 text-center shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
        <div className="mx-auto grid h-[76px] w-[76px] place-items-center rounded-full bg-grass text-white">
          <Icon name="check" className="h-9 w-9" strokeWidth={3} />
        </div>
        <span className="mt-4 inline-block rounded-full bg-[#eef4f7] px-3 py-1.5 text-xs font-extrabold text-navy">
          Order #{order.id}
        </span>
        <h1 className="mt-3.5 text-4xl font-black">Order placed successfully!</h1>
        <p className="mx-auto mt-2 max-w-[520px] text-muted">
          Your ShopNow order is confirmed. Here is the receipt with the full price breakdown
          {placed ? ` · placed ${placed.toLocaleString('en-US')}` : ''}.
        </p>
      </div>

      <div className="card mt-5 p-6">
        <h2 className="text-[28px] font-black">Order Receipt</h2>
        <p className="mt-1 text-xs text-muted">A clear record of what you bought and how the final price was built.</p>

        <div className="mt-4 grid gap-3">
          {order.lines.map((line) => (
            <div key={line.product.id} className="flex items-center justify-between gap-4 rounded-[14px] bg-[#f7f9fb] px-3.5 py-3">
              <div className="min-w-0">
                <b className="block truncate">{line.product.name}</b>
                <div className="text-xs text-muted">
                  Qty {line.qty} · {line.product.rating} · {line.product.brand}
                </div>
              </div>
              <b>{money(line.product.price * line.qty)}</b>
            </div>
          ))}
        </div>

        <div className="mt-4.5">
          <div className="flex items-center justify-between gap-4 py-2 text-sm">
            <span className="text-muted">Products subtotal</span>
            <b>{money(order.subtotal)}</b>
          </div>
          <div className="flex items-center justify-between gap-4 py-2 text-sm">
            <span className="text-muted">Shipping</span>
            <b>{shippingMoney(order.shipping)}</b>
          </div>
          <div className="flex items-center justify-between gap-4 py-2 text-sm">
            <span className="text-muted">Service fee</span>
            <b>{money(order.serviceFee)}</b>
          </div>
          <div className="mt-1.5 flex items-center justify-between gap-4 border-t-2 border-line pt-3.5 text-[26px] font-black">
            <span>Final amount paid</span>
            <span className="text-navy">{money(order.total)}</span>
          </div>
        </div>

        <PriceFormula className="mt-4">{formula(order)}</PriceFormula>

        <div className="mt-4 rounded-[10px] border-l-4 border-flame bg-[#fff6ef] px-3.5 py-3 text-[13px] leading-relaxed text-[#5d4b3f]">
          <b>Receipt clarity:</b> the customer can see exactly how the final amount was calculated — product prices plus
          shipping plus service fees, with nothing hidden until checkout.
        </div>

        <div className="mt-5 flex flex-wrap justify-end gap-2.5">
          <Link to="/" className="btn btn-secondary">
            Back to home
          </Link>
          <button
            type="button"
            onClick={() => {
              startNewOrder();
              navigate('/');
            }}
            className="btn btn-primary"
          >
            <Icon name="refresh" className="h-4.5 w-4.5" />
            Start new order
          </button>
        </div>
      </div>
    </div>
  );
}