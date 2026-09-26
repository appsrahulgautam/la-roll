// "use client";

// import { useEffect, useState, useMemo, memo } from "react";
// import { createClient } from "@supabase/supabase-js";
// import { motion, AnimatePresence } from "framer-motion";
// import { ReviewCharacter } from "./ReviewCharacter";

// type Review = {
//   id: number;
//   name: string;
//   message: string;
//   avatar: string;
//   likes: number;
//   hearts: number;
//   isBirthday?: boolean;
//   isChristmas?: boolean;
//   createdAt: Date | string;
// };

// type Props = {
//   onNewReview?: () => void;
//   instagramHandle?: string;
// };

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
// const supabase = createClient(supabaseUrl, supabaseAnonKey);

// const MemoizedReviewCharacter = memo(ReviewCharacter);

// export function ReviewWall({
//   onNewReview,
//   instagramHandle = "@laroll.om",
// }: Props) {
//   const [reviewList, setReviewList] = useState<Review[]>([]);
//   const [wallpaperUrl, setWallpaperUrl] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   // Responsive limit state (Halved on mobile screens)
//   const [maxCharacters, setMaxCharacters] = useState(7);

//   // -----------------------------------------
//   // RESPONSIVE SCREEN SIZE LISTENER
//   // -----------------------------------------
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth < 768) {
//         setMaxCharacters(3);
//       } else {
//         setMaxCharacters(7);
//       }
//     };

//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // -----------------------------------------
//   // LOAD REVIEWS & SUBSCRIBE TO REALTIME
//   // -----------------------------------------
//   useEffect(() => {
//     const fetchReviews = async () => {
//       const { data, error } = await supabase
//         .from("reviews")
//         .select("*")
//         .order("created_at", { ascending: false })
//         .limit(10);

//       if (error) {
//         console.error("Failed to fetch reviews:", error);
//       } else if (data) {
//         const formattedReviews: Review[] = data.map((raw: any) => ({
//           id: raw.id,
//           name: raw.name,
//           message: raw.message,
//           avatar: raw.avatar,
//           likes: raw.likes ?? 0,
//           hearts: raw.hearts ?? 0,
//           isBirthday: raw.is_birthday ?? raw.isBirthday ?? false,
//           isChristmas: raw.is_christmas ?? raw.isChristmas ?? false,
//           createdAt: raw.created_at ?? raw.createdAt,
//         }));
//         setReviewList(formattedReviews);
//       }
//       setIsLoading(false);
//     };

//     fetchReviews();

//     const channel = supabase
//       .channel("realtime-reviews-wall")
//       .on(
//         "postgres_changes",
//         {
//           event: "INSERT",
//           schema: "public",
//           table: "reviews",
//         },
//         (payload) => {
//           const raw = payload.new as any;

//           const newReview: Review = {
//             id: raw.id,
//             name: raw.name,
//             message: raw.message,
//             avatar: raw.avatar,
//             likes: raw.likes ?? 0,
//             hearts: raw.hearts ?? 0,
//             isBirthday: raw.is_birthday ?? raw.isBirthday ?? false,
//             isChristmas: raw.is_christmas ?? raw.isChristmas ?? false,
//             createdAt: raw.created_at ?? raw.createdAt,
//           };

//           setReviewList((prevReviews) => {
//             if (prevReviews.some((review) => review.id === newReview.id)) {
//               return prevReviews;
//             }
//             return [newReview, ...prevReviews];
//           });

//           onNewReview?.();
//         },
//       )
//       .on(
//         "postgres_changes",
//         {
//           event: "DELETE",
//           schema: "public",
//           table: "reviews",
//         },
//         (payload) => {
//           const deletedId = Number((payload.old as any).id);
//           setReviewList((prevReviews) =>
//             prevReviews.filter((review) => review.id !== deletedId),
//           );
//         },
//       )
//       .on(
//         "postgres_changes",
//         {
//           event: "UPDATE",
//           schema: "public",
//           table: "reviews",
//         },
//         (payload) => {
//           const raw = payload.new as any;
//           setReviewList((prevReviews) =>
//             prevReviews.map((review) =>
//               review.id === raw.id
//                 ? {
//                     ...review,
//                     name: raw.name,
//                     message: raw.message,
//                     avatar: raw.avatar,
//                     likes: raw.likes ?? 0,
//                     hearts: raw.hearts ?? 0,
//                     isBirthday: raw.is_birthday ?? raw.isBirthday ?? false,
//                     isChristmas: raw.is_christmas ?? raw.isChristmas ?? false,
//                     createdAt: raw.created_at ?? raw.createdAt,
//                   }
//                 : review,
//             ),
//           );
//         },
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, [onNewReview]);

