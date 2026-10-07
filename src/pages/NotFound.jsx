import { Link } from 'react-router-dom';
import { Breadcrumb } from '../components/Breadcrumb.jsx';
import { Icon } from '../components/icons.jsx';

export default function NotFound() {
  return (
    <div className="animate-rise mx-auto max-w-155 py-10 text-center">
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Not found' }]} />

      <img src="/images/states/empty-search.svg" alt="" className="mx-auto h-40 w-auto" />
      <h1 className="mt-4 text-3xl font-black">We could not find that page</h1>
      <p className="mt-2 leading-relaxed text-muted">
        The link may be out of date. Start again from the marketplace home page and pick a category.
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-2.5">
        <Link to="/" className="btn btn-primary">
          <Icon name="store" className="h-4.5 w-4.5" />
          Back to home
        </Link>
        <Link to="/search?cat=all" className="btn btn-secondary">
          Browse everything
        </Link>
      </div>
    </div>
  );
}