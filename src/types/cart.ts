import type { ProductRow } from "./database";

export type ComboCartItemEntry = {
  product_id: string;
  product_name: string;
  quantity: number;
};

export type ProductCartItem = {
  type: "product";
  product: ProductRow;
  variant_id?: string | null;
  variant_name?: string | null;
  variant_price?: number | null;
  variant_image_url?: string | null;
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

/** Unique key for a cart line (for remove/update). Products: product.id + variant, Combos: 'combo-' + dealId */
export function getCartLineKey(item: CartItem): string {
  if (item.type === "product") {
    return item.variant_id ? `${item.product.id}-${item.variant_id}` : item.product.id;
  }
  return `combo-${item.dealId}`;
}
