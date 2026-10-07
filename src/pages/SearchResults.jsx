import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Breadcrumb } from '../components/Breadcrumb.jsx';
import { ProductGrid } from '../components/ProductCard.jsx';
import { SearchBar } from '../components/SearchBar.jsx';
import { Icon } from '../components/icons.jsx';
import { catalog } from '../data/catalog.js';
import { searchProducts, suggestQueries } from '../lib/search.js';

const POPULAR_QUERIES = ['wireless earbuds', 'sneakers', 'skincare', 'desk lamp'];

export default function SearchResults() {
  const [params] = useSearchParams();
  const term = params.get('q') ?? '';
  const showAll = params.get('cat') === 'all';

  const { results, words } = useMemo(
    () => (showAll ? { results: catalog, words: [] } : searchProducts(term)),
    [term, showAll],
  );

  const { suggestions, suggestionsArePopular } = useMemo(() => {
    const close = suggestQueries(term);
    return close.length ? { suggestions: close, suggestionsArePopular: false } : { suggestions: POPULAR_QUERIES, suggestionsArePopular: true };
  }, [term]);
  const heading = showAll ? 'Everything on ShopNow' : term ? `Results for “${term}”` : 'Search results';
  const subtitle = showAll
    ? 'The full catalogue — pick a product or let the AI narrow it down.'
    : term
      ? 'Matching products from across ShopNow, each with the full delivered price.'
      : 'Type a product title to begin.';

  return (
    <div className="animate-rise">
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Search results' }]} />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-[28px] font-black">{heading}</h2>
          <p className="mt-1 text-muted">{subtitle}</p>
        </div>
        <p className="text-[13px] text-muted">
          {results.length} product{results.length === 1 ? '' : 's'}
          {words.length ? ` for ${words.length} keyword${words.length === 1 ? '' : 's'}` : ''}
        </p>
      </div>

      <SearchBar
        initialValue={term}
        placeholder="Search again…"
        submitLabel="Search"
        variant="primary"
        extra={[{ label: 'Home', variant: 'secondary', icon: 'store', to: '/' }]}
      />

      {results.length > 0 ? (
        <>
          <ProductGrid products={results} />
          {results.length >= 3 ? (
            <p className="mt-5 rounded-2xl border border-dashed border-line bg-white px-4 py-3.5 text-center text-[13px] text-muted">
              {results.length} near-identical options is a lot to compare.{' '}
              <Link to="/preferences" className="font-extrabold text-flame underline underline-offset-2">
                Let the AI pick three for you
              </Link>
              .
            </p>
          ) : null}
        </>
      ) : (
        <div className="mt-5 rounded-[20px] border border-dashed border-line bg-white px-8 py-10 text-center text-muted">
          <img src="/images/states/empty-search.svg" alt="" className="mx-auto h-32 w-auto" />
          <h3 className="mt-3 text-xl font-black text-ink">No matching products</h3>
          <p className="mt-1">Every word in your search has to appear on the product, brand or category.</p>

          {suggestions.length ? (
            <div className="mt-4">
              <p className="text-[13px] font-bold text-ink">
                {suggestionsArePopular ? 'Popular searches right now' : 'Try one of these instead'}
              </p>
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                {suggestions.map((query) => (
                  <Link key={query} to={`/search?q=${encodeURIComponent(query)}`} className="btn btn-secondary">
                    <Icon name="search" className="h-4 w-4" />
                    {query}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}