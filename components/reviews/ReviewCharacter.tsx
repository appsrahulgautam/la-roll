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
    const duration = 20 + ((index * 3) % 12);
    const bottomOffset = 8 + (index % 3) * 7;

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
      style={{ bottom: `${walkConfig.bottomOffset}%` }}
      initial={{
        x: isLTR ? "-25vw" : "125vw",
        opacity: 0,
      }}
      animate={{
        x: isLTR ? ["-25vw", "125vw"] : ["125vw", "-25vw"],
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: walkConfig.duration,
        repeat: Infinity,
        ease: "linear",
        delay: index * 1.8,
        times: [0, 0.05, 0.95, 1],
      }}
    >
      {/* LATEST MESSAGE BADGE */}
      {latest && (
        <div className="mb-1.5 rounded-full bg-[#503322] px-3 py-1 text-[9px] font-bold tracking-[0.2em] text-amber-200 shadow-md sm:text-[10px]">
          ✦ LATEST MESSAGE
        </div>
      )}

      {/* SPEECH BUBBLE */}
      <div className="relative z-30 mb-2 w-56 sm:w-72 md:w-80 lg:w-96">
        <div
          className={`relative rounded-[24px] border px-4 py-3.5 text-center shadow-xl backdrop-blur-md transition-all ${
            latest
              ? "border-amber-400 bg-[#fffdfa]/95 ring-2 ring-amber-300/60 shadow-[0_10px_25px_rgba(217,119,6,0.2)]"
              : "border-[#503322]/15 bg-[#fffaf5]/95 shadow-lg"
          }`}
        >
          <p className="line-clamp-3 break-words text-xs font-semibold leading-relaxed text-[#503322] sm:text-sm md:text-base">
            {review.message}
          </p>

          <div className="mt-2 flex items-center justify-between text-xs text-[#69422d]/80">
            <span className="truncate font-bold text-[#503322]">
              — {review.name}
            </span>
            <div className="flex gap-2 font-medium">
              <button
                type="button"
                onClick={() => react("heart")}
                disabled={loading !== null}
                className="flex items-center gap-1 rounded-full bg-pink-100/60 px-2 py-0.5 transition hover:scale-110 active:scale-95"
              >
                ❤️ <span>{hearts}</span>
              </button>
              <button
                type="button"
                onClick={() => react("like")}
                disabled={loading !== null}
                className="flex items-center gap-1 rounded-full bg-blue-100/60 px-2 py-0.5 transition hover:scale-110 active:scale-95"
              >
                👍 <span>{likes}</span>
              </button>
            </div>
          </div>

          <div className="absolute -bottom-2 left-1/2 h-3.5 w-3.5 -translate-x-1/2 rotate-45 border-b border-r border-[#503322]/15 bg-[#fffaf5]" />
        </div>
      </div>

      {/* AVATAR WRAPPER WITH UNIFIED HEIGHT */}
      <motion.div
        className="relative z-10 flex h-[130px] w-[130px] items-center justify-center sm:h-[150px] sm:w-[150px]"
        animate={{ y: [0, -8, 0] }}
        transition={{
          duration: 0.65,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ transform: isLTR ? "scaleX(1)" : "scaleX(-1)" }}
      >
        <Avatar
          type={review.avatar}
          size={140} // Uniform size for ALL avatars
          state={latest ? "new" : "idle"}
          reaction={reaction}
        />

        {/* REACTION EMOJI */}
        {reaction && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.5 }}
            animate={{ opacity: [0, 1, 0], y: -60, scale: [0.5, 1.3, 1] }}
            transition={{ duration: 1 }}
            className="pointer-events-none absolute -top-6 z-50 text-3xl sm:text-4xl"
          >
            {reaction === "heart" ? "❤️" : "👍"}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
