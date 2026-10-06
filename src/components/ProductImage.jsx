export function ProductImage({ src, alt, className = '', eager = false }) {
  return (
    <div className={`overflow-hidden rounded-2xl bg-[linear-gradient(145deg,#edf1f4,#ffffff)] ${className}`}>
      <img
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className="h-full w-full object-cover"
      />
    </div>
  );
}

export function CategoryImage({ src, alt, className = '' }) {
  return <img src={src} alt={alt} loading="lazy" decoding="async" className={className} />;
}