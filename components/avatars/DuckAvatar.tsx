"use client";

import { motion } from "framer-motion";

type Props = {
  size?: number;
  state?: "idle" | "selected" | "new";
  reaction?: "like" | "heart" | null;
  imagePath?: string;
};

export function DuckAvatar({
  size = 95,
  state = "idle",
  reaction = null,
  imagePath = "/avatars/duck.png",
}: Props) {
  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{ width: size, height: size }}
    >
      {/* MAIN ANIMATED CONTAINER */}
      <motion.div
        className="relative h-full w-full flex items-center justify-center"
        animate={{
          // Energetic duck waddle with higher frequency side-to-side rotation
          rotate: reaction ? [0, -10, 10, -5, 0] : [0, 3, -3, 3, 0],
          y: state === "new" ? [0, -6, 0] : [0, -4, 0],
        }}
        transition={{
          rotate: {
            duration: reaction ? 0.4 : 2.4,
            repeat: Infinity,
            ease: "easeInOut",
          },
          y: {
            duration: 0.6,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      >
        {/* BERET & BEAK BOUNCE OVERLAY */}
        <motion.div
          className="relative h-full w-full flex items-center justify-center"
          animate={{
            scaleY: [1, 1.03, 0.98, 1],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* AVATAR IMAGE */}
          <img
            src={imagePath}
            alt="Barista Duck"
            className="h-full w-full object-contain pointer-events-none drop-shadow-md"
          />
        </motion.div>

        {/* REACTION QUACK BUBBLE POPUP */}
        {reaction && (
          <motion.div
            className="absolute -top-3 left-1/2 -translate-x-1/2 font-bold text-xs bg-yellow-100 text-[#503322] px-2 py-0.5 rounded-full border border-yellow-300 shadow-sm whitespace-nowrap"
            initial={{ opacity: 0, scale: 0.5, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            🦆 Quacktastic!
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
