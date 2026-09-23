"use client";

import { motion } from "framer-motion";

type Props = {
  size?: number;
  state?: "idle" | "selected" | "new";
  reaction?: "like" | "heart" | null;
  imagePath?: string;
};

export function LlamaAvatar({
  size = 95,
  state = "idle",
  reaction = null,
  imagePath = "/avatars/llama.png",
}: Props) {
  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{ width: size, height: size }}
    >
      <motion.div
        className="relative h-full w-full flex items-center justify-center"
        animate={{
          rotate: reaction ? [0, -6, 6, -3, 0] : [0, -1.5, 0, 1.5, 0],
          y: state === "new" ? [0, -5, 0] : [0, -3, 0],
        }}
        transition={{
          rotate: {
            duration: reaction ? 0.5 : 4,
            repeat: Infinity,
            ease: "easeInOut",
          },
          y: { duration: 0.9, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <motion.div
          className="relative h-full w-full flex items-center justify-center"
          animate={{ scaleY: [1, 1.03, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <img
            src={imagePath}
            alt="Latte Llama"
            className="h-full w-full object-contain pointer-events-none drop-shadow-md"
          />
        </motion.div>

        {/* FLUFFY FLOWER SPARKLE */}
        <div className="absolute right-[22%] top-[25%] pointer-events-none">
          <motion.div
            className="text-[9px] opacity-80"
            animate={{ y: [-2, -12], opacity: [0, 1, 0], scale: [0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          >
            🌸
          </motion.div>
        </div>

        {reaction && (
          <motion.div
            className="absolute -top-3 left-1/2 -translate-x-1/2 font-bold text-xs bg-pink-100 text-[#503322] px-2 py-0.5 rounded-full border border-pink-300 shadow-sm whitespace-nowrap z-50"
            initial={{ opacity: 0, scale: 0.5, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            🦙 No Llama Drama!
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
