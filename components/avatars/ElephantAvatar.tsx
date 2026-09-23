"use client";

import { motion } from "framer-motion";

type Props = {
  size?: number;
  state?: "idle" | "selected" | "new";
  reaction?: "like" | "heart" | null;
  imagePath?: string;
};

export function ElephantAvatar({
  size = 95,
  state = "idle",
  reaction = null,
  imagePath = "/avatars/elephant.png",
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
          // Gentle heavy step bounce with wide ear sway
          rotate: reaction ? [0, -6, 6, -3, 0] : [0, 2, 0, -2, 0],
          y: state === "new" ? [0, -5, 0] : [0, -2.5, 0],
        }}
        transition={{
          rotate: {
            duration: reaction ? 0.5 : 3.8,
            repeat: Infinity,
            ease: "easeInOut",
          },
          y: {
            duration: 1.0, // Slightly slower heavy-footed walking pace
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      >
        {/* EAR FLAP & TRUNK SWAY SIMULATION */}
        <motion.div
          className="relative h-full w-full flex items-center justify-center"
          animate={{
            scaleX: [1, 1.025, 1, 0.985, 1],
            scaleY: [1, 0.985, 1, 1.015, 1],
          }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* AVATAR IMAGE */}
          <img
            src={imagePath}
            alt="Espresso Elephant"
            className="h-full w-full object-contain pointer-events-none drop-shadow-md"
          />
        </motion.div>

        {/* LATTE ART STEAM HEART RISING */}
        <div className="absolute left-[50%] top-[48%] -translate-x-1/2 pointer-events-none">
          <motion.div
            className="text-[10px] opacity-70"
            animate={{
              y: [-2, -18],
              x: [0, -3, 3],
              opacity: [0, 0.8, 0],
              scale: [0.5, 1.1],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeOut",
            }}
          >
            🤍
          </motion.div>
        </div>

        {/* REACTION POPUP */}
        {reaction && (
          <motion.div
            className="absolute -top-3 left-1/2 -translate-x-1/2 font-bold text-xs bg-emerald-100 text-[#503322] px-2 py-0.5 rounded-full border border-emerald-300 shadow-sm whitespace-nowrap"
            initial={{ opacity: 0, scale: 0.5, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            🐘 Espresso Love!
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
