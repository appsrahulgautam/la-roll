"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";

type Props = {
  size?: number;
  state?: "idle" | "new" | "selected";
  reaction?: "like" | "heart" | null;
};

type HedgehogAction = "idle" | "waddling" | "curled" | "waving" | "sniffing";

export function Hedgehog({
  size = 220,
  state = "idle",
  reaction = null,
}: Props) {
  const [blink, setBlink] = useState(false);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [action, setAction] = useState<HedgehogAction>("idle");
  const [isTapped, setIsTapped] = useState(false);

  const isNew = state === "new";

  /* =========================================================
     1. EXAGGERATED FULL-BODY ACTION VARIANTS (BIGGER MOVEMENTS)
     ========================================================= */
  const bodyVariants: Variants = {
    idle: {
      y: isNew ? [0, -20, 0] : [0, -7, 0],
      x: 0,
      rotate: [0, -3, 3, 0],
      scale: [1, 1.04, 1],
      transition: { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
    },
    waddling: {
      x: [-30, 30, -30],
      y: [0, -16, 0, -16, 0],
      rotate: [-14, 14, -14],
      scaleX: [1, 1.08, 0.92, 1.08, 1],
      transition: { duration: 0.85, repeat: Infinity, ease: "easeInOut" },
    },
    curled: {
      y: [0, -65, 0, -28, 0],
      scale: [1, 0.72, 1.22, 0.86, 1],
      rotate: [0, -180, -360, -360, -360],
      transition: { duration: 1.1, ease: "easeInOut" },
    },
    waving: {
      y: [0, -10, 0],
      rotate: [-10, 8, -10],
      scale: [1, 1.05, 1],
      transition: { duration: 0.85, repeat: Infinity, ease: "easeInOut" },
    },
    sniffing: {
      y: [0, 16, -6, 0],
      rotate: [0, 12, 12, 0],
      scaleY: [1, 0.93, 1.03, 1],
      transition: { duration: 2.0, ease: "easeInOut" },
    },
  };

  /* =========================================================
     2. RANDOM BLINKING & EYE LOOK-AROUND
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
        2000 + Math.random() * 3500,
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
        2600 + Math.random() * 3400,
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
          const actions: HedgehogAction[] = [
            "waddling",
            "curled",
            "waving",
            "sniffing",
            "idle",
          ];
          const nextAction =
            actions[Math.floor(Math.random() * actions.length)];
          setAction(nextAction);

          const duration =
            nextAction === "curled"
              ? 1600
              : nextAction === "waddling"
                ? 2400
                : nextAction === "waving"
                  ? 2000
                  : 2200;

          setTimeout(() => {
            setAction("idle");
            actionLoop();
          }, duration);
        },
        3800 + Math.random() * 4800,
      );
    };

    actionLoop();

    return () => clearTimeout(actionTimeout);
  }, []);

  const handleTap = () => {
    if (isTapped) return;
    setIsTapped(true);
    setAction("curled");
    setTimeout(() => {
      setIsTapped(false);
      setAction("idle");
    }, 1300);
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
            scale: [0.4, 1.4, 1, 1.2],
            y: -95,
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
            scale: [0.4, 1.3, 1, 1.15],
            y: -90,
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
        {/* DYNAMIC SHADOW */}
        <motion.ellipse
          cx="108"
          cy="192"
          rx="52"
          ry="9"
          fill="#503322"
          opacity="0.18"
          animate={{
            rx: action === "curled" ? [52, 18, 52] : [52, 68, 52],
            opacity: action === "curled" ? [0.18, 0.04, 0.18] : 0.18,
            scaleX: action === "waddling" ? [1, 1.28, 0.72, 1.28, 1] : 1,
          }}
          transition={{ duration: 0.85, ease: "easeInOut" }}
        />

        {/* FULL BODY GROUP WITH EXAGGERATED ACTIONS */}
        <motion.g
          animate={action}
          variants={bodyVariants}
          style={{ transformOrigin: "108px 183px" }}
        >
          {/* FEET (EXAGGERATED STEPPING & WADDLE MOVEMENTS) */}
          <motion.ellipse
            cx="78"
            cy="183"
            rx="18"
            ry="9"
            fill="#b8754c"
            stroke="#503322"
            strokeWidth="4"
            animate={{
              y:
                action === "waddling"
                  ? [0, -18, 0]
                  : action === "curled"
                    ? [0, -12, 0]
                    : 0,
              x: action === "waddling" ? [0, -10, 0] : 0,
            }}
            transition={{
              duration: action === "waddling" ? 0.22 : 0.35,
              repeat: action === "waddling" ? Infinity : 0,
            }}
          />
          <motion.ellipse
            cx="139"
            cy="183"
            rx="18"
            ry="9"
            fill="#b8754c"
            stroke="#503322"
            strokeWidth="4"
            animate={{
              y:
                action === "waddling"
                  ? [-18, 0, -18]
                  : action === "curled"
                    ? [0, -12, 0]
                    : 0,
              x: action === "waddling" ? [0, 10, 0] : 0,
            }}
            transition={{
              duration: action === "waddling" ? 0.22 : 0.35,
              repeat: action === "waddling" ? Infinity : 0,
            }}
          />

          {/* SPIKES (QUILLS WITH HIGH REACTION/PULSE) */}
          <motion.path
            d="M43 133
               L27 119 L47 116
               L30 96 L54 101
               L43 77 L67 88
               L67 61 L86 79
               L98 54 L108 80
               L130 61 L132 88
               L156 77 L147 103
               L175 99 L155 119
               L174 132 L148 139
               L157 161 L133 153
               L128 177 L108 158
               L91 177 L85 153
               L61 161 L69 140 Z"
            fill="#8b5a3c"
            stroke="#503322"
            strokeWidth="5"
            strokeLinejoin="round"
            animate={{
              scale:
                action === "sniffing"
                  ? [1, 1.08, 1]
                  : action === "waddling"
                    ? [1, 1.05, 0.96, 1]
                    : [1, 1.02, 1],
              rotate: action === "waddling" ? [-4, 4, -4] : 0,
            }}
            transition={{
              duration:
                action === "sniffing"
                  ? 0.3
                  : action === "waddling"
                    ? 0.45
                    : 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ transformOrigin: "108px 125px" }}
          />

          {/* FACE / BODY */}
          <ellipse
            cx="103"
            cy="132"
            rx="66"
            ry="55"
            fill="#d89b68"
            stroke="#503322"
            strokeWidth="5"
          />

          {/* BELLY */}
          <ellipse cx="110" cy="151" rx="37" ry="29" fill="#f7d7b4" />

          {/* EXAGGERATED WAVING PAW */}
          {action === "waving" && (
            <motion.ellipse
              cx="48"
              cy="112"
              rx="15"
              ry="9"
              fill="#d89b68"
              stroke="#503322"
              strokeWidth="4"
              animate={{ rotate: [-35, 45, -35] }}
              transition={{
                duration: 0.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ transformOrigin: "65px 122px" }}
            />
          )}

          {/* EAR (EXAGGERATED FLUTTER) */}
          <motion.g
            animate={{
              rotate:
                action === "waddling"
                  ? [-18, 18, -18]
                  : action === "curled"
                    ? [-25, 25, -25]
                    : [0, -16, 0, -8, 0],
            }}
            transition={{
              duration: action === "waddling" ? 0.3 : 3.2,
              repeat: Infinity,
            }}
            style={{ transformOrigin: "69px 99px" }}
          >
            <circle
              cx="69"
              cy="99"
              r="15"
              fill="#d89b68"
              stroke="#503322"
              strokeWidth="5"
            />
            <circle cx="69" cy="99" r="7" fill="#e9a5a6" />
          </motion.g>

          {/* EYES (WITH BLINK & LOOK-AROUND) */}
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
            style={{ transformOrigin: "108px 119px" }}
          >
            <circle cx="91" cy="119" r="5" fill="#38251b" />
            <circle cx="128" cy="119" r="5" fill="#38251b" />

            {!blink && (
              <>
                <circle cx="92.5" cy="117.5" r="1.8" fill="white" />
                <circle cx="129.5" cy="117.5" r="1.8" fill="white" />
              </>
            )}
          </motion.g>

          {/* CHEEKS */}
          <ellipse
            cx="82"
            cy="132"
            rx="10"
            ry="6"
            fill="#efaaa8"
            opacity=".7"
          />
          <ellipse
            cx="137"
            cy="132"
            rx="10"
            ry="6"
            fill="#efaaa8"
            opacity=".7"
          />

          {/* NOSE (TWITCHES INTENSIFIED WHILE SNIFFING) */}
          <motion.ellipse
            cx="110"
            cy="130"
            rx="7"
            ry="5"
            fill="#38251b"
            animate={{
              scale: action === "sniffing" ? [1, 1.5, 1] : 1,
              y: action === "sniffing" ? [0, -3, 0] : 0,
            }}
            transition={{
              duration: 0.18,
              repeat: action === "sniffing" ? Infinity : 0,
            }}
          />

          {/* SMILE */}
          <path
            d={
              action === "curled" || action === "waving"
                ? "M100 133 Q110 148 120 133"
                : "M103 137 Q110 144 117 137"
            }
            fill="none"
            stroke="#503322"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* LEAF (ATTACHED TO BODY WITH DYNAMIC WIND FLUTTER) */}
          <motion.path
            d="M56 157 Q43 147 38 158 Q48 166 58 161"
            fill="#8aa85b"
            stroke="#503322"
            strokeWidth="3"
            animate={{
              rotate:
                action === "waddling"
                  ? [-28, 28, -28]
                  : action === "curled"
                    ? [-35, 35, -35]
                    : [-8, 14, -8],
              scale: action === "curled" ? [1, 1.2, 1] : 1,
            }}
            transition={{
              duration: action === "waddling" ? 0.35 : 1.8,
              repeat: Infinity,
            }}
            style={{ transformOrigin: "56px 157px" }}
          />
        </motion.g>
      </motion.svg>
    </div>
  );
}
