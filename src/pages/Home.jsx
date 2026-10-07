import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiSidecard } from "../components/AiSidecard.jsx";
import { CategoryImage } from "../components/ProductImage.jsx";
import { ProductGrid } from "../components/ProductCard.jsx";
import { SearchBar } from "../components/SearchBar.jsx";
import { Icon } from "../components/icons.jsx";
import { categories } from "../data/categories.js";
import { featured } from "../data/catalog.js";
import { useShop } from "../store/ShopContext.jsx";

export default function Home() {
  const [focusedCategory, setFocusedCategory] = useState(categories[0]);
  const navigate = useNavigate();
  const { setQuery } = useShop();

  const openCategory = (category) => {
    setFocusedCategory(category);
    setQuery(category.query);
    navigate(`/search?q=${encodeURIComponent(category.query)}`);
  };

  return (
    <div className="animate-rise">
      <div className="grid items-stretch gap-5.5 ">
        <section className="rounded-3xl border border-line bg-white p-7 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
          <span className="pill">
            <Icon name="store" className="h-4 w-4" />
            ShopNow Marketplace
          </span>

          <h1 className="mt-3 text-4xl leading-[1.05] font-black sm:text-[42px]">
            What are you shopping for today?
          </h1>
          <p className="mt-3 max-w-162.5 leading-relaxed text-muted">
            Browse a category or search by product title. Every category holds
            several similar products, so you can feel the choice overload before
            letting the AI narrow the options down.
          </p>

          <SearchBar
            placeholder="Search products, e.g. wireless earbuds"
            submitLabel="Search products"
          />

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => {
              const isFocused = focusedCategory.slug === category.slug;
              return (
                <button
                  key={category.slug}
                  type="button"
                  onClick={() => openCategory(category)}
                  className={`cursor-pointer rounded-[18px] border p-4 text-center transition duration-150 hover:-translate-y-0.5 ${
                    isFocused
                      ? "border-flame bg-flame-tint"
                      : "border-line bg-white hover:border-[#c9d3dc]"
                  }`}
                >
                  <CategoryImage
                    src={`/images/categories/${category.shape}.svg`}
                    alt=""
                    className="mx-auto mb-2 h-14 w-14"
                  />
                  <span
                    className={`block text-[13px] font-extrabold ${isFocused ? "text-flame" : "text-navy"}`}
                  >
                    {category.name}
                  </span>
                  <span className="mt-0.5 block text-[11px] leading-tight text-muted">
                    {category.blurb}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <AiSidecard category={focusedCategory} />
      </div>

      <section className="mt-7">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="mb-1 text-[28px] font-black">
              Popular across ShopNow
            </h2>
            <p className="text-muted">
              A mixed marketplace view before you start searching.
            </p>
          </div>
          <Link to="/search?cat=all" className="btn btn-ghost">
            Browse everything
          </Link>
        </div>

        <ProductGrid
          products={featured}
          className="mt-4 grid grid-cols-2 gap-3.5 lg:grid-cols-4"
        />
      </section>
    </div>
  );
}
