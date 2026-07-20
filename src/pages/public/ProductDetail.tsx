import { useMemo, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { ProductCard } from "../../components/features/ProductCard";
import { RecentlyViewedStrip } from "../../components/features/RecentlyViewedStrip";
import { useProductBySlug } from "../../hooks/useProductBySlug";
import { useSuggestedProducts } from "../../hooks/useSuggestedProducts";
import { useRecentlyViewed } from "../../hooks/useRecentlyViewed";
import { useProductReviews } from "../../hooks/useProductReviews";
import { useHasPurchasedProduct } from "../../hooks/useHasPurchasedProduct";
import { useMyProductReview } from "../../hooks/useMyProductReview";
import { useDeals } from "../../hooks/useDeals";
import { useProductsByIds } from "../../hooks/useProductsByIds";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useStoreSettings } from "../../hooks/useStoreSettings";
import { formatPrice, parsePrice } from "../../lib/utils";
import { getSupabaseImageTransformUrl } from "../../lib/imageUtils";
import { supabase } from "../../lib/supabase";
import type { ProductRow } from "../../types/database";

function getEstimatedDeliveryText(settings: Record<string, unknown>): string {
  const v = settings.estimated_delivery;
  if (v == null) return "";
  if (typeof v === "string") return v.replace(/^"|"$/g, "").trim();
  return "";
}

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { product, categoryIds, loading, error } = useProductBySlug(slug);
  
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  
  const activeVariants = useMemo(() => {
    return product?.product_variants?.filter(v => v.is_active).sort((a, b) => {
      if (a.is_default) return -1;
      if (b.is_default) return 1;
      return a.created_at.localeCompare(b.created_at);
    }) || [];
  }, [product]);

  useEffect(() => {
    if (activeVariants.length > 0 && !selectedVariantId) {
      setSelectedVariantId(activeVariants[0].id);
    }
  }, [activeVariants, selectedVariantId]);

  const selectedVariant = useMemo(() => {
    return activeVariants.find(v => v.id === selectedVariantId) || null;
  }, [activeVariants, selectedVariantId]);

  const price = selectedVariant?.price != null ? parsePrice(selectedVariant.price) : (product ? parsePrice(product.price) : 0);
  const { products: suggested, loading: suggestedLoading } =
    useSuggestedProducts(
      product?.id ?? null,
      categoryIds,
      price,
      !!product && !loading,
    );
  const {
    products: recentlyViewed,
    loading: recentlyLoading,
    recordView,
  } = useRecentlyViewed(product?.id ?? null);
  const { user } = useAuth();
  const {
    reviews,
    loading: reviewsLoading,
    loadingMore: reviewsLoadingMore,
    error: reviewsError,
    refetch: refetchReviews,
    loadMore: loadMoreReviews,
    hasMore: hasMoreReviews,
    totalCount: reviewsTotalCount,
  } = useProductReviews(product?.id ?? null);
  const { hasPurchased: hasPurchasedProduct, loading: hasPurchasedLoading } =
    useHasPurchasedProduct(product?.id ?? null, user?.id ?? null);
  const {
    review: myReview,
    loading: myReviewLoading,
    refetch: refetchMyReview,
  } = useMyProductReview(product?.id ?? null, user?.id ?? null);
  const canSubmitReview = hasPurchasedProduct && !myReview;
  const { settings } = useStoreSettings();
  const { addItem, addCombo } = useCart();
  const estimatedDelivery = getEstimatedDeliveryText(settings);
  const { deals } = useDeals();
  const dealContainingProduct = useMemo(
    () =>
      product
        ? deals.find((d) =>
            d.deal_items.some((i) => i.product_id === product.id),
          )
        : null,
    [deals, product],
  );
  const dealProductIds = useMemo(
    () =>
      dealContainingProduct
        ? dealContainingProduct.deal_items.map((i) => i.product_id)
        : [],
    [dealContainingProduct],
  );
  const { products: dealProducts, loading: dealProductsLoading } =
    useProductsByIds(dealProductIds);
  const dealProductMap = useMemo(() => {
    const m = new Map<string, ProductRow>();
    dealProducts.forEach((p) => m.set(p.id, p));
    return m;
  }, [dealProducts]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [comboAdded, setComboAdded] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewBody, setReviewBody] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    if (product?.id) recordView(product.id);
  }, [product?.id, recordView]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="aspect-square w-full max-w-lg rounded-lg bg-brand-dark-alt" />
        <div className="mt-6 h-8 w-2/3 rounded bg-brand-dark-alt" />
        <div className="mt-4 h-4 w-1/2 rounded bg-brand-dark-alt" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="rounded-lg bg-red-900/50 p-4 text-red-200 border border-red-500/30">
        Product not found or failed to load.
      </div>
    );
  }

  const productPrice = price;
  const compareAtPrice = selectedVariant?.compare_at_price != null ? parsePrice(selectedVariant.compare_at_price) : parsePrice(product.compare_at_price);
  const hasComparePrice = compareAtPrice > 0 && compareAtPrice > productPrice;
  const currentStock = selectedVariant ? selectedVariant.stock_quantity : product.stock_quantity;
  const inStock = currentStock > 0;

  function handleAddToCart() {
    if (!product) return;
    const variantPrice = selectedVariant?.price != null ? Number(selectedVariant.price) : undefined;
    addItem(product, quantity, selectedVariant?.id, selectedVariant?.name, variantPrice, selectedVariant?.image_url);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleAddComboToCart() {
    if (!dealContainingProduct) return;
    addCombo({
      dealId: dealContainingProduct.id,
      dealName: dealContainingProduct.name,
      totalPrice: dealContainingProduct.total_price,
      items: dealContainingProduct.deal_items.map((di) => ({
        product_id: di.product_id,
        product_name: dealProductMap.get(di.product_id)?.name ?? "Product",
        quantity: di.quantity,
      })),
    });
    setComboAdded(true);
    setTimeout(() => setComboAdded(false), 2000);
  }

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !product) return;
    setReviewSubmitting(true);
    try {
      const { error: err } = await supabase.from("product_reviews").upsert(
        {
          product_id: product.id,
          user_id: user.id,
          rating: reviewRating,
          body: reviewBody.trim() || null,
          reviewer_email: user.email ?? "",
        },
        { onConflict: "product_id,user_id" },
      );
      if (err) throw err;
      setReviewSubmitted(true);
      setReviewBody("");
      refetchReviews();
      refetchMyReview();
    } catch {
      setReviewSubmitted(false);
    } finally {
      setReviewSubmitting(false);
    }
  }

  function Stars({ value }: { value: number }) {
    return (
      <span
        className="flex gap-0.5 text-amber-500"
        aria-label={`${value} out of 5 stars`}
      >
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i}>{i <= value ? "★" : "☆"}</span>
        ))}
      </span>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-8 sm:px-6 lg:px-8 w-full">
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="aspect-square w-full max-w-lg shrink-0 overflow-hidden rounded-lg bg-brand-dark-alt">
          {selectedVariant?.image_url || product.image_url ? (
            <img
              src={getSupabaseImageTransformUrl(selectedVariant?.image_url || product.image_url, {
                width: 600,
                height: 600,
                bucket: "products",
              })}
              alt={product.name}
              width={600}
              height={600}
              loading="eager"
              decoding="async"
              // @ts-expect-error fetchpriority is valid HTML; camelCase fetchPriority triggers React DOM warning
              fetchpriority="high"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-brand-light">
              <svg
                className="h-32 w-32"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"
                />
              </svg>
            </div>
          )}
        </div>

        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white">{product.name}</h1>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-2xl font-semibold text-brand-cream">
              {formatPrice(productPrice)}
            </span>
            {hasComparePrice && (
              <span className="text-lg text-brand-light line-through">
                {formatPrice(compareAtPrice)}
              </span>
            )}
          </div>
          {product.description && (
            <p className="mt-4 text-brand-cream">{product.description}</p>
          )}
          {!inStock && <p className="mt-2 text-red-400">Out of stock</p>}
          {inStock && (
            <p className="mt-2 text-sm text-brand-light">
              {currentStock} in stock
              {estimatedDelivery && (
                <span className="block mt-1">Ships in {estimatedDelivery}</span>
              )}
            </p>
          )}
          {!inStock && estimatedDelivery && (
            <p className="mt-2 text-sm text-brand-light">
              Ships in {estimatedDelivery}
            </p>
          )}

          {activeVariants.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-white mb-3">Select Option</h3>
              <div className="flex flex-wrap gap-2">
                {activeVariants.map(variant => {
                  const isSelected = selectedVariantId === variant.id;
                  const isVariantOutOfStock = variant.stock_quantity <= 0;
                  return (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariantId(variant.id)}
                      disabled={isVariantOutOfStock}
                      className={`
                        px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200
                        ${isSelected 
                          ? 'border-brand-orange bg-brand-orange/10 text-brand-orange' 
                          : 'border-brand-medium/40 bg-brand-dark-alt text-white hover:border-brand-light/50'
                        }
                        ${isVariantOutOfStock ? 'opacity-50 cursor-not-allowed line-through' : ''}
                      `}
                    >
                      {variant.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {inStock && (
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="flex items-center rounded-lg border border-brand-medium/50 bg-brand-dark-alt">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 py-2 text-brand-cream hover:bg-brand-medium/30 transition-colors"
                >
                  −
                </button>
                <span className="w-12 text-center font-medium text-white">{quantity}</span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) => Math.min(currentStock, q + 1))
                  }
                  className="px-4 py-2 text-brand-cream hover:bg-brand-medium/30 transition-colors"
                >
                  +
                </button>
              </div>
              <Button
                type="button"
                onClick={handleAddToCart}
                className={`px-6 py-3 ${
                  added ? "!bg-green-600 hover:!bg-green-700" : ""
                }`}
              >
                {added ? "Added to cart" : "Add to cart"}
              </Button>
            </div>
          )}
        </div>
      </div>

      {dealContainingProduct && (
        <section className="mt-12 border-t border-brand-medium/35 pt-10">
          <h2 className="mb-3 text-xl font-semibold text-white">Deal</h2>
          <p className="mb-4 text-sm text-brand-cream">
            This product is part of{" "}
            <strong>{dealContainingProduct.name}</strong> — all items together
            for {formatPrice(dealContainingProduct.total_price)}.
          </p>
          {dealProductsLoading ? (
            <div className="flex gap-4 overflow-hidden">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-32 w-28 shrink-0 animate-pulse rounded-lg bg-brand-dark-alt"
                />
              ))}
            </div>
          ) : (
            <>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {dealContainingProduct.deal_items.map((item) => {
                  const p = dealProductMap.get(item.product_id);
                  if (!p) return null;
                  return (
                    <Link
                      key={item.id}
                      to={`/products/${p.slug}`}
                      className="flex shrink-0 flex-col items-center gap-1 rounded-lg border border-brand-medium/35 bg-brand-dark-alt p-3 transition hover:border-brand-medium/60 hover:bg-brand-medium/30"
                    >
                      <div className="h-20 w-20 overflow-hidden rounded-md bg-brand-dark">
                        {p.image_url ? (
                          <img
                            src={getSupabaseImageTransformUrl(p.image_url, {
                              width: 80,
                              height: 80,
                              bucket: "products",
                            })}
                            alt={p.name}
                            width={80}
                            height={80}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-gray-400">
                            <svg
                              className="h-8 w-8"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <span className="max-w-[100px] truncate text-center text-sm font-medium text-white">
                        {p.name}
                      </span>
                      <span className="text-xs text-brand-light">
                        ×{item.quantity}
                      </span>
                    </Link>
                  );
                })}
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  onClick={handleAddComboToCart}
                  className={
                    comboAdded ? "!bg-green-600 hover:!bg-green-700" : ""
                  }
                >
                  {comboAdded ? "Added to cart" : "Add combo to cart"}
                </Button>
                <span className="text-lg font-semibold text-brand-cream">
                  {formatPrice(dealContainingProduct.total_price)}
                </span>
              </div>
            </>
          )}
        </section>
      )}

      {(suggested.length > 0 || suggestedLoading) && (
        <section className="mt-16 border-t border-brand-medium/35 pt-12">
          <h2 className="mb-6 text-xl font-semibold text-white">
            You might also like
          </h2>
          {suggestedLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-80 animate-pulse rounded-lg bg-brand-dark-alt"
                />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {suggested.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>
      )}

      <section className="mt-16 border-t border-brand-medium/35 pt-12">
        <h2 className="mb-4 text-xl font-semibold text-white">Reviews</h2>
        {user &&
          !hasPurchasedLoading &&
          !myReviewLoading &&
          canSubmitReview && (
            <form
              onSubmit={handleSubmitReview}
              className="mb-8 rounded-lg border border-brand-medium/35 bg-brand-dark-alt p-4"
            >
              <label className="block text-sm font-medium text-brand-cream">
                Your rating
              </label>
              <div className="mt-1 flex gap-1">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setReviewRating(r)}
                    className={`text-2xl ${
                      reviewRating >= r ? "text-amber-500" : "text-brand-medium/50"
                    }`}
                    aria-label={`${r} stars`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <label
                htmlFor="review-body"
                className="mt-3 block text-sm font-medium text-brand-cream"
              >
                Your review (optional)
              </label>
              <textarea
                id="review-body"
                value={reviewBody}
                onChange={(e) => setReviewBody(e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-lg border border-brand-medium/50 bg-brand-dark px-3 py-2 text-sm text-white placeholder-brand-light/50 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
                placeholder="Share your experience..."
              />
              <Button
                type="submit"
                disabled={reviewSubmitting}
                className="mt-3"
              >
                {reviewSubmitting
                  ? "Submitting..."
                  : reviewSubmitted
                    ? "Submitted"
                    : "Submit review"}
              </Button>
            </form>
          )}
        {user &&
          !hasPurchasedLoading &&
          !myReviewLoading &&
          hasPurchasedProduct &&
          myReview && (
            <p className="mb-6 text-sm text-brand-light">
              You&apos;ve already reviewed this product.
            </p>
          )}
        {user && !hasPurchasedLoading && !hasPurchasedProduct && (
          <p className="mb-6 text-sm text-brand-light">
            Only customers who have purchased this item can leave a review.
          </p>
        )}
        {reviewsLoading ? (
          <p className="text-sm text-brand-light">Loading reviews...</p>
        ) : reviewsError ? (
          <p className="text-sm text-red-400">Failed to load reviews.</p>
        ) : reviews.length === 0 ? (
          <p className="text-sm text-brand-light">No reviews yet.</p>
        ) : (
          <>
            <ul className="space-y-4">
              {reviews.map((r) => (
                <li
                  key={r.id}
                  className="rounded-lg border border-brand-medium/35 bg-brand-dark-alt p-4"
                >
                  <div className="flex items-center gap-2">
                    <Stars value={r.rating} />
                    <span className="text-sm text-brand-light">
                      {new Date(r.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {r.body && (
                    <p className="mt-2 text-sm text-brand-cream">{r.body}</p>
                  )}
                </li>
              ))}
            </ul>
            {hasMoreReviews && (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={loadMoreReviews}
                  disabled={reviewsLoadingMore}
                  className="text-sm font-medium text-brand-light underline hover:text-white disabled:opacity-50"
                >
                  {reviewsLoadingMore
                    ? "Loading..."
                    : `Show more (${Math.min(
                        20,
                        reviewsTotalCount - reviews.length,
                      )} more)`}
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <div className="mt-16">
        <RecentlyViewedStrip
          products={recentlyViewed}
          loading={recentlyLoading}
        />
      </div>
    </div>
  );
}
