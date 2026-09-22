"use client";

import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { Avatar } from "@/components/avatars/Avatar";

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
  review: Review;
  latest?: boolean;
  index: number;
};

export function ReviewCharacter({ review, latest = false, index }: Props) {
  const [likes, setLikes] = useState(review.likes);
  const [hearts, setHearts] = useState(review.hearts);
  const [loading, setLoading] = useState<"like" | "heart" | null>(null);
  const [reaction, setReaction] = useState<"like" | "heart" | null>(null);

  const walkConfig = useMemo(() => {
    const direction = index % 2 === 0 ? "ltr" : "rtl";
    const duration = 50 + ((index * 5) % 25);

    // Dynamic vertical lanes (4% to 22%) based on index to separate walking paths
    const bottomOffset = 4 + (index % 6) * 3.5;

    return { direction, duration, bottomOffset };
  }, [index]);

  const isLTR = walkConfig.direction === "ltr";

  async function react(selectedReaction: "like" | "heart") {
    if (loading) return;

    setLoading(selectedReaction);
    setReaction(selectedReaction);

    if (selectedReaction === "like") {
      setLikes((value) => value + 1);
    } else {
      setHearts((value) => value + 1);
    }

    try {
      const response = await fetch(`/api/reviews/${review.id}/reaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reaction: selectedReaction }),
      });

      if (!response.ok) throw new Error("Reaction failed");
    } catch {
      if (selectedReaction === "like") {
        setLikes((value) => Math.max(0, value - 1));
      } else {
        setHearts((value) => Math.max(0, value - 1));
      }
    } finally {
      setTimeout(() => setReaction(null), 1000);
      setLoading(null);
    }
  }

  return (
    <motion.div
      className="absolute flex flex-col items-center pointer-events-auto"
      style={{
        bottom: `${walkConfig.bottomOffset}%`,
        // Dynamic base z-index ensures items lower on screen sit in front naturally
        zIndex: Math.floor(100 - walkConfig.bottomOffset),
      }}
      initial={{
        x: isLTR ? "-30vw" : "130vw",
        opacity: 0,
      }}
      animate={{
        x: isLTR ? ["-30vw", "130vw"] : ["130vw", "-30vw"],
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: walkConfig.duration,
        repeat: Infinity,
        ease: "linear",
        delay: index * 4,
        times: [0, 0.05, 0.95, 1],
      }}
    >
      {/* LATEST MESSAGE BADGE */}
      {latest && (
        <div className="relative z-50 mb-1 rounded-full bg-[#503322] px-2 py-0.5 text-[7px] font-bold tracking-[0.18em] text-amber-200 shadow-md sm:text-[8px]">
          ✦ LATEST MESSAGE
        </div>
      )}

      {/* SPEECH BUBBLE - HIGH Z-INDEX (z-40) */}
      <div className="relative z-40 mb-1.5 flex justify-center">
        <div
          className={`relative inline-block w-fit min-w-[120px] max-w-[180px] sm:max-w-[220px] rounded-[16px] border px-2.5 py-1.5 text-center shadow-md backdrop-blur-md transition-all ${
            latest
              ? "border-amber-400 bg-[#fffdfa]/95 ring-2 ring-amber-300/50 shadow-[0_4px_14px_rgba(217,119,6,0.15)]"
              : "border-[#503322]/15 bg-[#fffaf5]/95 shadow-sm"
          }`}
        >
          <p className="line-clamp-2 break-words text-[10px] font-medium leading-tight text-[#503322] sm:text-xs">
            {review.message}
          </p>

          <div className="mt-1 flex items-center justify-between gap-2 text-[9px] text-[#69422d]/80 sm:text-[10px]">
            <span className="truncate font-bold text-[#503322]">
              — {review.name}
            </span>
            <div className="flex gap-1 font-medium">
              <button
                type="button"
                onClick={() => react("heart")}
                disabled={loading !== null}
                className="flex items-center gap-0.5 rounded-full bg-pink-100/60 px-1 py-0.2 transition hover:scale-105 active:scale-95"
              >
                ❤️ <span className="text-[8px] sm:text-[9px]">{hearts}</span>
              </button>
              <button
                type="button"
                onClick={() => react("like")}
                disabled={loading !== null}
                className="flex items-center gap-0.5 rounded-full bg-blue-100/60 px-1 py-0.2 transition hover:scale-105 active:scale-95"
              >
                👍 <span className="text-[8px] sm:text-[9px]">{likes}</span>
              </button>
            </div>
          </div>

          <div className="absolute -bottom-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-b border-r border-[#503322]/15 bg-[#fffaf5]" />
        </div>
      </div>

      {/* AVATAR - LOWER Z-INDEX (z-10) */}
      <motion.div
        className="relative z-10 flex h-[80px] w-[80px] items-center justify-center sm:h-[90px] sm:w-[90px]"
        animate={{ y: [0, -4, 0] }}
        transition={{
          duration: 1.1,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ transform: isLTR ? "scaleX(1)" : "scaleX(-1)" }}
      >
        <Avatar
          type={review.avatar}
          size={85}
          state={latest ? "new" : "idle"}
          reaction={reaction}
        />

        {reaction && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.5 }}
            animate={{ opacity: [0, 1, 0], y: -40, scale: [0.5, 1.2, 1] }}
            transition={{ duration: 1 }}
            className="pointer-events-none absolute -top-4 z-50 text-xl"
          >
            {reaction === "heart" ? "❤️" : "👍"}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
