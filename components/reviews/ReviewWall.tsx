"use client";

import { useEffect, useState, memo } from "react";
import { createClient } from "@supabase/supabase-js";
import { ReviewCharacter } from "./ReviewCharacter";

type Review = {
  id: number;
  name: string;
  message: string;
  avatar: string;
  likes: number;
  hearts: number;
  isBirthday?: boolean;
  createdAt: Date | string;
};

type Props = {
  reviews: Review[];
  onNewReview?: () => void;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Memoize individual review character so index shifts don't cause re-renders
const MemoizedReviewCharacter = memo(ReviewCharacter);

export function ReviewWall({ reviews: initialReviews, onNewReview }: Props) {
  // Initialize state once and detach from prop updates
  const [reviewList, setReviewList] = useState<Review[]>(() => initialReviews);

  useEffect(() => {
    const channel = supabase
      .channel("realtime-reviews-wall")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "reviews",
        },
        (payload) => {
          const raw = payload.new as any;

          const newReview: Review = {
            id: raw.id,
            name: raw.name,
            message: raw.message,
            avatar: raw.avatar,
            likes: raw.likes ?? 0,
            hearts: raw.hearts ?? 0,
            isBirthday: raw.is_birthday ?? raw.isBirthday ?? false,
            createdAt: raw.created_at ?? raw.createdAt,
          };

          setReviewList((prevReviews) => {
            // Prevent duplicate entries
            if (prevReviews.some((r) => r.id === newReview.id)) {
              return prevReviews;
            }
            // Add new review at top without touching existing array references
            return [newReview, ...prevReviews];
          });

          if (onNewReview) {
            onNewReview();
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onNewReview]);

  // Keep a maximum of 6 active items on screen
  const activeReviews = reviewList.slice(0, 6);

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
            <MemoizedReviewCharacter
              key={`review-avatar-${review.id}`} // Unique stable key per review
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
