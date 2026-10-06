import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from './icons.jsx';
import { useShop } from '../store/ShopContext.jsx';

export function SearchBar({
  initialValue = '',
  placeholder = 'Search products',
  submitLabel = 'Search',
  variant = 'primary',
  extra = [],
  autoFocus = false,
}) {
  const [value, setValue] = useState(initialValue);
  const navigate = useNavigate();
  const { setQuery } = useShop();

  const submit = (event) => {
    event?.preventDefault();
    const term = value.trim();
    if (!term) return;
    setQuery(term);
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <form onSubmit={submit} className="mt-4 flex flex-col gap-2.5 sm:flex-row">
      <div className="relative flex-1">
        <Icon
          name="search"
          className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted"
        />
        <input
          type="text"
          value={value}
          autoFocus={autoFocus}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
          aria-label="Search products"
          className="w-full rounded-2xl border border-line bg-white py-3.5 pr-4 pl-11 text-base text-ink outline-none transition focus:border-flame focus:shadow-[0_0_0_3px_rgba(255,90,0,0.08)]"
        />
      </div>

      <div className="flex gap-2.5">
        {extra.map((item) =>
          item.to ? (
            <Link key={item.label} to={item.to} className={`btn btn-${item.variant}`}>
              {item.icon ? <Icon name={item.icon} className="h-4.5 w-4.5" /> : null}
              {item.label}
            </Link>
          ) : (
            <button key={item.label} type="button" className={`btn btn-${item.variant}`} onClick={item.onClick}>
              {item.icon ? <Icon name={item.icon} className="h-4.5 w-4.5" /> : null}
              {item.label}
            </button>
          ),
        )}
        <button type="submit" className={`btn btn-${variant}`}>
          <Icon name="search" className="h-4.5 w-4.5" />
          {submitLabel}
        </button>
      </div>
    </form>
  );
}