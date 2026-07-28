import { Button } from "../../../../components/ui/Button";
import type { ProductReviewRow } from "../../../../hooks/useProductReviews";

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

interface ProductReviewsSectionProps {
  user: any;
  hasPurchasedLoading: boolean;
  myReviewLoading: boolean;
  canSubmitReview: boolean;
  hasPurchasedProduct: boolean;
  myReview: any;
  reviewRating: number;
  setReviewRating: (rating: number) => void;
  reviewBody: string;
  setReviewBody: (body: string) => void;
  reviewSubmitting: boolean;
  reviewSubmitted: boolean;
  onSubmitReview: (e: React.FormEvent) => void;
  reviewsLoading: boolean;
  reviewsError: any;
  reviews: ProductReviewRow[];
  hasMoreReviews: boolean;
  loadMoreReviews: () => void;
  reviewsLoadingMore: boolean;
  reviewsTotalCount: number;
}

export function ProductReviewsSection({
  user,
  hasPurchasedLoading,
  myReviewLoading,
  canSubmitReview,
  hasPurchasedProduct,
  myReview,
  reviewRating,
  setReviewRating,
  reviewBody,
  setReviewBody,
  reviewSubmitting,
  reviewSubmitted,
  onSubmitReview,
  reviewsLoading,
  reviewsError,
  reviews,
  hasMoreReviews,
  loadMoreReviews,
  reviewsLoadingMore,
  reviewsTotalCount,
}: ProductReviewsSectionProps) {
  return (
    <section className="mt-16 border-t border-brand-medium/35 pt-12">
      <h2 className="mb-4 text-xl font-semibold text-white">Reviews</h2>
      {user &&
        !hasPurchasedLoading &&
        !myReviewLoading &&
        canSubmitReview && (
          <form
            onSubmit={onSubmitReview}
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
                    reviewRating >= r
                      ? "text-amber-500"
                      : "text-brand-medium/50"
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
  );
}
