import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Breadcrumb } from '../components/Breadcrumb.jsx';
import { CategoryImage } from '../components/ProductImage.jsx';
import { TestNote } from '../components/TestNote.jsx';
import { Icon } from '../components/icons.jsx';
import { categories, categoryByQuery, preferencesFor } from '../data/categories.js';
import { productsForQuery } from '../data/catalog.js';
import { useShop } from '../store/ShopContext.jsx';

const resolveCategory = (query, storedCategory) =>
  storedCategory ?? categoryByQuery.get(String(query ?? '').trim().toLowerCase()) ?? categories[0];

export default function Preferences() {
  const navigate = useNavigate();
  const { query, preferenceCategory, preferences, savePreferences, generateShortlist } = useShop();

  const category = useMemo(() => resolveCategory(query, preferenceCategory), [query, preferenceCategory]);
  const options = useMemo(() => preferencesFor(category), [category]);
  const [activeIds, setActiveIds] = useState(() => {
    const storedMatches = preferenceCategory?.slug === category.slug ? preferences : [];
    const base = storedMatches.length ? storedMatches : options.filter((option) => option.defaultOn);
    return base.map((option) => option.id);
  });

  const candidateCount = productsForQuery(category.query).length;

  const toggle = (id) => {
    setActiveIds((current) => (current.includes(id) ? current.filter((value) => value !== id) : [...current, id]));
  };

  const submit = () => {
    const preferences = savePreferences(category.slug, activeIds);
    generateShortlist(category.slug, preferences);
    navigate('/shortlist');
  };

  return (
    <div className="animate-rise">
      <Breadcrumb
        items={[{ label: 'Home', to: '/' }, { label: 'Search results' }, { label: 'Preferences' }]}
      />

      <h2 className="text-[28px] font-black">What matters most to you?</h2>
      <p className="mt-1 max-w-[650px] text-muted">
        Choose your priorities for <b className="text-ink">{category.query}</b>. The AI scores all {candidateCount}{' '}
        matching products against them and keeps only three.
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {categories.map((entry) => (
          <Link
            key={entry.slug}
            to={`/search?q=${encodeURIComponent(entry.query)}`}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-extrabold transition ${
              entry.slug === category.slug
                ? 'border-flame bg-flame-tint text-flame'
                : 'border-line bg-white text-navy hover:border-[#c9d3dc]'
            }`}
          >
            <CategoryImage src={`/images/categories/${entry.shape}.svg`} alt="" className="h-5 w-5" />
            {entry.name}
          </Link>
        ))}
      </div>

      <div className="card mt-5 p-6">
        <div className="grid gap-3 sm:grid-cols-2">
          {options.map((option) => {
            const isActive = activeIds.includes(option.id);
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => toggle(option.id)}
                aria-pressed={isActive}
                className={`cursor-pointer rounded-2xl border-2 p-4 text-left transition duration-150 ${
                  isActive ? 'border-flame bg-flame-tint' : 'border-line bg-white hover:border-[#c9d3dc]'
                }`}
              >
                <span className="flex items-center justify-between gap-2">
                  <strong className="flex items-center gap-2 text-[15px] text-ink">
                    <span
                      className={`grid h-8 w-8 place-items-center rounded-xl ${
                        isActive ? 'bg-flame text-white' : 'bg-[#eef3f7] text-navy'
                      }`}
                    >
                      <Icon name={option.icon} className="h-4.5 w-4.5" />
                    </span>
                    {option.label}
                  </strong>
                  <span
                    className={`grid h-6 w-6 place-items-center rounded-full border transition ${
                      isActive ? 'border-flame bg-flame text-white' : 'border-[#cbd4dc] text-transparent'
                    }`}
                  >
                    <Icon name="check" className="h-3.5 w-3.5" />
                  </span>
                </span>
                <span className="mt-1.5 block text-xs text-muted">{option.hint}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-end gap-2.5">
          <Link to={query ? `/search?q=${encodeURIComponent(query)}` : '/'} className="btn btn-secondary">
            <Icon name="arrow-left" className="h-4.5 w-4.5" />
            Back
          </Link>
          <button type="button" onClick={submit} disabled={!activeIds.length} className="btn btn-primary">
            Find my best matches
            <Icon name="arrow-right" className="h-4.5 w-4.5" />
          </button>
        </div>

        {activeIds.length === 0 ? (
          <p className="mt-3 text-right text-xs font-bold text-flame">Pick at least one priority to continue.</p>
        ) : null}
      </div>

      <TestNote title="Test note:">
        Do not explain which options the tester should choose. Observe whether this preference step is understandable
        without help.
      </TestNote>
    </div>
  );
}