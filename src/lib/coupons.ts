import { supabase } from "./supabase";
import { parsePrice } from "./utils";
import type { CouponRow } from "../types/database";
import type { CartItem } from "../types/cart";
import { isProductCartItem } from "../types/cart";

function nowInRange(startsAt: string | null, endsAt: string | null): boolean {
  const now = Date.now();
  if (startsAt && new Date(startsAt).getTime() > now) return false;
  if (endsAt && new Date(endsAt).getTime() < now) return false;
  return true;
}

export type ApplyCouponResult =
  | { ok: true; coupon: CouponRow; discountAmount: number }
  | { ok: false; error: string };

export async function applyCoupon(
  code: string,
  items: CartItem[],
): Promise<ApplyCouponResult> {
  const trimmed = code.trim().toUpperCase();
  if (!trimmed) return { ok: false, error: "Enter a coupon code." };

  const { data: couponRow, error: fetchError } = await supabase
    .from("coupons")
    .select("*")
    .ilike("code", trimmed)
    .maybeSingle();

  if (fetchError) return { ok: false, error: "Could not validate coupon." };
  if (!couponRow) return { ok: false, error: "Invalid or expired coupon." };

  const row = couponRow as CouponRow;
  const coupon: CouponRow = {
    ...row,
    scope_ids: Array.isArray(row.scope_ids) ? row.scope_ids : [],
  };

  if (!nowInRange(coupon.starts_at, coupon.ends_at)) {
    return { ok: false, error: "This coupon is not valid right now." };
  }
  if (coupon.usage_limit != null && coupon.usage_count >= coupon.usage_limit) {
    return { ok: false, error: "This coupon has reached its usage limit." };
  }
  const productItems = items.filter(isProductCartItem);
  if (productItems.length === 0 && items.length > 0) {
    return {
      ok: false,
      error: "Coupons apply only to regular product items, not combos.",
    };
  }
  if (items.length === 0) {
    return { ok: false, error: "Your cart is empty." };
  }

  let applicableSubtotal = 0;

  if (coupon.scope === "all") {
    applicableSubtotal = productItems.reduce(
      (sum, i) => sum + parsePrice(i.product.price) * i.quantity,
      0,
    );
  } else if (coupon.scope === "featured") {
    applicableSubtotal = productItems.reduce(
      (sum, i) =>
        i.product.is_featured
          ? sum + parsePrice(i.product.price) * i.quantity
          : sum,
      0,
    );
  } else if (coupon.scope === "products") {
    const productIds = new Set(coupon.scope_ids);
    applicableSubtotal = productItems.reduce(
      (sum, i) =>
        productIds.has(i.product.id)
          ? sum + parsePrice(i.product.price) * i.quantity
          : sum,
      0,
    );
  } else if (coupon.scope === "categories") {
    const productIds = productItems.map((i) => i.product.id);
    const { data: pcRows } = await supabase
      .from("product_categories")
      .select("product_id, category_id")
      .in("product_id", productIds)
      .in("category_id", coupon.scope_ids);

    const productCategoryIds = new Set<string>();
    for (const r of pcRows ?? []) {
      const row = r as { product_id: string; category_id: string };
      if (coupon.scope_ids.includes(row.category_id)) {
        productCategoryIds.add(row.product_id);
      }
    }
    applicableSubtotal = productItems.reduce(
      (sum, i) =>
        productCategoryIds.has(i.product.id)
          ? sum + parsePrice(i.product.price) * i.quantity
          : sum,
      0,
    );
  }

  if (applicableSubtotal <= 0) {
    return {
      ok: false,
      error: "No items in your cart qualify for this coupon.",
    };
  }

  let discountAmount: number;
  if (coupon.discount_type === "percent") {
    discountAmount =
      Math.round(
        ((applicableSubtotal * Number(coupon.discount_value)) / 100) * 100,
      ) / 100;
  } else {
    discountAmount = Math.min(
      Number(coupon.discount_value),
      applicableSubtotal,
    );
  }
  discountAmount = Math.round(discountAmount * 100) / 100;

  return { ok: true, coupon, discountAmount };
}
