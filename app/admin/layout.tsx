"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  LogOut,
  ChartSpline,
  UserCheck,
  MapPlus,
  LandPlot,
  UserCog,
  Menu,
  X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

function AdminNavItem({
  href,
  icon: Icon,
  label,
  onClick,
}: {
  href: string;
  icon: any;
  label: string;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all",
        isActive
          ? "bg-black text-white shadow-lg shadow-black/10"
          : "text-zinc-500 hover:bg-zinc-100 hover:text-black active:bg-zinc-200",
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{label}</span>
    </Link>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Automatically close mobile menu when navigating to another route
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileOpen]);

  const logout = async () => {
    setIsMobileOpen(false);
    const res = await fetch("/api/admin/logout", {
      method: "POST",
    });

    if (res.ok) router.push("/login/admin");
    else alert("Invalid request");
  };

  const closeSidebar = () => setIsMobileOpen(false);

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex flex-col md:flex-row font-sans antialiased">
      {/* Mobile Header Bar */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-white/80 backdrop-blur-md border-b border-zinc-200">
        <Link
          href="/admin"
          className="text-sm font-black tracking-tighter uppercase flex items-center gap-1.5"
        >
          ScrubbedIn
          <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded font-medium">
            ADMIN
          </span>
        </Link>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 text-zinc-600 hover:text-black hover:bg-zinc-100 rounded-lg transition-colors focus:outline-none"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </header>

      {/* Dark Overlay for Mobile Sidebar */}
      {isMobileOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={cn(
          "fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r border-zinc-200 flex flex-col justify-between shrink-0 transition-transform duration-300 ease-in-out md:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div>
          {/* Header section in sidebar */}
          <div className="h-16 md:h-20 flex items-center justify-between px-6 border-b border-zinc-100">
            <Link
              href="/admin"
              onClick={closeSidebar}
              className="text-sm font-black tracking-tighter uppercase flex items-center gap-2"
            >
              ScrubbedIn
              <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded">
                ADMIN
              </span>
            </Link>
            <button
              onClick={closeSidebar}
              className="md:hidden text-zinc-400 hover:text-black p-1.5 rounded-lg hover:bg-zinc-100 transition-colors"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Nav items */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-140px)]">
            <AdminNavItem
              href="/admin"
              icon={ChartSpline}
              label="Dashboard"
              onClick={closeSidebar}
            />
            <AdminNavItem
              href="/admin/events/create"
              icon={MapPlus}
              label="Create Event"
              onClick={closeSidebar}
            />
            <AdminNavItem
              href="/admin/events/manage"
              icon={LandPlot}
              label="Manage Events"
              onClick={closeSidebar}
            />
            <AdminNavItem
              href="/admin/reviews"
              icon={UserCheck}
              label="Reviews"
              onClick={closeSidebar}
            />
            <AdminNavItem
              href="/admin/manage-admins"
              icon={UserCog}
              label="Manage Admins"
              onClick={closeSidebar}
            />
          </nav>
        </div>

        {/* Footer Logout button */}
        <div className="p-4 border-t border-zinc-100 bg-white">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-red-600 hover:bg-red-50 hover:text-red-700 w-full rounded-xl transition-all active:scale-[0.98]"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col">
        <div className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10">{children}</div>
      </main>
    </div>
  );
}
