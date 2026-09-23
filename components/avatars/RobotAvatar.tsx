"use client";

import { motion } from "framer-motion";

type Props = {
  size?: number;
  state?: "idle" | "selected" | "new";
  reaction?: "like" | "heart" | null;
  imagePath?: string;
};

export function RobotAvatar({
  size = 95,
  state = "idle",
  reaction = null,
  imagePath = "/avatars/robot.png",
}: Props) {
  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{ width: size, height: size }}
    >
      <motion.div
        className="relative h-full w-full flex items-center justify-center"
        animate={{
          // Rigid robotic stepping
          rotate: reaction ? [0, -5, 5, -3, 0] : [0, 1, 0, -1, 0],
          y: state === "new" ? [0, -4, 0] : [0, -2, 0, -2, 0],
        }}
        transition={{
          rotate: {
            duration: reaction ? 0.3 : 4,
            repeat: Infinity,
            ease: "linear",
          },
          y: { duration: 0.6, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <img
          src={imagePath}
          alt="Barista Robot"
          className="h-full w-full object-contain pointer-events-none drop-shadow-md"
        />

        {/* ANTENNA GLOW EFFECT */}
        <motion.div
          className="absolute top-[8%] left-[50%] -translate-x-1/2 h-2.5 w-2.5 rounded-full bg-cyan-300/80 blur-[2px]"
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        />

        {reaction && (
          <motion.div
            className="absolute -top-1 left-1/2 -translate-x-1/2 font-bold text-xs bg-cyan-100 text-[#503322] px-2 py-0.5 rounded-full border border-cyan-300 shadow-sm whitespace-nowrap z-50"
            initial={{ opacity: 0, scale: 0.5, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            🤖🤖🤖🤖🤖
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
