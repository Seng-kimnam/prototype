import { Link } from 'react-router-dom';
import { Icon } from './icons.jsx';
import { useShop } from '../store/ShopContext.jsx';

const QUICK_POINTS = [
  { icon: 'wallet', text: 'Keep the final delivered price inside budget' },
  { icon: 'star', text: 'Prioritise rating and review quality' },
  { icon: 'truck', text: 'Balance delivery speed against total cost' },
];

const MINI_ACTIONS = [
  { icon: 'package', text: 'Compare similar products' },
  { icon: 'coins', text: 'Show the final price' },
  { icon: 'bolt', text: 'Find the fastest delivery' },
];

export function AiSidecard({ category }) {
  const { setQuery } = useShop();
  const target = `/search?q=${encodeURIComponent(category.query)}`;

  const startWithAi = () => setQuery(category.query);

  return (
    <aside className="relative flex flex-col justify-between overflow-hidden rounded-[28px] border border-[#dbe6ef] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)] p-5.5 shadow-[0_14px_34px_rgba(24,38,52,0.08)]">
      <span className="pointer-events-none absolute -top-10 -right-10 h-[140px] w-[140px] rounded-full bg-[radial-gradient(circle,#ffefe6_0%,rgba(255,239,230,0)_70%)]" />
      <span className="pointer-events-none absolute -bottom-7.5 -left-7.5 h-[120px] w-[120px] rounded-full bg-[radial-gradient(circle,#e8f4ff_0%,rgba(232,244,255,0)_70%)]" />

      <div className="relative z-1">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#eef4ff] px-3 py-2 text-xs font-extrabold text-navy">
          <img src="/images/ai/sparkle-dark.svg" alt="" className="h-3.5 w-3.5" />
          ShopNow AI assistant
        </span>

        <img
          src="/images/ai/assistant.svg"
          alt="ShopNow AI assistant"
          className="my-3.5 h-[86px] w-[86px] rounded-[26px] object-cover shadow-[0_16px_28px_rgba(49,87,117,0.22)]"
        />

        <h3 className="text-[26px] leading-tight font-black text-[#12202d]">Not sure what to choose?</h3>
        <p className="mt-1.5 text-sm text-[#5f7283]">
          Tell the AI what matters to you and it will turn an overwhelming list of similar products into three clear
          best-fit options.
        </p>

        <div className="my-4 grid gap-2.5">
          {QUICK_POINTS.map((point) => (
            <div
              key={point.text}
              className="flex items-center gap-2.5 rounded-2xl border border-[#e3ebf2] bg-white px-3.5 py-3 text-[13px] font-bold text-[#213142]"
            >
              <span className="inline-flex h-8 w-8 flex-none items-center justify-center rounded-xl bg-[#fff5ef] text-flame">
                <Icon name={point.icon} className="h-4.5 w-4.5" />
              </span>
              {point.text}
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-1">
        <div className="rounded-[22px] bg-navy-deep p-4 text-white">
          <p className="rounded-2xl border border-white/10 bg-white/10 px-3 py-2.5 text-[13px] leading-relaxed">
            Hi! I can compare similar products and explain why each option fits you — including the full delivered price.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {MINI_ACTIONS.map((action) => (
              <span
                key={action.text}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/12 px-2.5 py-2 text-xs font-bold"
              >
                <Icon name={action.icon} className="h-3.5 w-3.5" />
                {action.text}
              </span>
            ))}
          </div>
          <Link to={target} onClick={startWithAi} className="btn btn-primary mt-3.5 w-full rounded-[18px] py-3.5">
            <Icon name="sparkles" className="h-4.5 w-4.5" />
            Try AI with {category.query}
          </Link>
        </div>
      </div>
    </aside>
  );
}