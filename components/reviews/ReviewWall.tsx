"use client";

import { ReviewCharacter } from "./ReviewCharacter";

type Review = {
  id: number;
  name: string;
  message: string;
  avatar: string;
  likes: number;
  hearts: number;
  createdAt: Date | string;
};

type Props = {
  reviews: Review[];
};

export function ReviewWall({ reviews }: Props) {
  // Take top 4 reviews for mobile view
  const mobileReviews = reviews.slice(0, 4);

  return (
    <div className="h-full w-full">
      {/* MOBILE VIEW: 2x2 Grid with top padding (pt-8) so badges never clip under header */}
      <div className="grid h-full w-full grid-cols-2 grid-rows-2 items-center justify-items-center gap-x-2 gap-y-3 px-3 pb-2 pt-8 md:hidden">
        {mobileReviews.map((review, index) => {
          const isLatest = index === 0;

          return (
            <div
              key={review.id}
              className={`flex h-full w-full items-center justify-center transition-all ${
                isLatest ? "scale-95 z-30" : "scale-90 z-10"
              }`}
            >
              <ReviewCharacter review={review} latest={isLatest} />
            </div>
          );
        })}
      </div>

      {/* DESKTOP/TABLET VIEW: 2-Row Layout (Up to 10 reviews) */}
      <div className="hidden h-full w-full items-center justify-items-center gap-x-4 gap-y-6 px-6 pb-4 pt-8 md:grid md:grid-cols-4 md:grid-rows-2 lg:grid-cols-5">
        {reviews.map((review, index) => {
          const isLatest = index === 0;
          const isTopRow = Math.floor(index / 5) === 0;

          return (
            <div
              key={review.id}
              className={`flex h-full w-full items-center justify-center transition-all ${
                isLatest
                  ? "z-30 scale-105"
                  : isTopRow
                    ? "z-10 scale-90 opacity-90"
                    : "z-20 scale-100"
              }`}
            >
              <ReviewCharacter review={review} latest={isLatest} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
