"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Edit3,
  Loader2,
  Plus,
  Quote,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";

type MotivationalQuote = {
  id: string;
  quote: string;
  createdAt: string;
  updatedAt: string;
};

type Pagination = {
  currentPage: number;
  pageSize: number;
  totalQuotes: number;
  totalPages: number;
};

const EMPTY_PAGINATION: Pagination = {
  currentPage: 1,
  pageSize: 20,
  totalQuotes: 0,
  totalPages: 1,
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

/**
 * Smart pagination
 *
 * Example:
 *
 * 1 2 3 ... 100
 *
 * 1 ... 49 50 51 ... 100
 *
 * 1 ... 98 99 100
 */
function getPaginationItems(
  currentPage: number,
  totalPages: number,
): (number | "...")[] {
  if (totalPages <= 7) {
    return Array.from(
      { length: totalPages },
      (_, index) => index + 1,
    );
  }

  // Near beginning
  if (currentPage <= 3) {
    return [
      1,
      2,
      3,
      4,
      "...",
      totalPages,
    ];
  }

  // Near end
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

export default function MotivationalQuotesPage() {
  const [quotes, setQuotes] = useState<
    MotivationalQuote[]
  >([]);

  const [pagination, setPagination] =
    useState<Pagination>(EMPTY_PAGINATION);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const [showModal, setShowModal] =
    useState(false);

  const [editingQuote, setEditingQuote] =
    useState<MotivationalQuote | null>(null);

  const [quoteText, setQuoteText] =
    useState("");

  const loadQuotes = useCallback(
    async (page: number) => {
      try {
        setError(null);

        const response = await fetch(
          `/api/admin/motivational-quotes?page=${page}`,
          {
            method: "GET",
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load motivational quotes.",
          );
        }

        const data = await response.json();

        setQuotes(data.quotes ?? []);

        setPagination(
          data.pagination ?? EMPTY_PAGINATION,
        );
      } catch (error) {
        console.error(
          "Failed to load quotes:",
          error,
        );

        setError(
          "Unable to load motivational quotes.",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    loadQuotes(1);
  }, [loadQuotes]);

  const handleRefresh = () => {
    setRefreshing(true);

    loadQuotes(
      pagination.currentPage,
    );
  };

  const handlePageChange = (
    page: number,
  ) => {
    if (
      page === pagination.currentPage ||
      page < 1 ||
      page > pagination.totalPages
    ) {
      return;
    }

    setLoading(true);

    loadQuotes(page);
  };

  const openAddModal = () => {
    setEditingQuote(null);
    setQuoteText("");
    setShowModal(true);
  };

  const openEditModal = (
    quote: MotivationalQuote,
  ) => {
    setEditingQuote(quote);
    setQuoteText(quote.quote);
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) {
      return;
    }

    setShowModal(false);
    setEditingQuote(null);
    setQuoteText("");
  };

  const handleSave = async () => {
    const value = quoteText.trim();

    if (!value) {
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const isEditing =
        editingQuote !== null;

      const response = await fetch(
        "/api/admin/motivational-quotes",
        {
          method: isEditing
            ? "PATCH"
            : "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            isEditing
              ? {
                  id: editingQuote.id,
                  quote: value,
                }
              : {
                  quote: value,
                },
          ),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to save quote.",
        );
      }

      closeModal();

      /*
       * Reload the current page.
       *
       * For a newly created quote, the API orders
       * newest first, so we load page 1 to show it.
       */
      if (!isEditing) {
        setLoading(true);
        await loadQuotes(1);
      } else {
        await loadQuotes(
          pagination.currentPage,
        );
      }
    } catch (error) {
      console.error(
        "Failed to save quote:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to save quote.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (
    quote: MotivationalQuote,
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this motivational quote?",
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(quote.id);
      setError(null);

      const response = await fetch(
        "/api/admin/motivational-quotes",
        {
          method: "DELETE",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            id: quote.id,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to delete quote.",
        );
      }

      /*
       * If this was the only item on the page,
       * move back one page when possible.
       */
      if (
        quotes.length === 1 &&
        pagination.currentPage > 1
      ) {
        setLoading(true);

        await loadQuotes(
          pagination.currentPage - 1,
        );
      } else {
        await loadQuotes(
          pagination.currentPage,
        );
      }
    } catch (error) {
      console.error(
        "Failed to delete quote:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete quote.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const paginationItems =
    getPaginationItems(
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
                <Quote className="h-5 w-5" />
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-950 md:text-4xl">
                  Motivational Quotes
                </h1>

                <p className="mt-1 text-sm text-zinc-500">
                  Create and manage motivational
                  quotes displayed on the platform.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={
                refreshing || loading
              }
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  refreshing
                    ? "animate-spin"
                    : ""
                }`}
              />

              Refresh
            </button>

            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800"
            >
              <Plus className="h-4 w-4" />
              Add Quote
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-zinc-200" />

        {/* Summary */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
              Total Quotes
            </p>

            <p className="mt-2 text-3xl font-bold text-zinc-950">
              {loading
                ? "--"
                : pagination.totalQuotes.toLocaleString()}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
              Quotes Per Page
            </p>

            <p className="mt-2 text-3xl font-bold text-zinc-950">
              20
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                loadQuotes(
                  pagination.currentPage,
                )
              }
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

            <p className="mt-3 text-sm text-zinc-500">
              Loading motivational quotes...
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          quotes.length === 0 && (
            <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center">
              <Quote className="mx-auto h-8 w-8 text-zinc-300" />

              <h3 className="mt-4 font-semibold text-zinc-950">
                No motivational quotes yet
              </h3>

              <p className="mt-1 text-sm text-zinc-500">
                Add your first motivational quote
                to get started.
              </p>

              <button
                type="button"
                onClick={openAddModal}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
              >
                <Plus className="h-4 w-4" />
                Add Quote
              </button>
            </div>
          )}

        {/* Quotes Table */}
        {!loading &&
          !error &&
          quotes.length > 0 && (
            <>
              <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">

                {/* Table header */}
                <div className="hidden border-b border-zinc-200 bg-zinc-50 px-6 py-3 md:grid md:grid-cols-[minmax(0,1fr)_190px_190px_130px] md:items-center md:gap-6">
                  <div className="text-xs font-semibold uppercase tracking-[0.1em] text-zinc-500">
                    Quote
                  </div>

                  <div className="text-xs font-semibold uppercase tracking-[0.1em] text-zinc-500">
                    Created
                  </div>

                  <div className="text-xs font-semibold uppercase tracking-[0.1em] text-zinc-500">
                    Updated
                  </div>

                  <div className="text-right text-xs font-semibold uppercase tracking-[0.1em] text-zinc-500">
                    Actions
                  </div>
                </div>

                <div className="divide-y divide-zinc-200">
                  {quotes.map(
                    (quote) => (
                      <div
                        key={quote.id}
                        className="px-5 py-5 transition hover:bg-zinc-50 md:px-6"
                      >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_190px_190px_130px] md:items-center md:gap-6">

                          {/* Quote */}
                          <div className="min-w-0">
                            <div className="flex gap-3">
                              <Quote className="mt-1 h-4 w-4 shrink-0 text-zinc-400" />

                              <p className="text-sm leading-6 text-zinc-800">
                                {quote.quote}
                              </p>
                            </div>
                          </div>

                          {/* Created */}
                          <div>
                            <p className="text-sm text-zinc-700">
                              {formatDate(
                                quote.createdAt,
                              )}
                            </p>
                          </div>

                          {/* Updated */}
                          <div>
                            <p className="text-sm text-zinc-700">
                              {formatDate(
                                quote.updatedAt,
                              )}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2 md:justify-end">
                            <button
                              type="button"
                              onClick={() =>
                                openEditModal(
                                  quote,
                                )
                              }
                              className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
                            >
                              <Edit3 className="h-4 w-4" />
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  quote,
                                )
                              }
                              disabled={
                                deletingId ===
                                quote.id
                              }
                              className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {deletingId ===
                              quote.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}

                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Pagination */}
              {pagination.totalPages >
                1 && (
                <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                  {/* Result count */}
                  <p className="text-sm text-zinc-500">
                    Showing{" "}
                    <span className="font-medium text-zinc-900">
                      {(pagination.currentPage -
                        1) *
                        pagination.pageSize +
                        1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium text-zinc-900">
                      {Math.min(
                        pagination.currentPage *
                          pagination.pageSize,
                        pagination.totalQuotes,
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-zinc-900">
                      {pagination.totalQuotes.toLocaleString()}
                    </span>{" "}
                    quotes
                  </p>

                  {/* Pagination */}
                  <div className="flex items-center gap-1">

                    {/* Previous */}
                    <button
                      type="button"
                      onClick={() =>
                        handlePageChange(
                          pagination.currentPage -
                            1,
                        )
                      }
                      disabled={
                        pagination.currentPage ===
                        1
                      }
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>

                    {/* Page numbers */}
                    {paginationItems.map(
                      (
                        item,
                        index,
                      ) =>
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
                            onClick={() =>
                              handlePageChange(
                                item,
                              )
                            }
                            className={`h-9 min-w-9 rounded-lg px-2 text-sm font-medium transition ${
                              pagination.currentPage ===
                              item
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
                      onClick={() =>
                        handlePageChange(
                          pagination.currentPage +
                            1,
                        )
                      }
                      disabled={
                        pagination.currentPage ===
                        pagination.totalPages
                      }
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

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border border-zinc-200 bg-white shadow-2xl">

            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-zinc-950">
                  {editingQuote
                    ? "Edit Motivational Quote"
                    : "Add Motivational Quote"}
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  {editingQuote
                    ? "Update the motivational quote."
                    : "Add a new quote to the platform."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 disabled:opacity-50"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <div className="p-6">
              <label className="text-sm font-medium text-zinc-900">
                Motivational Quote
              </label>

              <textarea
                value={quoteText}
                onChange={(event) =>
                  setQuoteText(
                    event.target.value,
                  )
                }
                placeholder="Enter a motivational quote..."
                rows={5}
                autoFocus
                className="mt-2 w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
              />

              <p className="mt-2 text-xs text-zinc-400">
                {quoteText.length} characters
              </p>
            </div>

            {/* Modal actions */}
            <div className="flex justify-end gap-3 border-t border-zinc-200 px-6 py-4">
              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={
                  saving ||
                  !quoteText.trim()
                }
                className="inline-flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}

                {editingQuote
                  ? "Save Changes"
                  : "Add Quote"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}