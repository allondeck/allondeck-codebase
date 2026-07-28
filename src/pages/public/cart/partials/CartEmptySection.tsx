import { Link } from "react-router-dom";

export function CartEmptySection() {
  return (
    <div className="rounded-xl border border-brand-medium/35 bg-brand-dark-alt p-12 text-center">
      <h2 className="text-xl font-semibold text-white">
        Your cart is empty
      </h2>
      <p className="mt-2 text-brand-light">Add some products to get started.</p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/products"
          className="inline-block rounded-lg bg-brand-orange px-6 py-3 font-medium text-white hover:bg-orange-600 transition-all duration-200 hover:scale-105 active:scale-95"
        >
          Browse Products
        </Link>
        <Link
          to="/wishlist"
          className="inline-block rounded-lg border border-brand-medium/50 bg-brand-dark-alt px-6 py-3 font-medium text-brand-cream hover:bg-brand-medium/30 transition-all duration-200 hover:scale-105 active:scale-95"
        >
          View Wishlist
        </Link>
      </div>
    </div>
  );
}
