import { desc } from "drizzle-orm";

import { db } from "@/lib/db";
import { reviews } from "@/db/schema";

import { ReviewWall } from "@/components/reviews/ReviewWall";
import { AddReviewButton } from "@/components/reviews/AddReviewButton";

export default async function HomePage() {
  const reviewsData = await db
    .select()
    .from(reviews)
    .orderBy(desc(reviews.createdAt))
    .limit(10);

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

      {/* Replace the main section in app/page.tsx */}
      <section className="relative flex flex-1 w-full items-center justify-center overflow-y-auto md:overflow-hidden pt-4 pb-4 md:pt-10 md:pb-8">
        <ReviewWall reviews={reviewsData} />
      </section>
    </main>
  );
}
