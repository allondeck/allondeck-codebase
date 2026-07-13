import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { useWishlist } from "../hooks/useWishlist";
import { supabase } from "../lib/supabase";
import type { ProductRow } from "../types/database";

export default function Wishlist() {
  const { wishlistIds } = useWishlist();
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (wishlistIds.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    void (async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .in("id", wishlistIds)
        .eq("is_published", true);
      setLoading(false);
      if (error) {
        setProducts([]);
        return;
      }
      const rows = (data ?? []) as ProductRow[];
      const byId = new Map(rows.map((p) => [p.id, p]));
      const ordered = wishlistIds
        .map((id) => byId.get(id))
        .filter(Boolean) as ProductRow[];
      setProducts(ordered);
    })();
  }, [wishlistIds]);

  return (
    <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-8 sm:px-6 lg:px-8 w-full text-left">
      <h1 className="text-2xl font-bold text-white">Wishlist</h1>
      <p className="mt-1 text-sm text-[#76abbf]">
        {wishlistIds.length === 0
          ? "No items saved yet."
          : `${wishlistIds.length} ${
              wishlistIds.length === 1 ? "item" : "items"
            } saved for later.`}
      </p>
      {loading ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-80 animate-pulse rounded-lg bg-[#052631]"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="mt-8 rounded-lg border border-[#066175]/35 bg-[#052631] p-12 text-center">
          <p className="text-[#76abbf]">Your wishlist is empty.</p>
          <Link
            to="/products"
            className="mt-4 inline-block rounded-lg bg-[#e38622] px-6 py-3 font-medium text-white hover:bg-orange-600 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
