"use client";

import { motion } from "framer-motion";

type Props = {
  size?: number;
  state?: "idle" | "selected" | "new";
  reaction?: "like" | "heart" | null;
  imagePath?: string;
};

export function CatAvatar({
  size = 95,
  state = "idle",
  reaction = null,
  imagePath = "/avatars/cat.png",
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
          // Cool swagger sway with confident walk bounce
          rotate: reaction ? [0, -7, 7, -4, 0] : [0, 1.5, 0, -1.5, 0],
          y: state === "new" ? [0, -5, 0] : [0, -3, 0],
        }}
        transition={{
          rotate: {
            duration: reaction ? 0.5 : 3.2,
            repeat: Infinity,
            ease: "easeInOut",
          },
          y: {
            duration: 0.85,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      >
        {/* CONFIDENT HEAD TILT & BREATHING */}
        <motion.div
          className="relative h-full w-full flex items-center justify-center"
          animate={{
            scale: [1, 1.015, 1],
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
            alt="Cool Cat Barista"
            className="h-full w-full object-contain pointer-events-none drop-shadow-md"
          />
        </motion.div>

        {/* TAIL SWISH EFFECT OVERLAY */}
        <motion.div
          className="absolute bottom-[20%] right-[12%] pointer-events-none h-3 w-3 rounded-full bg-purple-300/20 blur-[2px]"
          animate={{
            x: [0, 4, 0, -2, 0],
            scale: [0.8, 1.1, 0.8],
          }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* REACTION COOL CAT POPUP */}
        {reaction && (
          <motion.div
            className="absolute -top-1 left-1/2 -translate-x-1/2 font-bold text-xs bg-slate-100 text-[#503322] px-2 py-0.5 rounded-full border border-slate-300 shadow-sm whitespace-nowrap"
            initial={{ opacity: 0, scale: 0.5, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            😼😼😼😼
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
