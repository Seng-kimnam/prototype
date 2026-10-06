export function TestNote({ title, children, className = '' }) {
  return (
    <div className={`mt-5 rounded-[10px] border-l-4 border-flame bg-[#fff6ef] px-3.5 py-3 text-[13px] leading-relaxed text-[#5d4b3f] ${className}`}>
      {title ? <b>{title}</b> : null} {children}
    </div>
  );
}