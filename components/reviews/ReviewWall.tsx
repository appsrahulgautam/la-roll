"use client";

import { useEffect, useState } from "react";
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Show top 6 on mobile, top 10 on desktop
  const activeReviews = isMobile ? reviews.slice(0, 6) : reviews.slice(0, 10);

  return (
    <div className="relative h-full w-full p-0 md:px-8 md:pb-8">
      {/* CURVED SHOP STAGE */}
      <div className="relative h-full w-full overflow-hidden rounded-none border-y-2 border-black/80 bg-[#fffaf5] shadow-2xl md:rounded-[36px] md:border-2">
        {/* COURTYARD SHOP BACKGROUND IMAGE */}
        <div
          className="absolute inset-0 pointer-events-none bg-cover bg-bottom bg-no-repeat"
          style={{ backgroundImage: "url('/background.png')" }}
        />

        {/* ANIMATED WALKING CANVAS */}
        <div className="relative z-10 h-full w-full pointer-events-none">
          {activeReviews.map((review, index) => (
            <ReviewCharacter
              key={review.id}
              review={review}
              latest={index === 0}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
