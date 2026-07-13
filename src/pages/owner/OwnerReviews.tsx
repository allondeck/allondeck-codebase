import { useMemo, useState } from "react";
import { Button } from "../../components/Button";
import { Select } from "../../components/Select";
import { useReviewsAdmin } from "../../hooks/useReviewsAdmin";
import { supabase } from "../../lib/supabase";
import type { ReviewAdminRow } from "../../hooks/useReviewsAdmin";

function Stars({ value }: { value: number }) {
  return (
    <span className="flex gap-0.5 text-amber-500">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i}>{i <= value ? "★" : "☆"}</span>
      ))}
    </span>
  );
}

type DateRangeKey = "7" | "30" | "90" | "all";
type StatusKey = "all" | "visible" | "hidden";

function filterReviews(
  reviews: ReviewAdminRow[],
  filters: {
    productId: string;
    rating: string;
    dateRange: DateRangeKey;
    search: string;
    status: StatusKey;
  },
): ReviewAdminRow[] {
  let list = reviews;
  if (filters.productId) {
    list = list.filter((r) => r.product_id === filters.productId);
  }
  if (filters.rating) {
    const ratingNum = parseInt(filters.rating, 10);
    if (!Number.isNaN(ratingNum))
      list = list.filter((row) => row.rating === ratingNum);
  }
  if (filters.dateRange !== "all") {
    const days = parseInt(filters.dateRange, 10);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const t = cutoff.getTime();
    list = list.filter((r) => new Date(r.created_at).getTime() >= t);
  }
  if (filters.search.trim()) {
    const q = filters.search.trim().toLowerCase();
    list = list.filter((r) => (r.body ?? "").toLowerCase().includes(q));
  }
  if (filters.status === "visible") list = list.filter((r) => !r.hidden);
  if (filters.status === "hidden") list = list.filter((r) => r.hidden);
  return list;
}

