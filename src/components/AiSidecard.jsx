import { Link } from "react-router-dom";
import { Icon } from "./icons.jsx";
import { useShop } from "../store/ShopContext.jsx";

const QUICK_POINTS = [
  { icon: "wallet", text: "Keep the final delivered price inside budget" },
  { icon: "star", text: "Prioritise rating and review quality" },
  { icon: "truck", text: "Balance delivery speed against total cost" },
];

const MINI_ACTIONS = [
  { icon: "package", text: "Compare similar products" },
  { icon: "coins", text: "Show the final price" },
  { icon: "bolt", text: "Find the fastest delivery" },
];

export function AiSidecard({ category }) {
  const { setQuery } = useShop();
  const target = `/search?q=${encodeURIComponent(category.query)}`;

  const startWithAi = () => setQuery(category.query);

  return <></>;
}
