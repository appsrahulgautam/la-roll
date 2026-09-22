"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";

type Props = {
  size?: number;
  state?: "idle" | "new" | "selected";
  reaction?: "like" | "heart" | null;
};

type TurtleAction =
  | "idle"
  | "shellHide"
  | "slowPaddle"
  | "happyHop"
  | "flowerSpin";

export function Turtle({ size = 220, state = "idle", reaction = null }: Props) {
  const [blink, setBlink] = useState(false);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [action, setAction] = useState<TurtleAction>("idle");
  const [isTapped, setIsTapped] = useState(false);

  const isNew = state === "new";

  /* =========================================================
     1. EXAGGERATED FULL-BODY ACTION VARIANTS (BIGGER MOVEMENTS)
     ========================================================= */
  const bodyVariants: Variants = {
    idle: {
      y: isNew ? [0, -22, 0] : [0, -8, 0],
      x: 0,
      rotate: [0, -2, 2, 0],
      scale: [1, 1.03, 1],
      transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
    },
    slowPaddle: {
      x: [-20, 20, -20],
      y: [0, -10, 0, -10, 0],
      rotate: [-10, 10, -10],
      scaleX: [1, 1.06, 0.96, 1.06, 1],
      transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" },
    },
    shellHide: {
      y: [0, 12, 12, 0],
      rotate: [0, -6, 6, 0],
      scale: [1, 0.95, 0.95, 1],
      transition: { duration: 1.6, ease: "easeInOut" },
    },
    happyHop: {
      y: [0, -50, 0, -25, 0],
      scaleY: [1, 0.8, 1.2, 0.88, 1],
      scaleX: [1, 1.15, 0.88, 1.06, 1],
      rotate: [0, -16, 16, -5, 0],
      transition: { duration: 1.0, ease: "easeInOut" },
    },
    flowerSpin: {
      y: [0, -12, 0],
      rotate: [-8, 8, -8],
      scale: [1, 1.05, 1],
      transition: { duration: 1.3, ease: "easeInOut" },
    },
  };

  /* =========================================================
     2. RANDOM BLINKING & WIDE EYE LOOK-AROUND
     ========================================================= */
  useEffect(() => {
    let blinkTimeout: NodeJS.Timeout;
    let lookTimeout: NodeJS.Timeout;

    const blinkLoop = () => {
      blinkTimeout = setTimeout(
        () => {
          setBlink(true);
          setTimeout(() => {
            setBlink(false);
            blinkLoop();
          }, 110);
        },
        2200 + Math.random() * 3200,
      );
    };

    const lookLoop = () => {
      lookTimeout = setTimeout(
        () => {
          const directions = [
            { x: -5, y: 0 },
            { x: 5, y: 0 },
            { x: 0, y: -4 },
            { x: 0, y: 4 },
          ];
          const choice =
            directions[Math.floor(Math.random() * directions.length)];
          setEyeOffset(choice);
          lookLoop();
        },
        2200 + Math.random() * 2800,
      );
    };

    blinkLoop();
    lookLoop();

    return () => {
      clearTimeout(blinkTimeout);
      clearTimeout(lookTimeout);
    };
  }, []);

  /* =========================================================
     3. RANDOM ACTION CONTROLLER
     ========================================================= */
  useEffect(() => {
    let actionTimeout: NodeJS.Timeout;

    const actionLoop = () => {
      actionTimeout = setTimeout(
        () => {
          const actions: TurtleAction[] = [
            "slowPaddle",
            "shellHide",
            "happyHop",
            "flowerSpin",
            "idle",
          ];
          const nextAction =
            actions[Math.floor(Math.random() * actions.length)];
          setAction(nextAction);

          const duration =
            nextAction === "happyHop"
              ? 1400
              : nextAction === "shellHide"
                ? 2000
                : nextAction === "slowPaddle"
                  ? 2400
                  : 1600;

          setTimeout(() => {
            setAction("idle");
            actionLoop();
          }, duration);
        },
        3200 + Math.random() * 4200,
      );
    };

    actionLoop();

    return () => clearTimeout(actionTimeout);
  }, []);

  const handleTap = () => {
    if (isTapped) return;
    setIsTapped(true);
    setAction("happyHop");
    setTimeout(() => {
      setIsTapped(false);
      setAction("idle");
    }, 1100);
  };

  return (
    <div
      className="relative cursor-pointer select-none"
      style={{ width: size, height: size }}
      onClick={handleTap}
    >
      {/* REACTION EMOJIS */}
      {reaction === "heart" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.4, y: 20 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0.4, 1.5, 1, 1.2],
            y: -90,
          }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="pointer-events-none absolute left-1/2 top-1/4 z-30 -translate-x-1/2 text-4xl"
        >
          ❤️
        </motion.div>
      )}

      {reaction === "like" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.4, y: 20 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0.4, 1.4, 1, 1.2],
            y: -85,
          }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="pointer-events-none absolute left-1/2 top-1/4 z-30 -translate-x-1/2 text-4xl"
        >
          👍
        </motion.div>
      )}

      <motion.svg
        viewBox="0 0 220 220"
        className="h-full w-full overflow-visible"
      >
        {/* SHADOW */}
        <motion.ellipse
          cx="108"
          cy="198"
          rx="68"
          ry="11"
          fill="#503322"
          opacity="0.2"
          animate={{
            rx: action === "happyHop" ? [68, 28, 68] : [68, 56, 68],
            opacity: action === "happyHop" ? [0.2, 0.04, 0.2] : 0.2,
            scale: action === "slowPaddle" ? [1, 1.15, 1] : 1,
          }}
          transition={{ duration: 1.0, ease: "easeInOut" }}
        />

        {/* FULL BODY GROUP WITH DYNAMIC BIG ACTIONS */}
        <motion.g
          animate={action}
          variants={bodyVariants}
          style={{ transformOrigin: "108px 160px" }}
        >
          {/* BACK FEET */}
          <motion.ellipse
            cx="65"
            cy="176"
            rx="25"
            ry="12"
            fill="#9dbd72"
            stroke="#503322"
            strokeWidth="5"
            animate={{
              y:
                action === "slowPaddle"
                  ? [0, -6, 0]
                  : action === "happyHop"
                    ? [0, -14, 0]
                    : 0,
              x: action === "shellHide" ? [0, 12, 0] : 0,
            }}
            transition={{
              duration: action === "slowPaddle" ? 0.6 : 0.3,
              repeat: action === "slowPaddle" ? Infinity : 0,
            }}
          />

          {/* FRONT LEGS (PADDLING / HOPPING ACTION) */}
          <ellipse
            cx="53"
            cy="161"
            rx="25"
            ry="13"
            fill="#9dbd72"
            stroke="#503322"
            strokeWidth="5"
          />

          <motion.ellipse
            cx="165"
            cy="155"
            rx="27"
            ry="13"
            fill="#9dbd72"
            stroke="#503322"
            strokeWidth="5"
            animate={{
              rotate:
                action === "slowPaddle"
                  ? [-28, 22, -28]
                  : action === "happyHop"
                    ? [-35, 30, -35]
                    : [-5, 5, -5],
              x: action === "shellHide" ? [0, -20, 0] : 0,
            }}
            transition={{
              duration: action === "slowPaddle" ? 0.4 : 2.5,
              repeat: Infinity,
            }}
            style={{ transformOrigin: "165px 155px" }}
          />

          {/* SHELL BASE */}
          <ellipse
            cx="108"
            cy="126"
            rx="70"
            ry="55"
            fill="#78965a"
            stroke="#503322"
            strokeWidth="5"
          />

          {/* SHELL PATTERN */}
          <path
            d="M108 74 V178
               M53 126 H163
               M69 89 Q108 126 147 89
               M69 163 Q108 126 147 163"
            fill="none"
            stroke="#a8bd7d"
            strokeWidth="6"
          />

          {/* HEAD & NECK GROUP (HIDES IN SHELL OR HOPS) */}
          <motion.g
            animate={{
              x: action === "shellHide" ? [0, -38, 0] : [0, 2, 0],
              y: action === "shellHide" ? [0, 10, 0] : [0, -2, 0],
              rotate:
                action === "happyHop"
                  ? [-18, 18, -18]
                  : action === "flowerSpin"
                    ? [-12, 12, -12]
                    : [0, 2, 0],
            }}
            transition={{
              duration: action === "shellHide" ? 1.6 : 2.8,
              repeat: action === "shellHide" ? 0 : Infinity,
              ease: "easeInOut",
            }}
            style={{ transformOrigin: "164px 119px" }}
          >
            {/* HEAD BASE */}
            <circle
              cx="164"
              cy="119"
              r="31"
              fill="#9dbd72"
              stroke="#503322"
              strokeWidth="5"
            />

            {/* EYES (EXAGGERATED BLINK & LOOK) */}
            <motion.g
              animate={{
                scaleY: blink ? 0.08 : 1,
                x: eyeOffset.x,
                y: eyeOffset.y,
              }}
              transition={{
                scaleY: { duration: 0.08 },
                x: { duration: 0.25, ease: "easeOut" },
                y: { duration: 0.25, ease: "easeOut" },
              }}
              style={{ transformOrigin: "164.5px 112px" }}
            >
              <circle cx="154" cy="112" r="5" fill="#332119" />
              <circle cx="175" cy="112" r="5" fill="#332119" />

              {!blink && (
                <>
                  <circle cx="155.5" cy="110.5" r="1.8" fill="white" />
                  <circle cx="176.5" cy="110.5" r="1.8" fill="white" />
                </>
              )}
            </motion.g>

            {/* SMILE */}
            <path
              d={
                action === "happyHop" || action === "flowerSpin"
                  ? "M155 124 Q164 136 174 124"
                  : "M157 126 Q164 132 172 126"
              }
              fill="none"
              stroke="#503322"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </motion.g>

          {/* TINY FLOWER (SPINS & WIGGLES ON SHELL) */}
          <motion.g
            animate={{
              rotate:
                action === "flowerSpin"
                  ? [0, 360]
                  : action === "happyHop"
                    ? [-20, 20, -20]
                    : [-6, 6, -6],
              scale: action === "flowerSpin" ? [1, 1.3, 1] : 1,
            }}
            transition={{
              duration: action === "flowerSpin" ? 0.8 : 2.0,
              repeat: Infinity,
              ease: action === "flowerSpin" ? "linear" : "easeInOut",
            }}
            style={{ transformOrigin: "49px 83px" }}
          >
            <g transform="translate(49 83)">
              <circle cx="0" cy="-6" r="6" fill="#efaaa8" />
              <circle cx="6" cy="0" r="6" fill="#efaaa8" />
              <circle cx="0" cy="6" r="6" fill="#efaaa8" />
              <circle cx="-6" cy="0" r="6" fill="#efaaa8" />
              <circle cx="0" cy="0" r="4" fill="#f1bf55" />
            </g>
          </motion.g>
        </motion.g>
      </motion.svg>
    </div>
  );
}