//   // -----------------------------------------
//   // WALLPAPER REALTIME
//   // -----------------------------------------
//   useEffect(() => {
//     const loadWallpaper = async () => {
//       const { data } = await supabase
//         .from("wallpaper")
//         .select("wallpaper_url")
//         .limit(1)
//         .maybeSingle();

//       if (data?.wallpaper_url) setWallpaperUrl(data.wallpaper_url);
//     };
//     loadWallpaper();
//   }, []);

//   const latestReview = reviewList.length > 0 ? reviewList[0] : null;

//   const backgroundReviews = useMemo(() => {
//     // Return items after index 0 up to maxCharacters
//     return reviewList.slice(1, maxCharacters);
//   }, [reviewList, maxCharacters]);

//   return (
//     <div className="relative h-full w-full p-0 md:px-8 md:pb-8">
//       {/* CURVED SHOP STAGE */}
//       <div className="relative h-full w-full overflow-hidden rounded-none border-y-2 border-black/80 bg-[#fffaf5] shadow-2xl md:rounded-[36px] md:border-2">
//         {/* INSTAGRAM BADGE */}
//         <a
//           href={`https://instagram.com/${instagramHandle.replace("@", "")}`}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="absolute top-4 right-4 z-20 flex items-center gap-1.5 rounded-full border border-black/10 bg-white/80 px-3 py-1.5 text-xs font-semibold text-gray-800 shadow-md backdrop-blur-md transition-all hover:bg-white hover:scale-105"
//         >
//           <svg
//             className="h-4 w-4 text-pink-600"
//             fill="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
//           </svg>
//           <span>{instagramHandle}</span>
//         </a>

//         {/* BACKGROUND IMAGE */}
//         <div
//           className="absolute inset-0 pointer-events-none bg-[#F3CED5] bg-cover bg-bottom bg-no-repeat"
//           style={{
//             backgroundImage: wallpaperUrl
//               ? `url("${wallpaperUrl}")`
//               : undefined,
//           }}
//         />

//         {/* ANIMATED CANVAS */}
//         <div className="relative z-10 h-full w-full pointer-events-none">
//           {!isLoading && (
//             <>
//               {/* 1. LATEST REVIEW (INSTANT POP IN CENTER) */}
//               <AnimatePresence>
//                 {latestReview && (
//                   <motion.div
//                     key={`spotlight-${latestReview.id}`}
//                     className="absolute left-1/2 -translate-x-1/2 pointer-events-auto z-40"
//                     style={{ bottom: "12%" }}
//                     initial={{ scale: 0, opacity: 0, y: 20 }}
//                     animate={{ scale: 1, opacity: 1, y: 0 }}
//                     exit={{
//                       opacity: 0,
//                       scale: 0.5,
//                       transition: { duration: 0.25 },
//                     }}
//                     transition={{
//                       type: "spring",
//                       stiffness: 300,
//                       damping: 18,
//                     }}
//                   >
//                     <MemoizedReviewCharacter
//                       review={latestReview}
//                       latest={true}
//                       index={0}
//                       newReview={true}
//                     />
//                   </motion.div>
//                 )}
//               </AnimatePresence>

//               {/* 2. BACKGROUND LOOPING REVIEWS */}
//               {backgroundReviews.map((review, index) => (
//                 <MemoizedReviewCharacter
//                   key={`bg-review-${review.id}`}
//                   review={review}
//                   latest={false}
//                   index={index + 1}
//                   newReview={false}
//                 />
//               ))}
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState, useMemo, memo, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";
import { ReviewCharacter } from "./ReviewCharacter";

type Review = {
  id: number;
  name: string;
  message: string;
  avatar: string;
  likes: number;
  hearts: number;
  isBirthday?: boolean;
  isChristmas?: boolean;
  createdAt: Date | string;
};

