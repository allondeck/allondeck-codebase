import { useCart } from "../../../context/CartContext";
import { isProductCartItem, isComboCartItem } from "../../../types/cart";
import { parsePrice } from "../../../lib/utils";
import { SEO } from "../../../components/ui/SEO";
import { CartEmptySection } from "./partials/CartEmptySection";
import { CartItemListSection } from "./partials/CartItemListSection";
import { CartSummarySection } from "./partials/CartSummarySection";

export default function Cart() {
  const { items, itemCount, updateQuantity, removeItem } = useCart();

  const subtotal = items.reduce((sum, i) => {
    if (isProductCartItem(i)) {
      const price =
        i.variant_price != null
          ? Number(i.variant_price)
          : parsePrice(i.product.price);
      return sum + price * i.quantity;
    }
    if (isComboCartItem(i)) return sum + i.totalPrice * i.quantity;
    return sum;
  }, 0);

  return (
    <div className="mx-auto max-w-content px-6 lg:px-12 py-8 sm:px-6 w-full">
      <SEO
        title="Shopping Cart | All On Deck"
        description="Review your selected marine deck items and proceed to checkout."
      />
      {itemCount === 0 ? (
        <CartEmptySection />
      ) : (
        <div className="flex flex-col gap-8 lg:flex-row">
          <CartItemListSection
            items={items}
            updateQuantity={updateQuantity}
            removeItem={removeItem}
          />
          <CartSummarySection itemCount={itemCount} subtotal={subtotal} />
        </div>
      )}
    </div>
  );
}
