"use client";

import { motion } from "framer-motion";

type Props = {
  size?: number;
  state?: "idle" | "selected" | "new";
  reaction?: "like" | "heart" | null;
  imagePath?: string;
};

export function BearAvatar({
  size = 95,
  state = "idle",
  reaction = null,
  imagePath = "/avatars/bear.png",
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
          // Gentle side-to-side sway with a cozy bounce
          rotate: reaction ? [0, -6, 6, -3, 0] : [0, -1.5, 0, 1.5, 0],
          y: state === "new" ? [0, -5, 0] : [0, -3, 0],
        }}
        transition={{
          rotate: {
            duration: reaction ? 0.5 : 3.5,
            repeat: Infinity,
            ease: "easeInOut",
          },
          y: {
            duration: 0.9,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      >
        {/* BREATHING & HAT TILT ANIMATION */}
        <motion.div
          className="relative h-full w-full flex items-center justify-center"
          animate={{
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* AVATAR IMAGE */}
          <img
            src={imagePath}
            alt="Coffee Bear"
            className="h-full w-full object-contain pointer-events-none drop-shadow-md"
          />
        </motion.div>

        {/* STEAM EMISSION FROM THE TOP OF THE COFFEE CUP */}
        <div className="absolute left-[49%] top-[50%] -translate-x-1/2 pointer-events-none">
          <motion.div
            className="h-1.5 w-1.5 rounded-full bg-amber-200/70 blur-[1px]"
            animate={{
              y: [-2, -16],
              x: [0, 2, -2],
              opacity: [0, 0.9, 0],
              scale: [0.5, 1.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        </div>

        {/* REACTION SIPPED COFFEE BUBBLE */}
        {reaction && (
          <motion.div
            className="absolute -top-1 left-1/2 -translate-x-1/2 font-bold text-xs bg-amber-100 text-[#503322] px-2 py-0.5 rounded-full border border-amber-300 shadow-sm whitespace-nowrap"
            initial={{ opacity: 0, scale: 0.5, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            🐻🐻🐻🐻
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