export default function OwnerReviews() {
  const { reviews, loading, error, refetch } = useReviewsAdmin();
  const [toggling, setToggling] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [detailReview, setDetailReview] = useState<ReviewAdminRow | null>(null);
  const [productId, setProductId] = useState("");
  const [rating, setRating] = useState("");
  const [dateRange, setDateRange] = useState<DateRangeKey>("all");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusKey>("all");

  const filteredReviews = useMemo(
    () =>
      filterReviews(reviews, {
        productId,
        rating,
        dateRange,
        search,
        status,
      }),
    [reviews, productId, rating, dateRange, search, status],
  );

  const productOptions = useMemo(() => {
    const byId = new Map<string, string>();
    reviews.forEach((r) => {
      const name = r.products?.name ?? "Unknown";
      if (!byId.has(r.product_id)) byId.set(r.product_id, name);
    });
    return Array.from(byId.entries()).map(([id, name]) => ({ id, name }));
  }, [reviews]);

  async function handleToggleHidden(reviewId: string, currentHidden: boolean) {
    setToggling(reviewId);
    try {
      const { error: err } = await supabase
        .from("product_reviews")
        .update({ hidden: !currentHidden })
        .eq("id", reviewId);
      if (err) throw err;
      refetch();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to update");
    } finally {
      setToggling(null);
    }
  }

  async function handleDelete(reviewId: string) {
    if (!confirm("Delete this review? This cannot be undone.")) return;
    setDeleting(reviewId);
    try {
      const { error: err } = await supabase
        .from("product_reviews")
        .delete()
        .eq("id", reviewId);
      if (err) throw err;
      refetch();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to delete");
    } finally {
      setDeleting(null);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#066175]/35 border-t-[#e38622]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-950/40 border border-red-900/55 p-4 text-red-400">
        Failed to load reviews: {error.message}
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-2 text-xl font-semibold text-[#f6ebd4]">
        Product reviews
      </h2>
      <p className="mb-6 text-sm text-[#76abbf]">
        Hide inappropriate reviews; they will no longer appear on the product
        page. Delete to remove permanently. Use Email to contact reviewers.
      </p>

      {/* Filters — one row per filter, mobile-friendly, no truncation */}
      <div className="mb-6 rounded-xl border border-[#066175]/35 bg-[#052631] p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-semibold text-[#f6ebd4]">Filters</span>
          {(productId ||
            rating ||
            dateRange !== "all" ||
            search.trim() ||
            status !== "all") && (
            <button
              type="button"
              onClick={() => {
                setProductId("");
                setRating("");
                setDateRange("all");
                setSearch("");
                setStatus("all");
              }}
              className="text-sm font-medium text-[#76abbf] underline hover:text-white"
            >
              Clear filters
            </button>
          )}
        </div>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="reviews-filter-product"
              className="text-sm font-medium text-white"
            >
              Product
            </label>
            <Select
              id="reviews-filter-product"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full max-w-xs"
              aria-label="Filter by product"
            >
              <option value="">All products</option>
              {productOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="reviews-filter-rating"
              className="text-sm font-medium text-white"
            >
              Rating
            </label>
            <Select
              id="reviews-filter-rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full max-w-xs"
              aria-label="Filter by rating"
            >
              <option value="">All ratings</option>
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={String(r)}>
                  {r} ★
                </option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-white">Date</span>
            <div className="flex flex-wrap gap-2">
              {(["all", "7", "30", "90"] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setDateRange(key === "all" ? "all" : key)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    dateRange === key
                      ? "bg-[#e38622] text-white"
                      : "bg-[#052631] text-[#76abbf] border border-[#066175]/35 hover:bg-[#066175]/30 hover:text-white"
                  }`}
                >
                  {key === "all" ? "All time" : `Last ${key} days`}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="reviews-filter-status"
              className="text-sm font-medium text-white"
            >
              Status
            </label>
            <Select
              id="reviews-filter-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as StatusKey)}
              className="w-full max-w-xs"
              aria-label="Filter by status"
            >
              <option value="all">All status</option>
              <option value="visible">Visible</option>
              <option value="hidden">Hidden</option>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="reviews-search"
              className="text-sm font-medium text-white"
            >
              Search in review text
            </label>
            <input
              id="reviews-search"
              type="search"
              placeholder="Type to filter reviews…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg bg-[#044155] border border-[#066175]/60 text-white px-3 py-2.5 text-sm focus:border-[#e38622] focus:outline-none focus:ring-1 focus:ring-[#e38622]"
              aria-describedby="reviews-search-hint"
            />
            <span id="reviews-search-hint" className="text-xs text-[#76abbf]">
              Filters update as you type.
            </span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[#066175]/35 bg-[#052631]">
        <table className="w-full min-w-[600px] divide-y divide-[#066175]/35">
          <thead className="bg-[#066175]/30">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-[#76abbf]">
                Product
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-[#76abbf]">
                Rating
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-[#76abbf]">
                Review
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-[#76abbf]">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-[#76abbf]">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-[#76abbf]">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase text-[#76abbf]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#066175]/35 bg-[#052631]">
            {filteredReviews.map((r) => (
              <tr key={r.id} className={r.hidden ? "bg-[#066175]/10" : ""}>
                <td className="px-4 py-3 text-sm text-white">
                  {r.products?.name ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <Stars value={r.rating} />
                </td>
                <td
                  className="max-w-xs cursor-pointer truncate px-4 py-3 text-sm text-[#76abbf] hover:text-white hover:underline"
                  title="Click to view full review"
                  onClick={() => setDetailReview(r)}
                >
                  {r.body || "—"}
                </td>
                <td className="px-4 py-3 text-sm text-[#76abbf]">
                  {new Date(r.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  {r.reviewer_email ? (
                    <a
                      href={`mailto:${r.reviewer_email}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-[#066175]/35 bg-[#052631] px-2.5 py-1.5 text-sm font-medium text-white hover:bg-[#066175]/30"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg
                        className="h-4 w-4 text-[#76abbf]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      Email
                    </a>
                  ) : (
                    <span className="text-sm text-[#76abbf]">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {r.hidden ? (
                    <span className="rounded bg-amber-950/40 border border-amber-900/30 px-2 py-0.5 text-xs text-[#e38622]">
                      Hidden
                    </span>
                  ) : (
                    <span className="rounded bg-green-950/40 border border-green-900/30 px-2 py-0.5 text-xs text-green-400">
                      Visible
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="secondary"
                      className="text-sm"
                      onClick={() => setDetailReview(r)}
                    >
                      View
                    </Button>
                    <Button
                      variant="secondary"
                      className="text-sm"
                      onClick={() => handleToggleHidden(r.id, r.hidden)}
                      disabled={toggling === r.id}
                    >
                      {toggling === r.id ? "..." : r.hidden ? "Show" : "Hide"}
                    </Button>
                    <Button
                      variant="secondary"
                      className="text-sm border border-red-900/55 text-red-400 hover:bg-red-950/20"
                      onClick={() => handleDelete(r.id)}
                      disabled={deleting === r.id}
                    >
                      {deleting === r.id ? "..." : "Delete"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredReviews.length === 0 && (
        <p className="mt-6 text-center text-[#76abbf]">
          {reviews.length === 0
            ? "No reviews yet."
            : "No reviews match the current filters."}
        </p>
      )}

      {/* Review detail modal */}
      {detailReview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setDetailReview(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="review-detail-title"
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-[#066175]/35 bg-[#052631] shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-[#066175]/35 bg-[#052631] px-4 py-3">
              <h3
                id="review-detail-title"
                className="text-lg font-semibold text-[#f6ebd4]"
              >
                Review details
              </h3>
              <button
                type="button"
                onClick={() => setDetailReview(null)}
                className="rounded-lg p-1.5 text-[#76abbf] hover:bg-[#066175]/30 hover:text-white"
                aria-label="Close"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="space-y-4 p-4">
              <div>
                <span className="text-xs font-medium uppercase text-[#76abbf]">
                  Product
                </span>
                <p className="mt-0.5 text-sm font-medium text-white">
                  {detailReview.products?.name ?? "—"}
                </p>
              </div>
              <div>
                <span className="text-xs font-medium uppercase text-[#76abbf]">
                  Rating
                </span>
                <div className="mt-0.5">
                  <Stars value={detailReview.rating} />
                </div>
              </div>
              <div>
                <span className="text-xs font-medium uppercase text-[#76abbf]">
                  Review
                </span>
                <p className="mt-0.5 whitespace-pre-wrap text-sm text-white">
                  {detailReview.body || "—"}
                </p>
              </div>
              <div>
                <span className="text-xs font-medium uppercase text-[#76abbf]">
                  Date
                </span>
                <p className="mt-0.5 text-sm text-white">
                  {new Date(detailReview.created_at).toLocaleString()}
                </p>
              </div>
              <div>
                <span className="text-xs font-medium uppercase text-[#76abbf]">
                  Reviewer email
                </span>
                <p className="mt-0.5">
                  {detailReview.reviewer_email ? (
                    <a
                      href={`mailto:${detailReview.reviewer_email}`}
                      className="text-sm font-medium text-white underline hover:no-underline"
                    >
                      {detailReview.reviewer_email}
                    </a>
                  ) : (
                    <span className="text-sm text-[#76abbf]">—</span>
                  )}
                </p>
              </div>
              <div>
                <span className="text-xs font-medium uppercase text-[#76abbf]">
                  Status
                </span>
                <p className="mt-0.5">
                  {detailReview.hidden ? (
                    <span className="rounded bg-amber-950/40 border border-amber-900/30 px-2 py-0.5 text-xs text-[#e38622]">
                      Hidden
                    </span>
                  ) : (
                    <span className="rounded bg-green-950/40 border border-green-900/30 px-2 py-0.5 text-xs text-green-400">
                      Visible
                    </span>
                  )}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 border-t border-[#066175]/35 pt-4">
                <Button
                  variant="secondary"
                  onClick={() => {
                    handleToggleHidden(detailReview.id, detailReview.hidden);
                    setDetailReview(
                      (prev) => prev && { ...prev, hidden: !prev.hidden },
                    );
                  }}
                  disabled={toggling === detailReview.id}
                >
                  {toggling === detailReview.id
                    ? "..."
                    : detailReview.hidden
                      ? "Show"
                      : "Hide"}
                </Button>
                <Button
                  variant="secondary"
                  className="border border-red-900/55 text-red-400 hover:bg-red-950/20"
                  onClick={() => {
                    handleDelete(detailReview.id);
                    setDetailReview(null);
                  }}
                  disabled={deleting === detailReview.id}
                >
                  {deleting === detailReview.id ? "..." : "Delete"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

