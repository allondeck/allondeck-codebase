import { supabase } from "./supabase";
import { parsePrice } from "./utils";
import type { CartItem } from "../types/cart";
import { isComboCartItem, isProductCartItem } from "../types/cart";
import type { OrderItemRow, Json } from "../types/database";

function isCartLine(item: CartItem | OrderItemInput): item is CartItem {
  return (
    typeof item === "object" &&
    item !== null &&
    "type" in item &&
    (item.type === "product" || item.type === "combo")
  );
}

export type OrderItemInput = {
  product_id?: string;
  id?: string;
  quantity: number;
  product_name?: string;
  name?: string;
  product_price?: number | string;
  price?: number | string;
  product?: { id: string; name: string; price: number | string };
};

export type InvoiceOrderItem = OrderItemInput;

export type ShippingAddressInput = {
  full_name?: string;
  name?: string;
  line1?: string;
  line2?: string;
  address?: string;
  city: string;
  state: string;
  postal_code?: string;
  zip?: string;
  country: string;
  phone?: string;
};

export type CreateOrderFromInvoiceInput = {
  items: OrderItemInput[];
  customerEmail?: string;
  guestEmail?: string;
  shippingAddress?: ShippingAddressInput;
  total?: number;
  subtotal?: number;
  customDiscountFixed?: number;
  customDiscountPercent?: number;
};

export async function createOrder(params: {
  userId?: string | null;
  customerEmail: string;
  guestEmail?: string;
  /** Cart lines from checkout, or flat invoice-style rows */
  items: (CartItem | OrderItemInput)[];
  total: number;
  subtotal: number;
  shippingTotal?: number;
  taxTotal?: number;
  discountAmount?: number;
  couponId?: string | null;
  shippingAddress: ShippingAddressInput;
  billingAddress: ShippingAddressInput;
}) {
  const {
    userId,
    customerEmail,
    guestEmail,
    items,
    total,
    subtotal,
    shippingTotal = 0,
    taxTotal = 0,
    discountAmount = 0,
    couponId,
    shippingAddress,
    billingAddress,
  } = params;

  const email = customerEmail || guestEmail || "";

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: userId || null,
      guest_email: userId ? null : email,
      customer_email: email,
      shipping_address: shippingAddress as unknown as Json,
      billing_address: billingAddress as unknown as Json,
      status: "pending",
      total,
      subtotal,
      shipping_total: shippingTotal,
      tax_total: taxTotal,
      discount_amount: discountAmount || 0,
      coupon_id: couponId || null,
    })
    .select("id")
    .single();

  if (orderError) throw orderError;
  const orderId = order.id;

  // Update coupon usage if used
  if (couponId) {
    const { data: coupon } = await supabase
      .from("coupons")
      .select("usage_count")
      .eq("id", couponId)
      .single();

    if (coupon && typeof coupon.usage_count === "number") {
      await supabase
        .from("coupons")
        .update({
          usage_count: coupon.usage_count + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", couponId);
    }
  }

  // Create order items (expand cart product/combo lines; support invoice-style rows)
  const orderItems: Partial<OrderItemRow>[] = [];
  for (const item of items) {
    if (isCartLine(item)) {
      if (isProductCartItem(item)) {
        const p = item.product;
        const price = item.variant_price != null ? item.variant_price : parsePrice(p.price);
        orderItems.push({
          order_id: orderId,
          product_id: p.id,
          product_name: p.name,
          product_price: price,
          quantity: item.quantity,
          variant_id: item.variant_id || null,
          variant_name: item.variant_name || null,
        });
      } else if (isComboCartItem(item)) {
        const totalUnitQty = item.items.reduce((s, e) => s + e.quantity, 0);
        const unitPrice =
          totalUnitQty > 0 ? item.totalPrice / totalUnitQty : 0;
        const roundedUnit = Math.round(unitPrice * 100) / 100;
        for (const entry of item.items) {
          orderItems.push({
            order_id: orderId,
            product_id: entry.product_id,
            product_name: entry.product_name,
            product_price: roundedUnit,
            quantity: entry.quantity * item.quantity,
            deal_id: item.dealId,
          });
        }
      }
      continue;
    }
    const it = item as OrderItemInput;
    const pId = it.product_id || it.id || it.product?.id;
    const pName =
      it.product_name || it.name || it.product?.name || "Product";
    const raw =
      it.product_price ?? it.price ?? it.product?.price ?? 0;
    orderItems.push({
      order_id: orderId,
      product_id: pId ?? null,
      product_name: pName,
      product_price: parsePrice(raw),
      quantity: it.quantity,
    });
  }

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) throw itemsError;

  return order;
}

export async function createOrderFromInvoice(
  params: CreateOrderFromInvoiceInput,
) {
  const {
    guestEmail,
    customerEmail,
    items,
    total,
    subtotal,
    shippingAddress,
    customDiscountFixed,
    customDiscountPercent,
  } = params;

  const email = guestEmail || customerEmail || "";
  const subFromItems = items.reduce(
    (sum, i) =>
      sum +
      Number(
        i.price ?? i.product_price ?? i.product?.price ?? 0,
      ) * i.quantity,
    0,
  );
  const sub =
    subtotal != null && subtotal > 0 ? subtotal : subFromItems;

  let discountAmount = 0;
  if (customDiscountFixed != null && customDiscountFixed > 0) {
    discountAmount = Math.min(customDiscountFixed, sub);
  } else if (
    customDiscountPercent != null &&
    customDiscountPercent > 0
  ) {
    const pct = Math.min(100, Math.max(0, customDiscountPercent));
    discountAmount = Math.round(sub * (pct / 100) * 100) / 100;
  }
  discountAmount = Math.round(discountAmount * 100) / 100;
  const finalSubtotal = sub;
  const finalTotal =
    total != null ? Math.max(0, total) : Math.max(0, sub - discountAmount);

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: null,
      guest_email: email,
      customer_email: email,
      shipping_address: (shippingAddress || {}) as unknown as Json,
      billing_address: (shippingAddress || {}) as unknown as Json,
      status: "pending",
      total: finalTotal,
      subtotal: finalSubtotal,
      shipping_total: 0,
      tax_total: 0,
      discount_amount: discountAmount,
      coupon_id: null,
    })
    .select("id")
    .single();

  if (orderError) throw orderError;
  const orderId = order.id;

  const orderItems: Partial<OrderItemRow>[] = items.map(
    (item: OrderItemInput) => {
      const pId = item.id || item.product_id || item.product?.id;
      const pName =
        item.name || item.product_name || item.product?.name || "Product";
      const pPrice =
        item.price || item.product_price || item.product?.price || 0;
      return {
        order_id: orderId,
        product_id: pId,
        product_name: pName,
        product_price: pPrice,
        quantity: item.quantity,
      };
    },
  );

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) throw itemsError;

  return order.id;
}
