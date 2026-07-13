import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ProductRow } from "../types/database";

import type {
  CartItem,
  ComboCartItem,
  ComboCartItemEntry,
  ProductCartItem,
} from "../types/cart";
import { getCartLineKey } from "../types/cart";

const CART_STORAGE_KEY = "ecommerce-cart";

function loadCartFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((i): i is CartItem => {
      if (i && typeof i === "object" && "type" in i) {
        if ((i as CartItem).type === "combo") {
          const c = i as ComboCartItem;
          return (
            typeof c.dealId === "string" &&
            typeof c.dealName === "string" &&
            typeof c.totalPrice === "number" &&
            Array.isArray(c.items)
          );
        }
        if ((i as CartItem).type === "product") {
          const p = i as ProductCartItem;
          return p.product != null && typeof p.product.id === "string";
        }
      }
      return false;
    }) as CartItem[];
  } catch {
    return [];
  }
}

function saveCartToStorage(items: CartItem[]) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  addItem: (product: ProductRow, quantity?: number) => void;
  addCombo: (
    deal: {
      dealId: string;
      dealName: string;
      totalPrice: number;
      items: ComboCartItemEntry[];
    },
    quantity?: number,
  ) => void;
  removeItem: (lineKey: string) => void;
  updateQuantity: (lineKey: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCartFromStorage);

  useEffect(() => {
    saveCartToStorage(items);
  }, [items]);

  const addItem = useCallback((product: ProductRow, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.type === "product" && i.product.id === product.id,
      );
      if (existing && existing.type === "product") {
        return prev.map((i) =>
          i.type === "product" && i.product.id === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        );
      }
      return [...prev, { type: "product" as const, product, quantity }];
    });
  }, []);

  const addCombo = useCallback(
    (
      deal: {
        dealId: string;
        dealName: string;
        totalPrice: number;
        items: ComboCartItemEntry[];
      },
      quantity = 1,
    ) => {
      setItems((prev) => {
        const existing = prev.find(
          (i) => i.type === "combo" && i.dealId === deal.dealId,
        );
        if (existing && existing.type === "combo") {
          return prev.map((i) =>
            i.type === "combo" && i.dealId === deal.dealId
              ? { ...i, quantity: i.quantity + quantity }
              : i,
          );
        }
        return [
          ...prev,
          {
            type: "combo" as const,
            dealId: deal.dealId,
            dealName: deal.dealName,
            totalPrice: deal.totalPrice,
            quantity,
            items: deal.items,
          },
        ];
      });
    },
    [],
  );

  const removeItem = useCallback((lineKey: string) => {
    setItems((prev) => prev.filter((i) => getCartLineKey(i) !== lineKey));
  }, []);

  const updateQuantity = useCallback((lineKey: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => getCartLineKey(i) !== lineKey));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (getCartLineKey(i) === lineKey ? { ...i, quantity } : i)),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      itemCount,
      addItem,
      addCombo,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [
      items,
      itemCount,
      addItem,
      addCombo,
      removeItem,
      updateQuantity,
      clearCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
