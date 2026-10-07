import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "./icons.jsx";

export function AiFab({
  to = "/preferences",
  label = "Ask AI",
  hintTitle = "Need help choosing?",
}) {
  const [hintOpen, setHintOpen] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="pointer-events-none fixed right-10 bottom-10 z-50 flex flex-col items-end gap-3">
      {hintOpen ? (
        <div className="animate-rise pointer-events-auto relative max-w-60 rounded-[18px] border border-[#d7e3ec] bg-white px-3.5 py-3 text-sm leading-snug text-navy-deep shadow-[0_16px_38px_rgba(20,42,59,0.16)]">
          <b className="mb-1 block text-[15px]">{hintTitle}</b>
          Too many similar options? Let ShopNow AI narrow them into a few
          best-fit choices.
          <button
            type="button"
            onClick={() => setHintOpen(false)}
            aria-label="Dismiss hint"
            className="absolute -top-2.5 -left-2.5 grid h-6 w-6 cursor-pointer place-items-center rounded-full border border-line bg-white text-muted shadow-sm transition hover:text-ink"
          >
            <Icon name="close" className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => navigate(to)}
        aria-label="Ask the ShopNow AI assistant to help me choose"
        className="pointer-events-auto group relative grid h-17.5 w-17.5 cursor-pointer place-items-center rounded-full bg-[linear-gradient(145deg,#ff8a3d,#ff5a00)] shadow-[0_16px_34px_rgba(255,90,0,0.35)] transition duration-200 hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-[0_20px_40px_rgba(255,90,0,0.42)] sm:h-19.5 sm:w-19.5"
      >
        <span className="animate-ai-pulse absolute -inset-2.5 rounded-full border-2 border-[rgba(255,90,0,0.22)]" />
        <span className="animate-ai-pulse-late absolute -inset-2.5 rounded-full border-2 border-[rgba(255,90,0,0.22)]" />
        <img src="/images/ai/sparkle.svg" alt="" className="relative h-9 w-9" />
        <span className="absolute right-22 hidden rounded-full bg-navy-deep px-4 py-3 text-sm font-extrabold whitespace-nowrap text-white shadow-[0_14px_28px_rgba(20,42,59,0.18)] group-hover:block">
          {label}
        </span>
      </button>
    </div>
  );
}
