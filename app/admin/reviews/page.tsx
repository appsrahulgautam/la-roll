"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Cake,
  Heart,
  Loader2,
  MessageSquare,
  RefreshCw,
  ThumbsUp,
  Trash2,
  TreePine,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";

type Review = {
  id: number;
  name: string;
  message: string;
  avatar: string;
  isBirthday: boolean;
  isChristmas: boolean;
  likes: number;
  hearts: number;
  createdAt: string;
};

type Pagination = {
  currentPage: number;
  pageSize: number;
  totalReviews: number;
  totalPages: number;
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function Avatar({ avatar, name }: { avatar: string; name: string }) {
  const avatarFile = avatar.includes(".") ? avatar : `${avatar}.png`;

  const avatarSrc = avatarFile.startsWith("/")
    ? avatarFile
    : `/avatars/${avatarFile}`;

  return (
    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-zinc-100">
      <Image
        src={avatarSrc}
        alt={name}
        fill
        className="object-cover"
        sizes="44px"
      />
    </div>
  );
}

function getPaginationItems(
  currentPage: number,
  totalPages: number,
): (number | "...")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  // Beginning
  if (currentPage <= 3) {
    return [1, 2, 3, 4, "...", totalPages];
  }

  // End
  if (currentPage >= totalPages - 2) {
    return [
      1,
      "...",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  // Middle
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const topScrollRef = useRef<HTMLDivElement>(null);
  const tableScrollRef = useRef<HTMLDivElement>(null);

  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    pageSize: 20,
    totalReviews: 0,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const syncScroll = (
    source: HTMLDivElement,
    target: HTMLDivElement | null,
  ) => {
    if (target && target.scrollLeft !== source.scrollLeft) {
      target.scrollLeft = source.scrollLeft;
    }
  };

  const syncTopScroll = () => {
    if (topScrollRef.current && tableScrollRef.current) {
      topScrollRef.current.scrollLeft = tableScrollRef.current.scrollLeft;
    }
  };

  const syncTableScroll = () => {
    if (topScrollRef.current && tableScrollRef.current) {
      tableScrollRef.current.scrollLeft = topScrollRef.current.scrollLeft;
    }
  };

  const loadReviews = useCallback(async (page: number) => {
    try {
      setError(null);

      const response = await fetch(`/api/admin/reviews?page=${page}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to load reviews.");
      }

      const data = await response.json();

      setReviews(data.reviews ?? []);
      setPagination(
        data.pagination ?? {
          currentPage: 1,
          pageSize: 20,
          totalReviews: 0,
          totalPages: 1,
        },
      );
    } catch (error) {
      console.error("Failed to load reviews:", error);
      setError("Unable to load reviews.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadReviews(1);
  }, [loadReviews]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadReviews(pagination.currentPage);
  };

  const handlePageChange = (page: number) => {
    if (
      page === pagination.currentPage ||
      page < 1 ||
      page > pagination.totalPages
    ) {
      return;
    }

    setLoading(true);
    loadReviews(page);
  };

  const handleDelete = async (review: Review) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the review from ${review.name}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(review.id);

      const response = await fetch("/api/admin/reviews", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: review.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete review.");
      }

      /*
       * If this was the last review on the current page,
       * move back one page when possible.
       */
      const isLastItemOnPage = reviews.length === 1;

      if (isLastItemOnPage && pagination.currentPage > 1) {
        setLoading(true);
        await loadReviews(pagination.currentPage - 1);
      } else {
        await loadReviews(pagination.currentPage);
      }
    } catch (error) {
      console.error("Failed to delete review:", error);

      alert(
        error instanceof Error ? error.message : "Failed to delete review.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const paginationItems = getPaginationItems(
    pagination.currentPage,
    pagination.totalPages,
  );

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-7xl space-y-8 p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black text-white">
                <MessageSquare className="h-5 w-5" />
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-950 md:text-4xl">
                  Reviews
                </h1>

                <p className="mt-1 text-sm text-zinc-500">
                  Manage customer reviews submitted to the platform.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-zinc-200" />

        {/* Summary */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
              Total Reviews
            </p>

            <p className="mt-2 text-3xl font-bold text-zinc-950">
              {loading ? "--" : pagination.totalReviews.toLocaleString()}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            <div className="flex items-center gap-2">
              <ThumbsUp className="h-4 w-4 text-zinc-500" />

              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
                Page Likes
              </p>
            </div>

            <p className="mt-2 text-3xl font-bold text-zinc-950">
              {loading
                ? "--"
                : reviews
                    .reduce((total, review) => total + review.likes, 0)
                    .toLocaleString()}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-zinc-500" />

              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
                Page Hearts
              </p>
            </div>

            <p className="mt-2 text-3xl font-bold text-zinc-950">
              {loading
                ? "--"
                : reviews
                    .reduce((total, review) => total + review.hearts, 0)
                    .toLocaleString()}
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="text-sm font-medium text-red-700">{error}</p>

            <button
              type="button"
              onClick={() => loadReviews(pagination.currentPage)}
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && !error && (
          <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center">
            <Loader2 className="mx-auto h-6 w-6 animate-spin text-zinc-500" />

            <p className="mt-3 text-sm text-zinc-500">Loading reviews...</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && reviews.length === 0 && (
          <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center">
            <MessageSquare className="mx-auto h-8 w-8 text-zinc-300" />

            <h3 className="mt-4 font-semibold text-zinc-950">No reviews yet</h3>

            <p className="mt-1 text-sm text-zinc-500">
              Reviews submitted by customers will appear here.
            </p>
          </div>
        )}

        {/* Reviews */}
        {!loading && !error && reviews.length > 0 && (
          <>
            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
              {/* Persistent horizontal scrollbar */}
              <div
                ref={topScrollRef}
                onScroll={syncTableScroll}
                className="sticky top-0 z-20 overflow-x-auto overflow-y-hidden border-b border-zinc-200 bg-white"
              >
                <div className="h-4 min-w-[1000px]" />
              </div>

              {/* Table */}
              <div
                ref={tableScrollRef}
                onScroll={syncTopScroll}
                className="overflow-x-auto"
              >
                <div className="min-w-[900px]">
                  {/* Table Header */}
                  <div className="hidden border-b border-zinc-200 bg-zinc-50 px-6 py-3 md:grid md:grid-cols-[minmax(220px,1fr)_minmax(300px,2fr)_140px_120px_100px] md:items-center md:gap-6">
                    <div className="text-xs font-semibold uppercase tracking-[0.1em] text-zinc-500">
                      Customer
                    </div>

                    <div className="text-xs font-semibold uppercase tracking-[0.1em] text-zinc-500">
                      Review
                    </div>

                    <div className="text-xs font-semibold uppercase tracking-[0.1em] text-zinc-500">
                      Engagement
                    </div>

                    <div className="text-xs font-semibold uppercase tracking-[0.1em] text-zinc-500">
                      Date
                    </div>

                    <div className="text-right text-xs font-semibold uppercase tracking-[0.1em] text-zinc-500">
                      Action
                    </div>
                  </div>

                  <div className="divide-y divide-zinc-200">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="px-5 py-5 transition hover:bg-zinc-50 md:px-6"
                      >
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-[minmax(220px,1fr)_minmax(300px,2fr)_140px_120px_100px] md:items-center md:gap-6">
                          {/* Customer */}
                          <div className="flex items-center gap-3">
                            <Avatar avatar={review.avatar} name={review.name} />

                            <div className="min-w-0">
                              <p className="truncate font-semibold text-zinc-950">
                                {review.name}
                              </p>

                              <p className="mt-0.5 text-xs text-zinc-400">
                                Review #{review.id}
                              </p>

                              {(review.isBirthday || review.isChristmas) && (
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                  {review.isBirthday && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-pink-50 px-2 py-1 text-[11px] font-medium text-pink-700">
                                      <Cake className="h-3 w-3" />
                                      Birthday
                                    </span>
                                  )}

                                  {review.isChristmas && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-[11px] font-medium text-green-700">
                                      <TreePine className="h-3 w-3" />
                                      Special Day
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Review */}
                          <div>
                            <p className="text-sm leading-6 text-zinc-700">
                              {review.message}
                            </p>
                          </div>

                          {/* Engagement */}
                          <div className="flex gap-4 md:block">
                            <div className="flex items-center gap-1.5 text-sm text-zinc-500">
                              <ThumbsUp className="h-4 w-4" />

                              <span className="tabular-nums">
                                {review.likes.toLocaleString()}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 text-sm text-zinc-500 md:mt-2">
                              <Heart className="h-4 w-4" />

                              <span className="tabular-nums">
                                {review.hearts.toLocaleString()}
                              </span>
                            </div>
                          </div>

                          {/* Date */}
                          <div>
                            <p className="text-sm text-zinc-700">
                              {formatDate(review.createdAt)}
                            </p>
                          </div>

                          {/* Delete */}
                          <div className="flex md:justify-end">
                            <button
                              type="button"
                              onClick={() => handleDelete(review)}
                              disabled={deletingId === review.id}
                              className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {deletingId === review.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Results info */}
                <p className="text-sm text-zinc-500">
                  Showing{" "}
                  <span className="font-medium text-zinc-900">
                    {(pagination.currentPage - 1) * pagination.pageSize + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium text-zinc-900">
                    {Math.min(
                      pagination.currentPage * pagination.pageSize,
                      pagination.totalReviews,
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-zinc-900">
                    {pagination.totalReviews.toLocaleString()}
                  </span>{" "}
                  reviews
                </p>

                {/* Pagination buttons */}
                <div className="flex items-center gap-1">
                  {/* Previous */}
                  <button
                    type="button"
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {/* Pages */}
                  {paginationItems.map((item, index) =>
                    item === "..." ? (
                      <span
                        key={`ellipsis-${index}`}
                        className="flex h-9 w-9 items-center justify-center text-sm text-zinc-400"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={item}
                        type="button"
                        onClick={() => handlePageChange(item)}
                        className={`h-9 min-w-9 rounded-lg px-2 text-sm font-medium transition ${
                          pagination.currentPage === item
                            ? "bg-black text-white"
                            : "text-zinc-600 hover:bg-zinc-100"
                        }`}
                      >
                        {item}
                      </button>
                    ),
                  )}

                  {/* Next */}
                  <button
                    type="button"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
