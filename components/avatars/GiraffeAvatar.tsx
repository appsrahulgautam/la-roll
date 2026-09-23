"use client";

import { motion } from "framer-motion";

type Props = {
  size?: number;
  state?: "idle" | "selected" | "new";
  reaction?: "like" | "heart" | null;
  imagePath?: string;
};

export function GiraffeAvatar({
  size = 95,
  state = "idle",
  reaction = null,
  imagePath = "/avatars/giraffe.png",
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
          // Bicycle pedaling / rolling bounce movement
          rotate: reaction ? [0, -8, 8, -4, 0] : [0, 1.5, 0, -1.5, 0],
          y: state === "new" ? [0, -6, 0] : [0, -2, 1, -2, 0],
        }}
        transition={{
          rotate: {
            duration: reaction ? 0.5 : 3.5,
            repeat: Infinity,
            ease: "easeInOut",
          },
          y: {
            duration: 0.5, // Faster frequency to simulate bicycle bumps/pedaling
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      >
        {/* LONG NECK & OSSICONES SWAY */}
        <motion.div
          className="relative h-full w-full flex items-center justify-center"
          animate={{
            rotate: [-1, 1, -1],
            scaleY: [1, 1.02, 1, 0.99, 1],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* AVATAR IMAGE */}
          <img
            src={imagePath}
            alt="Giraffe Biker"
            className="h-full w-full object-contain pointer-events-none drop-shadow-md"
          />
        </motion.div>

        {/* FLOWER BASKET SPARKLE / PETAL EFFECT */}
        <div className="absolute left-[20%] top-[68%] pointer-events-none">
          <motion.div
            className="text-[8px] opacity-70"
            animate={{
              y: [-1, -10],
              x: [-2, 2],
              opacity: [0, 1, 0],
              scale: [0.6, 1],
            }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: "easeOut",
            }}
          >
            🌸
          </motion.div>
        </div>

        {/* REACTION POPUP */}
        {reaction && (
          <motion.div
            className="absolute -top-3 left-1/2 -translate-x-1/2 font-bold text-xs bg-sky-100 text-[#503322] px-2 py-0.5 rounded-full border border-sky-300 shadow-sm whitespace-nowrap z-50"
            initial={{ opacity: 0, scale: 0.5, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            🚲 Ring Ring!
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
