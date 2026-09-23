"use client";

import { motion } from "framer-motion";

type Props = {
  size?: number;
  state?: "idle" | "selected" | "new";
  reaction?: "like" | "heart" | null;
  imagePath?: string;
};

export function FrogAvatar({
  size = 95,
  state = "idle",
  reaction = null,
  imagePath = "/avatars/frog.png",
}: Props) {
  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{ width: size, height: size }}
    >
      <motion.div
        className="relative h-full w-full flex items-center justify-center"
        animate={{
          rotate: reaction ? [0, -10, 10, -5, 0] : [0, 3, -3, 0],
          // Springy hop motion
          y: state === "new" ? [0, -8, 0] : [0, -5, 0, -2, 0],
        }}
        transition={{
          rotate: {
            duration: reaction ? 0.4 : 3,
            repeat: Infinity,
            ease: "easeInOut",
          },
          y: { duration: 0.75, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <motion.div
          className="relative h-full w-full flex items-center justify-center"
          animate={{ scaleY: [1, 0.96, 1.04, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <img
            src={imagePath}
            alt="Matcha Frog"
            className="h-full w-full object-contain pointer-events-none drop-shadow-md"
          />
        </motion.div>

        {reaction && (
          <motion.div
            className="absolute -top-3 left-1/2 -translate-x-1/2 font-bold text-xs bg-green-100 text-[#503322] px-2 py-0.5 rounded-full border border-green-300 shadow-sm whitespace-nowrap z-50"
            initial={{ opacity: 0, scale: 0.5, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            🐸 Sip Green!
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
