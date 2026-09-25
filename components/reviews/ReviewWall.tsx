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
  instagramHandle?: string; // Added optional prop for dynamic handle
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Memoize individual review character so index shifts don't cause re-renders
const MemoizedReviewCharacter = memo(ReviewCharacter);

export function ReviewWall({
  reviews: initialReviews,
  onNewReview,
  instagramHandle = "@laroll.om", // Default username
}: Props) {
  // Initialize state once and detach from prop updates
  const [reviewList, setReviewList] = useState<Review[]>(() => initialReviews);
  const [wallpaperUrl, setWallpaperUrl] = useState<string | null>(null);
  const [newReviewId, setNewReviewId] = useState<number | null>(null);
  // -----------------------------------------
  // REVIEWS REALTIME
  // -----------------------------------------
  useEffect(() => {
    const channel = supabase
      .channel("realtime-reviews-wall")

      // -----------------------------------------
      // NEW REVIEW
      // -----------------------------------------
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
            if (prevReviews.some((review) => review.id === newReview.id)) {
              return prevReviews;
            }


            return [newReview, ...prevReviews].slice(0, 6);
          });

          onNewReview?.();
        },
      )

      // -----------------------------------------
      // REVIEW DELETED
      // -----------------------------------------
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "reviews",
        },
        (payload) => {
          const deletedId = Number((payload.old as any).id);

          setReviewList((prevReviews) =>
            prevReviews.filter((review) => review.id !== deletedId),
          );
        },
      )

      // -----------------------------------------
      // REVIEW UPDATED
      // -----------------------------------------
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "reviews",
        },
        (payload) => {
          const raw = payload.new as any;

          setReviewList((prevReviews) =>
            prevReviews.map((review) =>
              review.id === raw.id
                ? {
                    ...review,
                    name: raw.name,
                    message: raw.message,
                    avatar: raw.avatar,
                    likes: raw.likes ?? 0,
                    hearts: raw.hearts ?? 0,
                    isBirthday: raw.is_birthday ?? raw.isBirthday ?? false,
                    createdAt: raw.created_at ?? raw.createdAt,
                  }
                : review,
            ),
          );
        },
      )

      .subscribe((status) => {
        console.log("Reviews realtime status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onNewReview]);

  // -----------------------------------------
  // WALLPAPER: LOAD CURRENT WALLPAPER
  // + REALTIME UPDATES
  // -----------------------------------------
  useEffect(() => {
    const loadWallpaper = async () => {
      const { data, error } = await supabase
        .from("wallpaper")
        .select("wallpaper_url")
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Failed to load wallpaper:", error);
        return;
      }

      if (data?.wallpaper_url) {
        setWallpaperUrl(data.wallpaper_url);
      }
    };

    loadWallpaper();

    const wallpaperChannel = supabase
      .channel("realtime-wallpaper")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "wallpaper",
        },
        (payload) => {
          console.log("Wallpaper updated:", payload);

          const wallpaper = payload.new as {
            wallpaper_url?: string;
          };

          if (wallpaper.wallpaper_url) {
            setWallpaperUrl(wallpaper.wallpaper_url);
          }
        },
      )
      .subscribe((status) => {
        console.log("Wallpaper realtime status:", status);
      });

    return () => {
      supabase.removeChannel(wallpaperChannel);
    };
  }, []);

  // Keep a maximum of 6 active items on screen
  const activeReviews = reviewList.slice(0, 7);

  return (
    <div className="relative h-full w-full p-0 md:px-8 md:pb-8">
      {/* CURVED SHOP STAGE */}
      <div className="relative h-full w-full overflow-hidden rounded-none border-y-2 border-black/80 bg-[#fffaf5] shadow-2xl md:rounded-[36px] md:border-2">
        {/* TOP RIGHT INSTAGRAM BADGE */}
        <a
          href={`https://instagram.com/${instagramHandle.replace("@", "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-4 right-4 z-20 flex items-center gap-1.5 rounded-full border border-black/10 bg-white/80 px-3 py-1.5 text-xs font-semibold text-gray-800 shadow-md backdrop-blur-md transition-all hover:bg-white hover:scale-105"
        >
          <svg
            className="h-4 w-4 text-pink-600"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
          <span>{instagramHandle}</span>
        </a>

        {/* COURTYARD SHOP BACKGROUND IMAGE */}
        <div
          className="absolute inset-0 pointer-events-none bg-[#F3CED5] bg-cover bg-bottom bg-no-repeat"
          style={{
            backgroundImage: `url("${wallpaperUrl}")`,
          }}
        />

        {/* ANIMATED WALKING CANVAS */}
        <div className="relative z-10 h-full w-full pointer-events-none">
          {activeReviews.map((review, index) => (
            <MemoizedReviewCharacter
              key={`review-avatar-${review.id}`}
              review={review}
              latest={index === 0}
              index={index}
              newReview={review.id === newReviewId}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
