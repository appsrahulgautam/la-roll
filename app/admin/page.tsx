"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import {
  Users2,
  Image,
  Quote,
  ShieldCheck,
  Heart,
  ThumbsUp,
  RefreshCw,
  MessageSquare,
} from "lucide-react";

type DashboardStats = {
  reviewsCount: number;
  todayReviewsCount: number;
  quotesCount: number;

  adminsCount: number;
  superAdminsCount: number;
  developersCount: number;

  totalLikes: number;
  totalHearts: number;
};

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between border-b border-zinc-200 py-4 last:border-0 last:pb-0 first:pt-0">
      <span className="text-sm text-zinc-500">{label}</span>

      <span className="font-semibold text-zinc-950 tabular-nums">
        {typeof value === "number" ? value.toLocaleString() : value}
      </span>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  title,
  value,
  description,
  loading,
}: {
  icon: React.ElementType;
  title: string;
  value: number | undefined;
  description: string;
  loading: boolean;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 transition-shadow hover:shadow-md">
      <div className="mb-5 flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black text-white">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
        {title}
      </p>

      {loading ? (
        <div className="mt-2 h-10 w-28 animate-pulse rounded-lg bg-zinc-100" />
      ) : (
        <p className="mt-1 text-4xl font-bold tracking-tight text-zinc-950">
          {value !== undefined ? value.toLocaleString() : "--"}
        </p>
      )}

      <div className="mt-4 flex items-center gap-2 text-sm text-zinc-500">
        <div className="h-2 w-2 rounded-full bg-black" />
        <span>{description}</span>
      </div>
    </div>
  );
}

function DashboardStats({
  setLoading,
}: {
  setLoading: (value: boolean) => void;
}) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/dashboard-stats", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to load dashboard statistics.");
      }

      const data = await response.json();

      setStats({
        reviewsCount: Number(data.reviewsCount ?? 0),
        quotesCount: Number(data.quotesCount ?? 0),
        todayReviewsCount: Number(data.todayReviewsCount ?? 0),

        adminsCount: Number(data.adminsCount ?? 0),
        superAdminsCount: Number(data.superAdminsCount ?? 0),
        developersCount: Number(data.developersCount ?? 0),

        totalLikes: Number(data.totalLikes ?? 0),
        totalHearts: Number(data.totalHearts ?? 0),
      });
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
      setError("Unable to load dashboard statistics.");
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  if (error) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center lg:col-span-3">
        <p className="text-sm font-medium text-zinc-900">{error}</p>

        <button
          type="button"
          onClick={loadStats}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Reviews */}
      <MetricCard
        icon={MessageSquare}
        title="Total Reviews"
        value={stats?.reviewsCount}
        description="Customer reviews on platform"
        loading={!stats}
      />

      {/* Motivational Quotes */}
      <MetricCard
        icon={Quote}
        title="Motivational Quotes"
        value={stats?.quotesCount}
        description="Quotes available to display"
        loading={!stats}
      />

      {/* Wallpaper */}
      <MetricCard
        icon={MessageSquare}
        title="Today's Reviews"
        value={stats?.todayReviewsCount}
        description="Reviews submitted today"
        loading={!stats}
      />

      {/* Platform Overview */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 lg:col-span-3">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <div>
              <h3 className="font-semibold text-zinc-950">Platform Overview</h3>

              <p className="mt-0.5 text-sm text-zinc-500">
                Current platform statistics and engagement
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-12 md:grid-cols-2">
          <StatRow label="Total Reviews" value={stats?.reviewsCount ?? "--"} />

          <StatRow
            label="Motivational Quotes"
            value={stats?.quotesCount ?? "--"}
          />

          <StatRow
            label="Today's Reviews"
            value={stats?.todayReviewsCount ?? "--"}
          />

          <StatRow label="Total Likes" value={stats?.totalLikes ?? "--"} />

          <StatRow label="Total Hearts" value={stats?.totalHearts ?? "--"} />

          <StatRow label="Total Admins" value={stats?.adminsCount ?? "--"} />
        </div>
      </div>
    </>
  );
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((value) => value + 1);
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-7xl space-y-8 p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-950 md:text-4xl">
              Dashboard
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-zinc-500 md:text-base">
              Overview of reviews, content, engagement, and administrative
              activity.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-zinc-200" />

        {/* Stats */}
        <div
          key={refreshKey}
          className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          <Suspense
            fallback={
              <div className="text-sm text-zinc-500">Loading dashboard...</div>
            }
          >
            <DashboardStats setLoading={setLoading} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
