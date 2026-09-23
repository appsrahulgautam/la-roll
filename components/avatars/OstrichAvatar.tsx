"use client";

import { motion } from "framer-motion";

type Props = {
  size?: number;
  state?: "idle" | "selected" | "new";
  reaction?: "like" | "heart" | null;
  imagePath?: string;
};

export function OstrichAvatar({
  size = 95,
  state = "idle",
  reaction = null,
  imagePath = "/avatars/ostrich.png",
}: Props) {
  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{ width: size, height: size }}
    >
      <motion.div
        className="relative h-full w-full flex items-center justify-center"
        animate={{
          // Fast neck bobbing walk
          rotate: reaction ? [0, -8, 8, -4, 0] : [0, 2, -2, 0],
          y: state === "new" ? [0, -7, 0] : [0, -4, 1, -4, 0],
        }}
        transition={{
          rotate: {
            duration: reaction ? 0.4 : 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          },
          y: { duration: 0.45, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <motion.div
          className="relative h-full w-full flex items-center justify-center"
          animate={{ scaleY: [1, 1.03, 0.98, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <img
            src={imagePath}
            alt="Speedy Ostrich"
            className="h-full w-full object-contain pointer-events-none drop-shadow-md"
          />
        </motion.div>

        {reaction && (
          <motion.div
            className="absolute -top-1 left-1/2 -translate-x-1/2 font-bold text-xs bg-amber-100 text-[#503322] px-2 py-0.5 rounded-full border border-amber-300 shadow-sm whitespace-nowrap z-50"
            initial={{ opacity: 0, scale: 0.5, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            🦩🦩🦩🦩🦩
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
