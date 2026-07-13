import type { ProductRow } from "./database";

export type ComboCartItemEntry = {
  product_id: string;
  product_name: string;
  quantity: number;
};

export type ProductCartItem = {
  type: "product";
  product: ProductRow;
  quantity: number;
};

export type ComboCartItem = {
  type: "combo";
  dealId: string;
  dealName: string;
  totalPrice: number;
  quantity: number;
  items: ComboCartItemEntry[];
};

export type CartItem = ProductCartItem | ComboCartItem;

export function isProductCartItem(i: CartItem): i is ProductCartItem {
  return i.type === "product";
}

export function isComboCartItem(i: CartItem): i is ComboCartItem {
  return i.type === "combo";
}

/** Unique key for a cart line (for remove/update). Products: product.id, Combos: 'combo-' + dealId */
export function getCartLineKey(item: CartItem): string {
  return item.type === "product" ? item.product.id : `combo-${item.dealId}`;
}
