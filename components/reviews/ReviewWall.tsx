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
  return (
    <div className="h-full w-full">
      {/* MOBILE VIEW: Vertical Scrollable Grid (Shows ALL reviews) */}
      <div className="flex h-full w-full flex-col overflow-y-auto px-4 pb-12 pt-8 md:hidden scrollbar-thin scrollbar-thumb-[#503322]/20">
        <div className="grid grid-cols-2 gap-x-3 gap-y-10 items-end justify-items-center">
          {reviews.map((review, index) => {
            const isLatest = index === 0;

            return (
              <div
                key={review.id}
                className={`flex w-full items-center justify-center transition-all ${
                  isLatest ? "scale-95 z-30" : "scale-90 z-10"
                }`}
              >
                <ReviewCharacter review={review} latest={isLatest} />
              </div>
            );
          })}
        </div>
      </div>

      {/* DESKTOP/TABLET VIEW: Static No-Scroll 2D Grid (Unchanged) */}
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
