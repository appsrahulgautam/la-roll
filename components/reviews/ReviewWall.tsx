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
    <div className="h-full w-full px-6 py-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 grid-rows-2 gap-y-6 gap-x-4 items-center justify-items-center overflow-hidden">
      {reviews.map((review, index) => {
        const isLatest = index === 0;
        const isTopRow = Math.floor(index / 5) === 0;

        return (
          <div
            key={review.id}
            className={`flex h-full w-full items-center justify-center transition-all ${
              isLatest
                ? "scale-105 z-30"
                : isTopRow
                  ? "scale-90 z-10 opacity-90"
                  : "scale-100 z-20"
            }`}
          >
            <ReviewCharacter review={review} latest={isLatest} />
          </div>
        );
      })}
    </div>
  );
}
