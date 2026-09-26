import { desc, gte, count } from "drizzle-orm";

import { db } from "@/lib/db";
import { reviews } from "@/db/schema";

import { ReviewWall } from "@/components/reviews/ReviewWall";
import { AddReviewButton } from "@/components/reviews/AddReviewButton";
import { HeaderBanner } from "@/components/HeaderBanner";

export default async function HomePage() {
  // Get midnight today (UTC)
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  // Fetch latest reviews and calculate today's total count in parallel
  const [reviewsData, [todayCountResult]] = await Promise.all([
    db.select().from(reviews).orderBy(desc(reviews.createdAt)).limit(10),

    db
      .select({ value: count() })
      .from(reviews)
      .where(gte(reviews.createdAt, todayStart)),
  ]);

  const dailyCount = todayCountResult?.value ?? 0;

  return (
    <main className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-[#f2cfd5] text-[#503322]">
      {/* Top Header */}
      <header className="relative z-50 flex flex-shrink-0 items-center justify-between px-3 py-2.5 sm:px-5 sm:py-4 md:px-10 md:py-6 landscape:py-1.5 landscape:px-4 transition-all">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Square Logo */}
          <div className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-lg border-2 border-[#503322]/30 p-1 shrink-0">
            <img
              src="/logo.jpeg"
              alt="La Roll"
              className="w-full h-full object-contain rounded-md"
            />
          </div>

          <div className="flex flex-col">
            <div className="font-serif text-xl sm:text-2xl md:text-3xl tracking-wide leading-tight">
              LA ROLL
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 text-[7px] sm:text-[8px] md:text-[9px] tracking-[0.14em] sm:tracking-[0.18em]">
              <span>BAKERY & COFFEE</span>
              <span className="text-[#503322]/40">•</span>
              <span className="font-semibold text-[#804222]">REVIEW WALL</span>
            </div>
          </div>
        </div>
        {/* Center Tagline (Hidden on mobile and mobile landscape) */}
        <div className="hidden text-center font-serif text-sm italic tracking-widest text-[#503322]/80 lg:block">
          Beyond the rolls, Beyond the expectations
        </div>

        {/* Action Button */}
        <div className="flex items-center">
          <AddReviewButton />
        </div>
      </header>

      {/* Banner */}
      <HeaderBanner initialCount={dailyCount} />

      {/* Main Review Wall section */}
      <section className="relative flex flex-1 w-full items-center justify-center overflow-y-auto md:overflow-hidden pt-2 pb-2 md:pt-10 md:pb-8">
        <ReviewWall />
      </section>
    </main>
  );
}
