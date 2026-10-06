import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Header } from './components/Header.jsx';
import Cart from './pages/Cart.jsx';
import Choice from './pages/Choice.jsx';
import Home from './pages/Home.jsx';
import NotFound from './pages/NotFound.jsx';
import OrderSuccess from './pages/OrderSuccess.jsx';
import Preferences from './pages/Preferences.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import SearchResults from './pages/SearchResults.jsx';
import Shortlist from './pages/Shortlist.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}

const FLOW_NOTE =
  'Prototype flow: marketplace home → search → products with the full delivered price → product details → add to cart → cart review → checkout → success receipt. When the shopper is unsure they can ask the AI → preferences → three-product shortlist → add to cart.';

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Header />

      <main className="mx-auto w-full max-w-[1100px] flex-1 px-5 py-7 pb-15">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="/preferences" element={<Preferences />} />
          <Route path="/shortlist" element={<Shortlist />} />
          <Route path="/choice" element={<Choice />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<OrderSuccess />} />
          <Route path="/order/:orderId" element={<OrderSuccess />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        <p className="mt-7 text-center text-xs text-muted">{FLOW_NOTE}</p>
      </main>
    </div>
  );
}