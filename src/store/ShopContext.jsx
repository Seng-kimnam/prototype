import { createContext, useCallback, useContext, useMemo, useReducer } from 'react';
import { categoryBySlug, preferencesFor } from '../data/categories.js';
import { productsForQuery } from '../data/catalog.js';
import { cartTotals } from '../lib/pricing.js';
import { buildShortlist } from '../lib/shortlist.js';

const ShopContext = createContext(null);

const initialState = {
  query: '',
  cart: [],
  activeProductId: null,
  preferenceCategory: null,
  preferences: [],
  shortlist: [],
  chosen: null,
  order: null,
};

const addLine = (cart, product, meta) => {
  const existing = cart.find((line) => line.product.id === product.id);
  if (existing) {
    return cart.map((line) =>
      line.product.id === product.id
        ? { ...line, qty: line.qty + 1, aiReason: meta?.aiReason ?? line.aiReason, badge: meta?.badge ?? line.badge }
        : line,
    );
  }
  return [...cart, { product, qty: 1, aiReason: meta?.aiReason ?? null, badge: meta?.badge ?? null }];
};

function reducer(state, action) {
  switch (action.type) {
    case 'query':
      return state.query === action.term ? state : { ...state, query: action.term };
    case 'cart/add':
      return { ...state, cart: addLine(state.cart, action.product, action.meta) };
    case 'cart/qty':
      return {
        ...state,
        cart: state.cart
          .map((line) => (line.product.id === action.id ? { ...line, qty: Math.max(1, line.qty + action.delta) } : line))
          .filter((line) => line.qty > 0),
      };
    case 'cart/remove':
      return state.cart.some((line) => line.product.id === action.id)
        ? { ...state, cart: state.cart.filter((line) => line.product.id !== action.id) }
        : state;
    case 'cart/clear':
      return state.cart.length || state.order ? { ...state, cart: [], order: null } : state;
    case 'product/active':
      return state.activeProductId === action.id ? state : { ...state, activeProductId: action.id };
    case 'preferences/set':
      return { ...state, preferenceCategory: action.category, preferences: action.preferences, shortlist: [] };
    case 'shortlist/set':
      return { ...state, shortlist: action.picks };
    case 'chosen/set':
      return { ...state, chosen: action.chosen };
    case 'order/place':
      return { ...state, order: action.order, cart: [] };
    case 'reset':
      return { ...initialState };
    default:
      return state;
  }
}

const newOrderId = () => `SN-${1000 + Math.floor(Math.random() * 9000)}`;

export function ShopProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const addToCart = useCallback((product, meta) => dispatch({ type: 'cart/add', product, meta }), []);

  const placeOrder = useCallback(() => {
    if (!state.cart.length) return null;
    const summary = cartTotals(state.cart);
    const order = { id: newOrderId(), ...summary, lines: state.cart, placedAt: new Date().toISOString() };
    dispatch({ type: 'order/place', order });
    return order;
  }, [state.cart]);

  const savePreferences = useCallback((categorySlug, activeIds) => {
    const category = categoryBySlug[categorySlug];
    if (!category) return null;
    const active = preferencesFor(category).filter((preference) => activeIds.includes(preference.id));
    dispatch({ type: 'preferences/set', category, preferences: active });
    return active;
  }, []);

  const generateShortlist = useCallback(
    (categorySlug, activePreferences) => {
      const category = categoryBySlug[categorySlug];
      if (!category) return [];
      const preferences = activePreferences?.length ? activePreferences : state.preferences;
      const picks = buildShortlist({
        products: productsForQuery(category.query),
        preferences,
        category,
      });
      dispatch({ type: 'shortlist/set', picks });
      return picks;
    },
    [state.preferences],
  );

  const setQuery = useCallback((term) => dispatch({ type: 'query', term }), []);
  const setActiveProduct = useCallback((id) => dispatch({ type: 'product/active', id }), []);
  const changeQty = useCallback((id, delta) => dispatch({ type: 'cart/qty', id, delta }), []);
  const removeFromCart = useCallback((id) => dispatch({ type: 'cart/remove', id }), []);
  const clearCart = useCallback(() => dispatch({ type: 'cart/clear' }), []);
  const confirmChoice = useCallback(
    (pick) =>
      dispatch({
        type: 'chosen/set',
        chosen: pick ? { product: pick.product, badge: pick.badge, badgeMeta: pick.badgeMeta, why: pick.why } : null,
      }),
    [],
  );
  const startNewOrder = useCallback(() => dispatch({ type: 'reset' }), []);

  const value = useMemo(
    () => ({
      ...state,
      cartTotals: cartTotals(state.cart),
      setQuery,
      setActiveProduct,
      addToCart,
      changeQty,
      removeFromCart,
      clearCart,
      savePreferences,
      generateShortlist,
      confirmChoice,
      placeOrder,
      startNewOrder,
      resetAll: startNewOrder,
    }),
    [
      state,
      setQuery,
      setActiveProduct,
      addToCart,
      changeQty,
      removeFromCart,
      clearCart,
      savePreferences,
      generateShortlist,
      confirmChoice,
      placeOrder,
      startNewOrder,
    ],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used inside <ShopProvider>');
  return context;
}