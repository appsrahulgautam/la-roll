"use client";

import { useEffect, useState, useRef } from "react";
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

export function ReviewWall({ reviews: initialReviews, onNewReview }: Props) {
  // Store review list in state initialized only once from initialProps
  const [reviewList, setReviewList] = useState<Review[]>(() => initialReviews);

  // Keep a reference to prevent state reset race conditions
  const initializedRef = useRef(false);

  useEffect(() => {
    // Only update if initialReviews changes during route transitions, NOT during routine re-renders
    if (initializedRef.current && initialReviews.length > 0) {
      setReviewList((prev) => {
        // Merge without losing existing real-time additions
        const existingIds = new Set(prev.map((r) => r.id));
        const missingFromInitial = initialReviews.filter(
          (r) => !existingIds.has(r.id),
        );
        return missingFromInitial.length > 0
          ? [...missingFromInitial, ...prev]
          : prev;
      });
    }
    initializedRef.current = true;
  }, [initialReviews]);

  useEffect(() => {
    const channel = supabase
      .channel("realtime-reviews")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "reviews",
        },
        (payload) => {
          const raw = payload.new as any;

          // Normalize snake_case DB columns to camelCase
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
            // Check if review already exists to avoid redundant re-renders
            if (prevReviews.some((r) => r.id === newReview.id)) {
              return prevReviews;
            }
            // Prepend new review while maintaining existing instances
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

  // Keep maximum 6 active items on screen
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
            <ReviewCharacter
              key={review.id} // Ensures React identifies avatars by ID, not array position
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
