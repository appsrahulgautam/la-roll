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
      {/* Header */}
      <header className="relative z-50 flex flex-shrink-0 items-center justify-between px-5 py-4 md:px-10 md:py-6">
        <div>
          <div className="font-serif text-2xl tracking-wide sm:text-3xl">
            LA ROLL
          </div>
          <div className="flex items-center gap-2 text-[8px] tracking-[0.18em] sm:text-[9px]">
            <span>BAKERY & COFFEE</span>
            <span className="text-[#503322]/40">•</span>
            <span className="font-semibold text-[#804222]">REVIEW WALL</span>
          </div>
        </div>

        {/* Center Tagline */}
        <div className="hidden text-center font-serif text-sm italic tracking-widest text-[#503322]/80 md:block lg:text-base">
          Beyond the rolls, Beyond the expectations
        </div>

        <AddReviewButton />
      </header>

      <HeaderBanner />

      {/* Main Review Wall section */}
      <section className="relative flex flex-1 w-full items-center justify-center overflow-y-auto md:overflow-hidden pt-4 pb-4 md:pt-10 md:pb-8">
        <ReviewWall reviews={reviewsData} />
      </section>
    </main>
  );
}
