"use client";

import { useEffect, useState } from "react";
import {
  UserCog,
  Shield,
  ShieldAlert,
  Code2,
  Mail,
  Calendar,
  MoreVertical,
  Users,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

type AdminRole = "super-admin" | "admin" | "developer";

type Admin = {
  id: string;
  email: string;
  role: AdminRole;
  createdAt: string;
};

function RoleBadge({ role }: { role: AdminRole }) {
  const config = {
    "super-admin": {
      label: "Super Admin",
      icon: ShieldAlert,
    },
    admin: {
      label: "Admin",
      icon: Shield,
    },
    developer: {
      label: "Developer",
      icon: Code2,
    },
  };

  const { label, icon: Icon } = config[role];

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-800">
      <Icon className="h-3.5 w-3.5 text-zinc-500" />
      {label}
    </span>
  );
}

function formatDate(date: string) {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getAdminLabel(email: string) {
  const name = email.split("@")[0];

  return name
    .replace(/[._-]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getInitial(email: string) {
  return email.charAt(0).toUpperCase();
}

export default function AdminManagersPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadAdmins() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/admin/managers", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to load administrators.");
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid administrator response.");
      }

      setAdmins(data);
    } catch (error) {
      console.error("Failed to fetch administrators:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load administrators.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAdmins();
  }, []);

  const totalAdmins = admins.length;

  const superAdmins = admins.filter(
    (admin) => admin.role === "super-admin",
  ).length;

  const developers = admins.filter(
    (admin) => admin.role === "developer",
  ).length;

  const regularAdmins = admins.filter((admin) => admin.role === "admin").length;

  return (
    <div className="min-h-screen  p-6 text-zinc-950 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-5 border-b border-zinc-200 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
          
            <h1 className="text-3xl font-bold tracking-tight text-black md:text-4xl">
              Admins
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-zinc-500">
              Manage Scrubbedin administrators and review their assigned access
              roles.
            </p>
          </div>

          <button
            onClick={loadAdmins}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

     
        {/* Error */}
        {error && (
          <div className="rounded-2xl border border-zinc-300 bg-zinc-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white">
                !
              </div>

              <div>
                <p className="text-sm font-semibold text-black">
                  Unable to load administrators
                </p>

                <p className="mt-0.5 text-sm text-zinc-500">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
          {/* Table Header */}
          <div className="flex flex-col gap-1 border-b border-zinc-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-bold text-black">Administrators</h2>

              <p className="mt-1 text-xs text-zinc-500">
                All administrator accounts registered in Scrubbedin.
              </p>
            </div>

            {!loading && (
              <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-600">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {totalAdmins} account{totalAdmins === 1 ? "" : "s"}
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400">
                    Administrator
                  </th>

                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400">
                    Email
                  </th>

                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400">
                    Role
                  </th>

                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400">
                    Created
                  </th>

                  <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-100">
                {/* Loading */}
                {loading &&
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index}>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 animate-pulse rounded-full bg-zinc-100" />

                          <div className="space-y-2">
                            <div className="h-3 w-28 animate-pulse rounded bg-zinc-100" />
                            <div className="h-2.5 w-20 animate-pulse rounded bg-zinc-100" />
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="h-3 w-40 animate-pulse rounded bg-zinc-100" />
                      </td>

                      <td className="px-6 py-5">
                        <div className="h-7 w-24 animate-pulse rounded-full bg-zinc-100" />
                      </td>

                      <td className="px-6 py-5">
                        <div className="h-3 w-24 animate-pulse rounded bg-zinc-100" />
                      </td>

                      <td className="px-6 py-5">
                        <div className="ml-auto h-8 w-8 animate-pulse rounded-lg bg-zinc-100" />
                      </td>
                    </tr>
                  ))}

                {/* Empty */}
                {!loading && !error && admins.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50">
                        <Users className="h-5 w-5 text-zinc-400" />
                      </div>

                      <p className="mt-4 text-sm font-semibold text-black">
                        No administrators found
                      </p>

                      <p className="mt-1 text-sm text-zinc-500">
                        There are currently no administrator accounts.
                      </p>
                    </td>
                  </tr>
                )}

                {/* Data */}
                {!loading &&
                  admins.map((admin) => (
                    <tr
                      key={admin.id}
                      className="group transition-colors hover:bg-zinc-50"
                    >
                      {/* Administrator */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                            {getInitial(admin.email)}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-black">
                              {getAdminLabel(admin.email)}
                            </p>

                            <p className="mt-0.5 text-xs font-mono text-zinc-400">
                              ID: {admin.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-sm text-zinc-700">
                          <Mail className="h-4 w-4 shrink-0 text-zinc-400" />
                          <span>{admin.email}</span>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-5">
                        <RoleBadge role={admin.role} />
                      </td>

                      {/* Created */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-sm text-zinc-500">
                          <Calendar className="h-4 w-4 text-zinc-400" />
                          <span>{formatDate(admin.createdAt)}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5 text-right">
                        <button
                          type="button"
                          className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-100 hover:text-black"
                          aria-label={`Actions for ${admin.email}`}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
