"use client";

import { motion } from "framer-motion";

type Props = {
  size?: number;
  state?: "idle" | "selected" | "new";
  reaction?: "like" | "heart" | null;
  imagePath?: string;
};

export function FoxAvatar({
  size = 95,
  state = "idle",
  reaction = null,
  imagePath = "/avatars/fox.png",
}: Props) {
  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{ width: size, height: size }}
    >
      <motion.div
        className="relative h-full w-full flex items-center justify-center"
        animate={{
          // Slow sleepy stroll
          rotate: reaction ? [0, -6, 6, -3, 0] : [0, -1, 0, 1, 0],
          y: state === "new" ? [0, -4, 0] : [0, -2, 0],
        }}
        transition={{
          rotate: {
            duration: reaction ? 0.6 : 4.5,
            repeat: Infinity,
            ease: "easeInOut",
          },
          y: { duration: 1.1, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <motion.div
          className="relative h-full w-full flex items-center justify-center"
          animate={{ scaleY: [1, 0.985, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <img
            src={imagePath}
            alt="Sleepy Fox"
            className="h-full w-full object-contain pointer-events-none drop-shadow-md"
          />
        </motion.div>

        {/* FLOATING SLEEPY ZZZ's */}
        <div className="absolute right-[15%] top-[15%] pointer-events-none">
          <motion.div
            className="text-[9px] font-bold text-orange-400/80"
            animate={{
              y: [-1, -14],
              x: [0, 4],
              opacity: [0, 1, 0],
              scale: [0.6, 1.1],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
          >
            zzz
          </motion.div>
        </div>

        {reaction && (
          <motion.div
            className="absolute -top-3 left-1/2 -translate-x-1/2 font-bold text-xs bg-orange-100 text-[#503322] px-2 py-0.5 rounded-full border border-orange-300 shadow-sm whitespace-nowrap z-50"
            initial={{ opacity: 0, scale: 0.5, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            🦊 Needs Coffee!
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
