"use client";

import { motion } from "framer-motion";

type Props = {
  size?: number;
  state?: "idle" | "selected" | "new";
  reaction?: "like" | "heart" | null;
  imagePath?: string;
};

export function BunnyAvatar({
  size = 95,
  state = "idle",
  reaction = null,
  imagePath = "/avatars/bunny.png",
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
          // Idle sway / tilt + walking bounce
          rotate: reaction ? [0, -8, 8, -4, 0] : [0, 2, 0, -2, 0],
          y: state === "new" ? [0, -6, 0] : [0, -3, 0],
        }}
        transition={{
          rotate: {
            duration: reaction ? 0.6 : 4,
            repeat: Infinity,
            ease: "easeInOut",
          },
          y: {
            duration: 0.8,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      >
        {/* EAR FLOOP ANIMATION OVERLAY */}
        <motion.div
          className="relative h-full w-full flex items-center justify-center"
          animate={{
            scaleY: [1, 1.03, 1, 0.98, 1],
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
            alt="Bunny Barista"
            className="h-full w-full object-contain pointer-events-none drop-shadow-md"
          />
        </motion.div>

        {/* STEAM EMISSION FOR COFFEE CUP */}
        <div className="absolute left-[30%] top-[45%] pointer-events-none">
          <motion.div
            className="h-1.5 w-1.5 rounded-full bg-amber-200/60 blur-[1px]"
            animate={{
              y: [-2, -14],
              x: [0, -3, 2],
              opacity: [0, 0.8, 0],
              scale: [0.6, 1.2],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        </div>

        {/* COFFEE CUP WAVE / BOUNCE ON REACTION */}
        {reaction && (
          <motion.div
            className="absolute -top-1 left-1/2 -translate-x-1/2 font-bold text-xs bg-amber-100 text-[#503322] px-2 py-0.5 rounded-full border border-amber-300 shadow-sm"
            initial={{ opacity: 0, scale: 0.5, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            ☕☕☕☕☕☕
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