type Props = {
  onNewReview?: () => void;
  instagramHandle?: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const MemoizedReviewCharacter = memo(ReviewCharacter);

export function ReviewWall({
  onNewReview,
  instagramHandle = "@laroll.om",
}: Props) {
  const [reviewList, setReviewList] = useState<Review[]>([]);
  const [spotlightReview, setSpotlightReview] = useState<Review | null>(null);
  const [recentlySpotlightedId, setRecentlySpotlightedId] = useState<
    number | null
  >(null);
  const [wallpaperUrl, setWallpaperUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Responsive limit state
  const [maxCharacters, setMaxCharacters] = useState(7);

  // Keep ref to avoid re-subscribing on prop change
  const onNewReviewRef = useRef(onNewReview);
  useEffect(() => {
    onNewReviewRef.current = onNewReview;
  }, [onNewReview]);

  // -----------------------------------------
  // RESPONSIVE SCREEN SIZE LISTENER
  // -----------------------------------------
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setMaxCharacters(3);
      } else {
        setMaxCharacters(7);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // -----------------------------------------
  // 5-SECOND SPOTLIGHT TIMER HANDLER
  // -----------------------------------------
  const triggerSpotlight = (review: Review) => {
    setSpotlightReview(review);
    setRecentlySpotlightedId(review.id);
    // Keep character in spotlight for 5 seconds
    setTimeout(() => {
      setSpotlightReview(null);
    }, 8000);
  };

  // -----------------------------------------
  // LOAD REVIEWS & SUBSCRIBE TO REALTIME
  // -----------------------------------------
  useEffect(() => {
    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Failed to fetch reviews:", error);
      } else if (data && data.length > 0) {
        const formattedReviews: Review[] = data.map((raw: any) => ({
          id: raw.id,
          name: raw.name,
          message: raw.message,
          avatar: raw.avatar,
          likes: raw.likes ?? 0,
          hearts: raw.hearts ?? 0,
          isBirthday: raw.is_birthday ?? raw.isBirthday ?? false,
          isChristmas: raw.is_christmas ?? raw.isChristmas ?? false,
          createdAt: raw.created_at ?? raw.createdAt,
        }));

        setReviewList(formattedReviews);

        // Trigger spotlight for initial latest review
        triggerSpotlight(formattedReviews[0]);
      }
      setIsLoading(false);
    };

    fetchReviews();

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
            isChristmas: raw.is_christmas ?? raw.isChristmas ?? false,
            createdAt: raw.created_at ?? raw.createdAt,
          };

          setReviewList((prevReviews) => {
            if (prevReviews.some((review) => review.id === newReview.id)) {
              return prevReviews;
            }
            return [newReview, ...prevReviews];
          });

          // Trigger 5-second spotlight for newly inserted review
          triggerSpotlight(newReview);
          onNewReviewRef.current?.();
        },
      )
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
                    isChristmas: raw.is_christmas ?? raw.isChristmas ?? false,
                    createdAt: raw.created_at ?? raw.createdAt,
                  }
                : review,
            ),
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // -----------------------------------------
  // WALLPAPER REALTIME
  // -----------------------------------------
  useEffect(() => {
    const loadWallpaper = async () => {
      const { data } = await supabase
        .from("wallpaper")
        .select("wallpaper_url")
        .limit(1)
        .maybeSingle();

      if (data?.wallpaper_url) setWallpaperUrl(data.wallpaper_url);
    };
    loadWallpaper();
  }, []);

  // Filter out spotlight review from background characters while centered
  const backgroundReviews = useMemo(() => {
    if (!spotlightReview) {
      return reviewList.slice(0, maxCharacters);
    }
    return reviewList
      .filter((r) => r.id !== spotlightReview.id)
      .slice(0, maxCharacters - 1);
  }, [reviewList, spotlightReview, maxCharacters]);

  return (
    <div className="relative h-full w-full p-0 md:px-8 md:pb-8">
      {/* CURVED SHOP STAGE */}
      <div className="relative h-full w-full overflow-hidden rounded-none border-y-2 border-black/80 bg-[#fffaf5] shadow-2xl md:rounded-[36px] md:border-2">
        {/* INSTAGRAM BADGE */}
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

        {/* BACKGROUND IMAGE */}
        <div
          className="absolute inset-0 pointer-events-none bg-[#F3CED5] bg-cover bg-bottom bg-no-repeat"
          style={{
            backgroundImage: wallpaperUrl
              ? `url("${wallpaperUrl}")`
              : undefined,
          }}
        />

        {/* ANIMATED CANVAS */}
        <div className="relative z-10 h-full w-full pointer-events-none">
          {!isLoading && (
            <>
              {/* 1. SPOTLIGHT REVIEW (STANDS IN CENTER FOR 5s) */}
              <AnimatePresence>
                {spotlightReview && (
                  <motion.div
                    key={`spotlight-${spotlightReview.id}`}
                    className="absolute left-1/2 -translate-x-1/2 pointer-events-auto z-40"
                    style={{ bottom: "12%" }}
                    initial={{ scale: 0, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{
                      opacity: 0,
                      scale: 0.8,
                      transition: { duration: 0.3 },
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 18,
                    }}
                  >
                    <MemoizedReviewCharacter
                      review={spotlightReview}
                      latest={true}
                      index={0}
                      newReview={true}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 2. BACKGROUND LOOPING REVIEWS */}
              {backgroundReviews.map((review, index) => (
                <MemoizedReviewCharacter
                  key={`bg-review-${review.id}`}
                  review={review}
                  latest={false}
                  index={index + 1}
                  newReview={review.id === recentlySpotlightedId}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
