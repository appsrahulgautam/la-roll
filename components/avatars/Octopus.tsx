"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";

type Props = {
  size?: number;
  state?: "idle" | "new" | "selected";
  reaction?: "like" | "heart" | null;
};

type OctopusAction =
  | "idle"
  | "jetSwim"
  | "wiggleDance"
  | "hatHop"
  | "tentacleWave";

export function Octopus({
  size = 220,
  state = "idle",
  reaction = null,
}: Props) {
  const [blink, setBlink] = useState(false);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [action, setAction] = useState<OctopusAction>("idle");
  const [isTapped, setIsTapped] = useState(false);

  const isNew = state === "new";

  /* =========================================================
     1. EXAGGERATED FULL-BODY ACTION VARIANTS (BIGGER MOVEMENTS)
     ========================================================= */
  const bodyVariants: Variants = {
    idle: {
      y: isNew ? [0, -25, 0] : [0, -12, 0],
      x: 0,
      rotate: [0, -4, 4, 0],
      scale: [1, 1.05, 1],
      transition: { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
    },
    jetSwim: {
      y: [0, -60, 0, -30, 0],
      x: [-20, 20, -20],
      scaleY: [1, 1.25, 0.8, 1.1, 1],
      scaleX: [1, 0.8, 1.2, 0.9, 1],
      rotate: [-15, 15, -15],
      transition: { duration: 1.1, ease: "easeInOut" },
    },
    wiggleDance: {
      x: [-35, 35, -35],
      y: [0, -15, 0, -15, 0],
      rotate: [-20, 20, -20],
      scale: [1, 1.1, 0.9, 1.1, 1],
      transition: { duration: 0.8, repeat: Infinity, ease: "easeInOut" },
    },
    hatHop: {
      y: [0, -40, 0],
      rotate: [0, -12, 12, 0],
      scale: [1, 1.15, 0.9, 1],
      transition: { duration: 0.85, ease: "easeInOut" },
    },
    tentacleWave: {
      y: [0, -15, 0],
      rotate: [-8, 8, -8],
      scale: [1, 1.06, 1],
      transition: { duration: 1.5, ease: "easeInOut" },
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
        1800 + Math.random() * 3200,
      );
    };

    const lookLoop = () => {
      lookTimeout = setTimeout(
        () => {
          const directions = [
            { x: -6, y: 0 },
            { x: 6, y: 0 },
            { x: 0, y: -5 },
            { x: 0, y: 4 },
          ];
          const choice =
            directions[Math.floor(Math.random() * directions.length)];
          setEyeOffset(choice);
          lookLoop();
        },
        2000 + Math.random() * 2500,
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
          const actions: OctopusAction[] = [
            "jetSwim",
            "wiggleDance",
            "hatHop",
            "tentacleWave",
            "idle",
          ];
          const nextAction =
            actions[Math.floor(Math.random() * actions.length)];
          setAction(nextAction);

          const duration =
            nextAction === "jetSwim"
              ? 1600
              : nextAction === "wiggleDance"
                ? 2200
                : nextAction === "hatHop"
                  ? 1400
                  : 1800;

          setTimeout(() => {
            setAction("idle");
            actionLoop();
          }, duration);
        },
        3500 + Math.random() * 4500,
      );
    };

    actionLoop();

    return () => clearTimeout(actionTimeout);
  }, []);

  const handleTap = () => {
    if (isTapped) return;
    setIsTapped(true);
    setAction("jetSwim");
    setTimeout(() => {
      setIsTapped(false);
      setAction("idle");
    }, 1200);
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
          cx="110"
          cy="204"
          rx="52"
          ry="10"
          fill="#503322"
          opacity="0.18"
          animate={{
            rx:
              action === "jetSwim" || action === "hatHop"
                ? [52, 20, 52]
                : [52, 42, 52],
            opacity:
              action === "jetSwim" || action === "hatHop"
                ? [0.18, 0.04, 0.18]
                : 0.18,
          }}
          transition={{ duration: 1.0, ease: "easeInOut" }}
        />

        {/* FULL BODY GROUP WITH DYNAMIC BIG ACTIONS */}
        <motion.g
          animate={action}
          variants={bodyVariants}
          style={{ transformOrigin: "110px 140px" }}
        >
          {/* TENTACLES (EXAGGERATED DYNAMIC SQUIGGLING & SWIMMING) */}
          <g>
            {/* Tentacle 1 (Leftmost) */}
            <motion.path
              d="M63 145 Q35 164 49 187 Q59 199 72 181"
              fill="none"
              stroke="#c97877"
              strokeWidth="18"
              strokeLinecap="round"
              animate={{
                rotate:
                  action === "wiggleDance"
                    ? [-30, 35, -30]
                    : action === "jetSwim"
                      ? [20, -45, 20]
                      : [-12, 18, -12],
                scaleY: action === "jetSwim" ? [1, 1.4, 1] : 1,
              }}
              transition={{
                duration:
                  action === "wiggleDance"
                    ? 0.35
                    : action === "jetSwim"
                      ? 0.6
                      : 1.5,
                repeat: Infinity,
              }}
              style={{ transformOrigin: "63px 145px" }}
            />

            {/* Tentacle 2 */}
            <motion.path
              d="M83 151 Q62 181 80 196 Q91 204 100 181"
              fill="none"
              stroke="#c97877"
              strokeWidth="18"
              strokeLinecap="round"
              animate={{
                rotate:
                  action === "wiggleDance"
                    ? [35, -30, 35]
                    : action === "jetSwim"
                      ? [25, -35, 25]
                      : [14, -18, 14],
              }}
              transition={{
                duration:
                  action === "wiggleDance"
                    ? 0.35
                    : action === "jetSwim"
                      ? 0.6
                      : 1.7,
                repeat: Infinity,
              }}
              style={{ transformOrigin: "83px 151px" }}
            />

            {/* Tentacle 3 */}
            <motion.path
              d="M112 151 Q110 185 127 197 Q140 201 141 178"
              fill="none"
              stroke="#c97877"
              strokeWidth="18"
              strokeLinecap="round"
              animate={{
                rotate:
                  action === "wiggleDance"
                    ? [-35, 30, -35]
                    : action === "jetSwim"
                      ? [-25, 35, -25]
                      : [-14, 18, -14],
              }}
              transition={{
                duration:
                  action === "wiggleDance"
                    ? 0.35
                    : action === "jetSwim"
                      ? 0.6
                      : 1.6,
                repeat: Infinity,
              }}
              style={{ transformOrigin: "112px 151px" }}
            />

            {/* Tentacle 4 (Rightmost) */}
            <motion.path
              d="M138 145 Q163 165 154 188 Q147 201 136 181"
              fill="none"
              stroke="#c97877"
              strokeWidth="18"
              strokeLinecap="round"
              animate={{
                rotate:
                  action === "wiggleDance"
                    ? [30, -35, 30]
                    : action === "jetSwim"
                      ? [-20, 45, -20]
                      : [12, -18, 12],
                scaleY: action === "jetSwim" ? [1, 1.4, 1] : 1,
              }}
              transition={{
                duration:
                  action === "wiggleDance"
                    ? 0.35
                    : action === "jetSwim"
                      ? 0.6
                      : 1.4,
                repeat: Infinity,
              }}
              style={{ transformOrigin: "138px 145px" }}
            />
          </g>

          {/* HEAD BASE */}
          <motion.path
            d="M53 105
               Q53 52 110 52
               Q167 52 167 105
               Q167 139 140 151
               Q110 164 80 151
               Q53 139 53 105Z"
            fill="#d88b8b"
            stroke="#503322"
            strokeWidth="5"
            animate={{
              scale: action === "jetSwim" ? [1, 1.08, 0.95, 1] : [1, 1.02, 1],
            }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "110px 105px" }}
          />

          {/* TINY HAT (ANIMATES & POPS ON HAT HOP) */}
          <motion.path
            d="M92 56 L100 34 L120 34 L128 56 Z"
            fill="#f1b3a8"
            stroke="#503322"
            strokeWidth="4"
            animate={{
              y:
                action === "hatHop"
                  ? [-25, 0]
                  : action === "jetSwim"
                    ? [-12, 0]
                    : [0, -3, 0],
              rotate:
                action === "hatHop"
                  ? [-360, 0]
                  : action === "wiggleDance"
                    ? [-15, 15, -15]
                    : [0, 4, 0],
            }}
            transition={{
              duration:
                action === "hatHop"
                  ? 0.85
                  : action === "wiggleDance"
                    ? 0.4
                    : 1.8,
              repeat: action === "wiggleDance" ? Infinity : 1,
            }}
            style={{ transformOrigin: "110px 45px" }}
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
            style={{ transformOrigin: "110px 102px" }}
          >
            {/* Eye Scleras */}
            <circle cx="89" cy="102" r="9" fill="#fff" />
            <circle cx="131" cy="102" r="9" fill="#fff" />

            {/* Eye Pupils */}
            <circle cx="90" cy="103" r="4" fill="#332119" />
            <circle cx="130" cy="103" r="4" fill="#332119" />

            {!blink && (
              <>
                <circle cx="92" cy="100.5" r="1.8" fill="white" />
                <circle cx="132" cy="100.5" r="1.8" fill="white" />
              </>
            )}
          </motion.g>

          {/* BLUSH CHEEKS */}
          <ellipse cx="76" cy="119" rx="11" ry="6" fill="#efaaa8" />
          <ellipse cx="144" cy="119" rx="11" ry="6" fill="#efaaa8" />

          {/* SMILE / EXPRESSION */}
          <path
            d={
              action === "jetSwim"
                ? "M92 118 Q110 138 128 118"
                : action === "wiggleDance"
                  ? "M94 116 Q110 134 126 116"
                  : "M94 120 Q110 136 126 120"
            }
            fill="none"
            stroke="#503322"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* SUCTION CUPS (WITH WIGGLE) */}
          <motion.g
            animate={{
              scale: action === "wiggleDance" ? [1, 1.3, 1] : 1,
            }}
            transition={{ duration: 0.3, repeat: Infinity }}
          >
            <circle cx="58" cy="177" r="3" fill="#f6c7c2" />
            <circle cx="75" cy="187" r="3" fill="#f6c7c2" />
            <circle cx="145" cy="187" r="3" fill="#f6c7c2" />
            <circle cx="159" cy="177" r="3" fill="#f6c7c2" />
          </motion.g>
        </motion.g>
      </motion.svg>
    </div>
  );
}
