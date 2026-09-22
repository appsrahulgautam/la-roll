"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";

type Props = {
  size?: number;
  state?: "idle" | "new" | "selected";
  reaction?: "like" | "heart" | null;
};

type SquirrelAction =
  | "idle"
  | "tailFlick"
  | "acornMunch"
  | "nuttyHop"
  | "earTwitch";

export function Squirrel({
  size = 220,
  state = "idle",
  reaction = null,
}: Props) {
  const [blink, setBlink] = useState(false);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [action, setAction] = useState<SquirrelAction>("idle");
  const [isTapped, setIsTapped] = useState(false);

  const isNew = state === "new";

  /* =========================================================
     1. EXAGGERATED FULL-BODY ACTION VARIANTS (BIGGER MOVEMENTS)
     ========================================================= */
  const bodyVariants: Variants = {
    idle: {
      y: isNew ? [0, -22, 0] : [0, -10, 0],
      x: 0,
      rotate: [0, -3, 3, 0],
      scale: [1, 1.04, 1],
      transition: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
    },
    tailFlick: {
      x: [-26, 26, -26],
      y: [0, -12, 0, -12, 0],
      rotate: [-14, 14, -14],
      scaleX: [1, 1.08, 0.94, 1.08, 1],
      transition: { duration: 0.6, repeat: Infinity, ease: "easeInOut" },
    },
    acornMunch: {
      y: [0, 8, -6, 8, 0],
      rotate: [0, 14, -10, 14, 0],
      scale: [1, 1.06, 0.96, 1.06, 1],
      transition: { duration: 1.1, repeat: Infinity, ease: "easeInOut" },
    },
    nuttyHop: {
      y: [0, -60, 0, -30, 0],
      scaleY: [1, 0.75, 1.25, 0.85, 1],
      scaleX: [1, 1.18, 0.85, 1.08, 1],
      rotate: [0, -20, 20, -8, 0],
      transition: { duration: 0.95, ease: "easeInOut" },
    },
    earTwitch: {
      y: [0, -14, 0],
      rotate: [-10, 10, -10],
      scale: [1, 1.06, 1],
      transition: { duration: 1.2, ease: "easeInOut" },
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
        1800 + Math.random() * 3000,
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
          const actions: SquirrelAction[] = [
            "tailFlick",
            "acornMunch",
            "nuttyHop",
            "earTwitch",
            "idle",
          ];
          const nextAction =
            actions[Math.floor(Math.random() * actions.length)];
          setAction(nextAction);

          const duration =
            nextAction === "nuttyHop"
              ? 1400
              : nextAction === "acornMunch"
                ? 2200
                : nextAction === "tailFlick"
                  ? 2000
                  : 1500;

          setTimeout(() => {
            setAction("idle");
            actionLoop();
          }, duration);
        },
        3000 + Math.random() * 4000,
      );
    };

    actionLoop();

    return () => clearTimeout(actionTimeout);
  }, []);

  const handleTap = () => {
    if (isTapped) return;
    setIsTapped(true);
    setAction("nuttyHop");
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
          cy="204"
          rx="52"
          ry="10"
          fill="#503322"
          opacity="0.2"
          animate={{
            rx: action === "nuttyHop" ? [52, 20, 52] : [52, 42, 52],
            opacity: action === "nuttyHop" ? [0.2, 0.04, 0.2] : 0.2,
            scale: action === "tailFlick" ? [1, 1.2, 1] : 1,
          }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
        />

        {/* FULL BODY GROUP WITH DYNAMIC BIG ACTIONS */}
        <motion.g
          animate={action}
          variants={bodyVariants}
          style={{ transformOrigin: "103px 188px" }}
        >
          {/* HUGE FLUFFY TAIL (FLICKS & PUFFS UP) */}
          <motion.g
            animate={{
              rotate:
                action === "tailFlick" || action === "nuttyHop"
                  ? [-40, 45, -40]
                  : [-8, 18, -8],
              scale: action === "tailFlick" ? [1, 1.25, 1] : 1,
            }}
            transition={{
              duration:
                action === "tailFlick" || action === "nuttyHop" ? 0.25 : 1.2,
              repeat: Infinity,
            }}
            style={{ transformOrigin: "151px 163px" }}
          >
            <path
              d="M151 163
                 Q195 158 192 115
                 Q189 70 158 75
                 Q184 51 158 43
                 Q131 36 133 77
                 Q107 58 103 83
                 Q108 119 139 132"
              fill="#c47b43"
              stroke="#503322"
              strokeWidth="6"
              strokeLinejoin="round"
            />
            {/* Tail inner highlight */}
            <path
              d="M150 130 Q174 112 166 83"
              fill="none"
              stroke="#e6a66e"
              strokeWidth="10"
              strokeLinecap="round"
            />
          </motion.g>

          {/* BODY */}
          <ellipse
            cx="103"
            cy="151"
            rx="45"
            ry="52"
            fill="#c47b43"
            stroke="#503322"
            strokeWidth="5"
          />

          {/* BELLY */}
          <ellipse cx="106" cy="158" rx="26" ry="34" fill="#f1c39a" />

          {/* FEET (STEPPING / HOPPING ACTION) */}
          <motion.ellipse
            cx="82"
            cy="199"
            rx="18"
            ry="9"
            fill="#a9663d"
            animate={{
              y:
                action === "tailFlick"
                  ? [0, -10, 0]
                  : action === "nuttyHop"
                    ? [0, -16, 0]
                    : 0,
              rotate: action === "tailFlick" ? [-12, 12, -12] : 0,
            }}
            transition={{
              duration: 0.2,
              repeat: action === "tailFlick" ? Infinity : 0,
            }}
          />
          <motion.ellipse
            cx="126"
            cy="199"
            rx="18"
            ry="9"
            fill="#a9663d"
            animate={{
              y:
                action === "tailFlick"
                  ? [-10, 0, -10]
                  : action === "nuttyHop"
                    ? [0, -16, 0]
                    : 0,
              rotate: action === "tailFlick" ? [12, -12, 12] : 0,
            }}
            transition={{
              duration: 0.2,
              repeat: action === "tailFlick" ? Infinity : 0,
            }}
          />

          {/* ACORN WITH NIBBLING ANIMATION */}
          <motion.g
            animate={{
              rotate:
                action === "acornMunch"
                  ? [-20, 20, -20]
                  : action === "nuttyHop"
                    ? [-15, 15, -15]
                    : [-3, 3, -3],
              scale: action === "acornMunch" ? [1, 1.2, 1] : 1,
              y: action === "acornMunch" ? [0, -5, 0] : 0,
            }}
            transition={{
              duration: action === "acornMunch" ? 0.3 : 1.2,
              repeat: Infinity,
            }}
            style={{ transformOrigin: "62px 157px" }}
          >
            <ellipse
              cx="62"
              cy="157"
              rx="13"
              ry="17"
              fill="#a9663d"
              stroke="#503322"
              strokeWidth="4"
            />
            <path
              d="M51 149 Q62 142 73 149"
              fill="none"
              stroke="#503322"
              strokeWidth="4"
            />
            <path
              d="M62 142 Q64 136 69 134"
              fill="none"
              stroke="#503322"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </motion.g>

          {/* HEAD & FACE GROUP */}
          <motion.g
            animate={{
              rotate:
                action === "earTwitch"
                  ? [-16, 16, -16]
                  : action === "nuttyHop"
                    ? [-12, 12, 0]
                    : [-3, 3, -3],
            }}
            transition={{
              duration: action === "earTwitch" ? 0.6 : 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ transformOrigin: "101px 91px" }}
          >
            {/* EARS (TWITCHING & FLOPPING) */}
            <motion.g
              animate={{
                rotate:
                  action === "nuttyHop"
                    ? [-25, 25, -25]
                    : action === "earTwitch"
                      ? [10, -25, 10]
                      : [0, 8, 0],
                scale: action === "earTwitch" ? [1, 1.15, 1] : 1,
              }}
              transition={{ duration: 0.3, repeat: Infinity }}
              style={{ transformOrigin: "80px 53px" }}
            >
              <path
                d="M72 66 L68 39 Q87 46 91 67"
                fill="#c47b43"
                stroke="#503322"
                strokeWidth="5"
              />
              <path
                d="M75 53 Q81 55 85 63"
                fill="none"
                stroke="#efaaa0"
                strokeWidth="5"
              />
            </motion.g>

            <motion.g
              animate={{
                rotate:
                  action === "nuttyHop"
                    ? [25, -25, 25]
                    : action === "earTwitch"
                      ? [-10, 25, -10]
                      : [0, -8, 0],
                scale: action === "earTwitch" ? [1, 1.15, 1] : 1,
              }}
              transition={{ duration: 0.3, repeat: Infinity, delay: 0.1 }}
              style={{ transformOrigin: "131px 53px" }}
            >
              <path
                d="M126 66 L137 40 Q149 57 136 74"
                fill="#c47b43"
                stroke="#503322"
                strokeWidth="5"
              />
            </motion.g>

            {/* HEAD BASE */}
            <circle
              cx="101"
              cy="91"
              r="42"
              fill="#c47b43"
              stroke="#503322"
              strokeWidth="5"
            />

            {/* CHEEKS */}
            <ellipse
              cx="78"
              cy="105"
              rx="10"
              ry="6"
              fill="#efaaa0"
              opacity=".7"
            />
            <ellipse
              cx="125"
              cy="105"
              rx="10"
              ry="6"
              fill="#efaaa0"
              opacity=".7"
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
              style={{ transformOrigin: "101px 91px" }}
            >
              <circle cx="88" cy="91" r="5" fill="#38251b" />
              <circle cx="116" cy="91" r="5" fill="#38251b" />

              {!blink && (
                <>
                  <circle cx="89.5" cy="89.5" r="1.8" fill="white" />
                  <circle cx="117.5" cy="89.5" r="1.8" fill="white" />
                </>
              )}
            </motion.g>

            {/* NOSE (SNIFFING / TWITCHING) */}
            <motion.circle
              cx="102"
              cy="103"
              r="5"
              fill="#38251b"
              animate={{
                scale:
                  action === "earTwitch" || action === "acornMunch"
                    ? [1, 1.35, 1]
                    : [1, 1.1, 1],
              }}
              transition={{ duration: 0.18, repeat: Infinity }}
            />

            {/* SMILE */}
            <path
              d={
                action === "nuttyHop"
                  ? "M93 106 Q102 118 112 106"
                  : "M95 108 Q102 116 110 108"
              }
              fill="none"
              stroke="#503322"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </motion.g>
        </motion.g>
      </motion.svg>
    </div>
  );
}
