"use client";

import { motion } from "framer-motion";
import { useState } from "react";
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
};

export function ReviewCharacter({ review, latest = false }: Props) {
  const [likes, setLikes] = useState(review.likes);
  const [hearts, setHearts] = useState(review.hearts);
  const [loading, setLoading] = useState<"like" | "heart" | null>(null);
  const [reaction, setReaction] = useState<"like" | "heart" | null>(null);

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reaction: selectedReaction,
        }),
      });

      if (!response.ok) {
        throw new Error("Reaction failed");
      }
    } catch {
      if (selectedReaction === "like") {
        setLikes((value) => Math.max(0, value - 1));
      } else {
        setHearts((value) => Math.max(0, value - 1));
      }
    } finally {
      setTimeout(() => {
        setReaction(null);
      }, 1000);

      setLoading(null);
    }
  }

  return (
    <motion.div
      className="relative flex w-full max-w-[230px] flex-col items-center justify-end"
      initial={
        latest ? { opacity: 0, y: 70, scale: 0.6 } : { opacity: 0, y: 30 }
      }
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: latest ? 0.8 : 0.5, ease: "easeOut" }}
    >
      {/* FEATURED / LATEST SHIMMER BADGE */}
      {latest && (
        <motion.div
          initial={{ opacity: 0, scale: 0, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            delay: 0.4,
            type: "spring",
            stiffness: 350,
            damping: 15,
          }}
          className="absolute -top-7 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full bg-gradient-to-r from-[#804222] via-[#503322] to-[#804222] px-3.5 py-1 text-[9px] font-black tracking-[0.2em] text-amber-200 shadow-lg ring-2 ring-amber-300/40"
        >
          <span className="animate-pulse text-[10px]">✨</span>
          <span>NEWEST</span>
        </motion.div>
      )}

      {/* SPEECH BUBBLE WITH GOLDEN HIGHLIGHT FOR LATEST */}
      <motion.div
        initial={{ opacity: latest ? 0 : 1, y: latest ? 12 : 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: latest ? 0.45 : 0, duration: 0.4 }}
        className="relative z-30 mb-2 w-full"
      >
        <div
          className={`relative rounded-[22px] border px-4 py-3 text-center transition-all ${
            latest
              ? "border-amber-400/60 bg-[#fffdf9] shadow-[0_8px_30px_rgba(217,119,6,0.25)] ring-2 ring-amber-300/50"
              : "border-[#503322]/10 bg-[#fffaf5] shadow-[0_6px_20px_rgba(80,51,34,0.12)]"
          }`}
        >
          <p className="line-clamp-3 break-words text-xs font-semibold leading-snug text-[#503322] sm:text-sm">
            {review.message}
          </p>

          {/* Bubble Tail */}
          <div
            className={`absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-r border-b ${
              latest
                ? "border-amber-400/60 bg-[#fffdf9]"
                : "border-[#503322]/10 bg-[#fffaf5]"
            }`}
          />
        </div>
      </motion.div>

      {/* AVATAR WITH SPOTLIGHT SHADOW FOR LATEST */}
      <div className="relative z-10 flex h-[135px] sm:h-[165px] w-full items-center justify-center">
        {latest && (
          <div className="absolute inset-x-4 bottom-2 top-4 -z-10 rounded-full bg-amber-400/20 blur-xl animate-pulse" />
        )}

        <Avatar
          type={review.avatar}
          size={latest ? 190 : 150}
          state={latest ? "new" : "idle"}
          reaction={reaction}
        />

        {/* REACTION EMOJI */}
        {reaction && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.5 }}
            animate={{ opacity: [0, 1, 1, 0], y: -70, scale: [0.5, 1.2, 1] }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="pointer-events-none absolute right-2 top-0 z-50 text-3xl"
          >
            {reaction === "heart" ? "❤️" : "👍"}
          </motion.div>
        )}
      </div>

      {/* AUTHOR & REACTION BUTTONS */}
      <div className="relative z-20 mt-1 flex flex-col items-center">
        <div
          className={`mb-1 max-w-[140px] truncate text-center text-xs font-bold ${
            latest
              ? "text-[#503322] underline decoration-amber-400 decoration-2 underline-offset-2"
              : "text-[#503322]"
          }`}
        >
          {review.name}
        </div>

        <div className="flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 shadow-md backdrop-blur">
          <button
            type="button"
            onClick={() => react("heart")}
            disabled={loading !== null}
            className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs transition hover:bg-pink-50 active:scale-90"
          >
            <span>❤️</span>
            <span className="font-medium text-[#503322]">{hearts}</span>
          </button>

          <button
            type="button"
            onClick={() => react("like")}
            disabled={loading !== null}
            className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs transition hover:bg-blue-50 active:scale-90"
          >
            <span>👍</span>
            <span className="font-medium text-[#503322]">{likes}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
