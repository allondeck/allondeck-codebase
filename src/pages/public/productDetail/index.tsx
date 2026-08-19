import { useMemo, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { RecentlyViewedStrip } from "../../../components/features/RecentlyViewedStrip";
import { useProductBySlug } from "../../../hooks/useProductBySlug";
import { useSuggestedProducts } from "../../../hooks/useSuggestedProducts";
import { useRecentlyViewed } from "../../../hooks/useRecentlyViewed";
import { useProductReviews } from "../../../hooks/useProductReviews";
import { useHasPurchasedProduct } from "../../../hooks/useHasPurchasedProduct";
import { useMyProductReview } from "../../../hooks/useMyProductReview";
import { useDeals } from "../../../hooks/useDeals";
import { useProductsByIds } from "../../../hooks/useProductsByIds";
import { useCart } from "../../../context/CartContext";
import { useAuth } from "../../../context/AuthContext";
import { useStoreSettings } from "../../../hooks/useStoreSettings";
import { parsePrice } from "../../../lib/utils";
import { supabase } from "../../../lib/supabase";
import type { ProductRow } from "../../../types/database";
import { ProductMainSection } from "./partials/ProductMainSection";
import { ProductDealSection } from "./partials/ProductDealSection";
import { ProductSuggestedSection } from "./partials/ProductSuggestedSection";
import { ProductReviewsSection } from "./partials/ProductReviewsSection";

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
    return (
      product?.product_variants
        ?.filter((v) => v.is_active)
        .sort((a, b) => {
          if (a.is_default) return -1;
          if (b.is_default) return 1;
          return a.created_at.localeCompare(b.created_at);
        }) || []
    );
  }, [product]);

  useEffect(() => {
    if (activeVariants.length > 0 && !selectedVariantId) {
      setSelectedVariantId(activeVariants[0].id);
    }
  }, [activeVariants, selectedVariantId]);

  const selectedVariant = useMemo(() => {
    return activeVariants.find((v) => v.id === selectedVariantId) || null;
  }, [activeVariants, selectedVariantId]);

  const price =
    selectedVariant?.price != null
      ? parsePrice(selectedVariant.price)
      : product
        ? parsePrice(product.price)
        : 0;
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
  const compareAtPrice =
    selectedVariant?.compare_at_price != null
      ? parsePrice(selectedVariant.compare_at_price)
      : parsePrice(product.compare_at_price);
  const hasComparePrice = compareAtPrice > 0 && compareAtPrice > productPrice;
  const currentStock = selectedVariant
    ? selectedVariant.stock_quantity
    : product.stock_quantity;
  const inStock = currentStock > 0;

  function handleAddToCart() {
    if (!product) return;
    const variantPrice =
      selectedVariant?.price != null
        ? Number(selectedVariant.price)
        : undefined;
    addItem(
      product,
      quantity,
      selectedVariant?.id,
      selectedVariant?.name,
      variantPrice,
      selectedVariant?.image_url,
    );
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

  return (
    <div className="mx-auto max-w-content px-6 py-8 sm:px-6 lg:px-8 w-full">
      <ProductMainSection
        product={product}
        activeVariants={activeVariants}
        selectedVariantId={selectedVariantId}
        setSelectedVariantId={setSelectedVariantId}
        selectedVariant={selectedVariant}
        productPrice={productPrice}
        hasComparePrice={hasComparePrice}
        compareAtPrice={compareAtPrice}
        inStock={inStock}
        currentStock={currentStock}
        estimatedDelivery={estimatedDelivery}
        quantity={quantity}
        setQuantity={setQuantity}
        onAddToCart={handleAddToCart}
        added={added}
      />

      <ProductDealSection
        dealContainingProduct={dealContainingProduct ?? null}
        dealProductMap={dealProductMap}
        dealProductsLoading={dealProductsLoading}
        onAddComboToCart={handleAddComboToCart}
        comboAdded={comboAdded}
      />

      <ProductSuggestedSection
        suggested={suggested}
        suggestedLoading={suggestedLoading}
      />

      <ProductReviewsSection
        user={user}
        hasPurchasedLoading={hasPurchasedLoading}
        myReviewLoading={myReviewLoading}
        canSubmitReview={canSubmitReview}
        hasPurchasedProduct={hasPurchasedProduct}
        myReview={myReview}
        reviewRating={reviewRating}
        setReviewRating={setReviewRating}
        reviewBody={reviewBody}
        setReviewBody={setReviewBody}
        reviewSubmitting={reviewSubmitting}
        reviewSubmitted={reviewSubmitted}
        onSubmitReview={handleSubmitReview}
        reviewsLoading={reviewsLoading}
        reviewsError={reviewsError}
        reviews={reviews}
        hasMoreReviews={hasMoreReviews}
        loadMoreReviews={loadMoreReviews}
        reviewsLoadingMore={reviewsLoadingMore}
        reviewsTotalCount={reviewsTotalCount}
      />

      <div className="mt-16">
        <RecentlyViewedStrip
          products={recentlyViewed}
          loading={recentlyLoading}
        />
      </div>
    </div>
  );
}
