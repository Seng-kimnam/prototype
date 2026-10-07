import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb } from '../components/Breadcrumb.jsx';
import { TestNote } from '../components/TestNote.jsx';
import { Icon } from '../components/icons.jsx';
import { interpretPrompt } from '../lib/aiPrompt.js';
import { useShop } from '../store/ShopContext.jsx';

const EXAMPLES = [
  'Wireless earbuds under $30 with long battery life and fast delivery',
  'Comfortable running sneakers with great reviews',
  'Gentle skincare for sensitive skin on a budget',
  'A bright desk lamp for working late',
];

export default function Preferences() {
  const navigate = useNavigate();
  const { query, aiPrompt, runAiPrompt } = useShop();

  const [value, setValue] = useState(() => aiPrompt || (query ? `I'm looking for ${query}` : ''));
  const [error, setError] = useState('');

  const preview = useMemo(() => interpretPrompt(value), [value]);

  const submit = (event) => {
    event?.preventDefault();
    const result = runAiPrompt(value);
    if (!result.ok) {
      setError('Tell the AI what you are shopping for — for example "wireless earbuds under $30".');
      return;
    }
    navigate('/shortlist');
  };

  return (
    <div className="animate-rise">
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Ask AI' }]} />

      <div className="flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[linear-gradient(145deg,#ff8a3d,#ff5a00)] shadow-[0_10px_24px_rgba(255,90,0,0.28)]">
          <img src="/images/ai/sparkle.svg" alt="" className="h-6 w-6" />
        </span>
        <div>
          <h2 className="text-[28px] leading-tight font-black">Ask ShopNow AI</h2>
          <p className="text-sm text-muted">Describe what you need and the AI narrows the marketplace to three matches.</p>
        </div>
      </div>

      <form onSubmit={submit} className="card mt-5 p-6">
        <label htmlFor="ai-prompt" className="text-sm font-extrabold text-ink">
          What are you looking for?
        </label>
        <textarea
          id="ai-prompt"
          value={value}
          autoFocus
          onChange={(event) => {
            setValue(event.target.value);
            setError('');
          }}
          rows={3}
          placeholder="e.g. wireless earbuds under $30 with long battery life and fast delivery"
          className="mt-2 w-full resize-none rounded-2xl border border-line bg-white px-4 py-3.5 text-base text-ink outline-none transition focus:border-flame focus:shadow-[0_0_0_3px_rgba(255,90,0,0.08)]"
        />

        <div className="mt-3 flex flex-wrap gap-2">
          {EXAMPLES.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => {
                setValue(example);
                setError('');
              }}
              className="cursor-pointer rounded-full border border-line bg-white px-3 py-1.5 text-xs font-bold text-navy transition hover:border-[#c9d3dc]"
            >
              {example}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-end gap-2.5">
          <button type="button" onClick={() => setValue('')} className="btn btn-secondary">
            Clear
          </button>
          <button type="submit" disabled={!value.trim()} className="btn btn-primary">
            <img src="/images/ai/sparkle.svg" alt="" className="h-4.5 w-4.5" />
            Recommend products
          </button>
        </div>

        {error ? <p className="mt-3 text-right text-xs font-bold text-flame">{error}</p> : null}
      </form>

      <div className="mt-5 rounded-[20px] border border-line bg-white p-5.5">
        <p className="flex items-center gap-2 text-sm font-extrabold text-ink">
          <Icon name="sparkles" className="h-4.5 w-4.5 text-flame" />
          What the AI understood
        </p>

        {preview.ok ? (
          <>
            <p className="mt-1 text-sm text-muted">
              I'll score every <b className="text-ink">{preview.category.query}</b> listing against these needs and keep the three
              strongest matches.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {preview.understood.map((item) => (
                <span key={item.label} className="pill bg-flame-tint text-flame">
                  <Icon name={item.icon} className="h-4 w-4" />
                  {item.label}
                </span>
              ))}
            </div>
          </>
        ) : (
          <p className="mt-1 text-sm text-muted">
            Mention a product type and any needs (budget, reviews, features, delivery) and they will show up here before you
            send the request.
          </p>
        )}
      </div>

      <TestNote title="Test note:">
        Watch how the tester phrases the request. Does the "What the AI understood" panel make the recommendation feel
        transparent without being told which words to use?
      </TestNote>
    </div>
  );
}
