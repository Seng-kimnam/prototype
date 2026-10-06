import { Link } from 'react-router-dom';
import { ProductImage } from './ProductImage.jsx';
import { Rating } from './Rating.jsx';
import { deliveryMeta, money } from '../lib/pricing.js';

export function ProductCard({ product, className = '' }) {
  return (
    <Link
      to={`/product/${product.id}`}
      className={`card flex min-h-[190px] flex-col justify-between rounded-[18px] p-3.5 transition duration-150 hover:-translate-y-0.5 hover:border-[#c9d3dc] hover:shadow-[0_14px_30px_rgba(20,42,59,0.08)] ${className}`}
    >
      <div>
        <ProductImage src={product.image} alt={product.name} className="mb-2.5 aspect-[4/3] w-full" />
        <span className="text-[11px] font-bold tracking-wide text-muted uppercase">{product.brand}</span>
        <h3 className="mt-0.5 text-[15px] leading-snug font-extrabold text-ink">{product.name}</h3>
        <div className="mt-2 text-xs font-extrabold text-[#64748b]">Final total</div>
        <div className="my-0.5 text-[22px] font-black text-navy">{money(product.total)}</div>
        <Rating value={product.rating} reviews={product.reviews} />
      </div>
      <div className="mt-3 border-t border-line pt-2.5 text-xs text-muted">{deliveryMeta(product)}</div>
    </Link>
  );
}

export function ProductGrid({ products, className = 'grid grid-cols-2 gap-3.5 lg:grid-cols-4' }) {
  return (
    <div className={`${className} mt-5`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}