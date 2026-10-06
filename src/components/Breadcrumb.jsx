import { Link } from 'react-router-dom';
import { Icon } from './icons.jsx';

export function Breadcrumb({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-2.5 flex flex-wrap items-center gap-1 text-xs text-muted">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={item.label} className="flex items-center gap-1">
            {item.to && !isLast ? (
              <Link to={item.to} className="font-semibold transition hover:text-flame">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'font-bold text-navy' : ''}>{item.label}</span>
            )}
            {!isLast ? <Icon name="chevron-right" className="h-3.5 w-3.5 text-[#cbd4dc]" /> : null}
          </span>
        );
      })}
    </nav>
  );
}