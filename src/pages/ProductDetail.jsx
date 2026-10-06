import { useEffect, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Breadcrumb } from '../components/Breadcrumb.jsx';
import { CostBreakdown, PriceFormula } from '../components/CostBreakdown.jsx';
import { ProductImage } from '../components/ProductImage.jsx';
import { Rating } from '../components/Rating.jsx';
import { Icon } from '../components/icons.jsx';
import { categoryOf, productById } from '../data/catalog.js';
import { deliveryCopy, deliveryMeta, money, shippingCopy } from '../lib/pricing.js';
import { useShop } from '../store/ShopContext.jsx';
import NotFound from './NotFound.jsx';

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const product = useMemo(() => productById(productId), [productId]);
  const { query, setActiveProduct, addToCart } = useShop();

  useEffect(() => {
    if (product) setActiveProduct(product.id);
  }, [product, setActiveProduct]);

  if (!product) return <NotFound />;

  const category = categoryOf(product);
  const backTo = query ? `/search?q=${encodeURIComponent(query)}` : `/search?q=${encodeURIComponent(product.query)}`;
  const formulaText = `${money(product.price)} product + $${product.shipping} shipping + ${money(
    product.serviceFee,
  )} service fee = ${money(product.total)} final total`;

  const metaBoxes = [
    { label: 'Category', value: product.categoryName },
    { label: 'Delivery', value: deliveryMeta(product) },
    { label: 'Seller', value: 'Verified ShopNow seller' },
    { label: 'Returns', value: '7-day return policy' },
    ...category.specs.map((spec) => {
      const value = product[spec.field];
      return {
        label: spec.label,
        value: `${spec.kind === 'bool' ? (value ? 'Yes' : 'No') : `${value}${spec.unit ?? ''}`}`,
      };
    }),
  ];

  const addToCartAndGo = () => {
    addToCart(product);
    navigate('/cart');
  };

  return (
    <div className="animate-rise">
      <Breadcrumb
        items={[
          { label: 'Home', to: '/' },
          { label: 'Search results', to: backTo },
          { label: 'Product details' },
        ]}
      />

      <div className="grid items-start gap-7 lg:grid-cols-[320px_minmax(0,1fr)]">
        <ProductImage src={product.image} alt={product.name} eager className="aspect-square w-full" />

        <div className="card p-6">
          <span className="pill">
            <Icon name="store" className="h-4 w-4" />
            {product.categoryName}
          </span>

          <h1 className="mt-3 text-4xl leading-[1.05] font-black">{product.name}</h1>
          <p className="text-sm font-bold text-muted">{product.brand}</p>

          <div className="mt-2 text-4xl font-black text-navy">{money(product.price)}</div>
          <Rating value={product.rating} reviews={product.reviews} className="mt-1" />
          <p className="mt-3 leading-relaxed text-muted">
            Review the details below before you decide. The final delivered price is shown before you add anything to
            the cart.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {metaBoxes.map((box) => (
              <div key={box.label} className="rounded-[14px] bg-[#f7f9fb] px-3.5 py-3">
                <span className="mb-1 block text-xs text-muted">{box.label}</span>
                <b className="text-sm">{box.value}</b>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-[18px] border border-line bg-[#f8fafc] p-4.5">
            <h3 className="text-lg font-black">Order Summary</h3>
            <CostBreakdown
              price={product.price}
              shipping={product.shipping}
              serviceFee={product.serviceFee}
              total={product.total}
              className="mt-3 border-0 pt-0"
            />
            <PriceFormula>{formulaText}</PriceFormula>
            <p className="mt-2.5 text-xs text-muted">
              The final total already includes the product price, shipping and the {money(product.serviceFee)} service
              fee.
            </p>
          </div>

          <div className="mt-5 flex flex-wrap justify-end gap-2.5">
            <Link to={backTo} className="btn btn-secondary">
              <Icon name="arrow-left" className="h-4.5 w-4.5" />
              Back to results
            </Link>
            <button type="button" onClick={addToCartAndGo} className="btn btn-primary">
              <Icon name="cart" className="h-4.5 w-4.5" />
              Add to cart
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Icon name="truck" className="h-4 w-4" />
              {shippingCopy(product)} · {deliveryCopy(product)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon name="shield" className="h-4 w-4" />
              Verified seller
            </span>
            <Link to="/preferences" className="inline-flex items-center gap-1.5 font-extrabold text-flame">
              <img src="/images/ai/sparkle-dark.svg" alt="" className="h-3.5 w-3.5" />
              Compare similar products with AI
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}