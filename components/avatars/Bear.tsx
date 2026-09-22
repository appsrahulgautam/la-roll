"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";

type BearProps = {
  size?: number;
  state?: "idle" | "new" | "selected";
  reaction?: "like" | "heart" | null;
};

type BearAction = "idle" | "walking" | "jumping" | "waving" | "sipping";

export function Bear({
  size = 220,
  state = "idle",
  reaction = null,
}: BearProps) {
  const [blink, setBlink] = useState(false);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [action, setAction] = useState<BearAction>("idle");
  const [isTapped, setIsTapped] = useState(false);

  const isNew = state === "new";

  /* =========================================================
     1. EXAGGERATED BODY ANIMATION VARIANTS (BIGGER MOVEMENTS)
     ========================================================= */
  const bodyVariants: Variants = {
    idle: {
      y: isNew ? [0, -20, 0] : [0, -8, 0],
      x: 0,
      rotate: [0, -2, 2, 0],
      scale: [1, 1.03, 1],
      transition: { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
    },
    walking: {
      x: [-35, 35, -35],
      y: [0, -18, 0, -18, 0],
      rotate: [-12, 12, -12],
      scaleX: [1, 1.05, 0.95, 1.05, 1],
      transition: { duration: 1.1, repeat: Infinity, ease: "easeInOut" },
    },
    jumping: {
      y: [0, -65, 0, -30, 0],
      scaleY: [1, 0.75, 1.25, 0.85, 1],
      scaleX: [1, 1.2, 0.85, 1.1, 1],
      rotate: [0, -12, 12, -4, 0],
      transition: { duration: 1.0, ease: "easeInOut" },
    },
    waving: {
      y: [0, -10, 0],
      rotate: [-8, 6, -8],
      scale: [1, 1.04, 1],
      transition: { duration: 0.9, repeat: Infinity, ease: "easeInOut" },
    },
    sipping: {
      y: [0, 8, -6, 0],
      rotate: [0, -6, 2, 0],
      scaleY: [1, 0.96, 1.02, 1],
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
        2000 + Math.random() * 3200,
      );
    };

    const lookLoop = () => {
      lookTimeout = setTimeout(
        () => {
          const directions = [
            { x: -6, y: 0 },
            { x: 6, y: 0 },
            { x: 0, y: -5 },
            { x: 0, y: 5 },
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
          const actions: BearAction[] = [
            "walking",
            "jumping",
            "waving",
            "sipping",
            "idle",
          ];
          const nextAction =
            actions[Math.floor(Math.random() * actions.length)];
          setAction(nextAction);

          const duration =
            nextAction === "jumping"
              ? 1400
              : nextAction === "walking"
                ? 2400
                : nextAction === "waving"
                  ? 2000
                  : 2200;

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
    setAction("jumping");
    setTimeout(() => {
      setIsTapped(false);
      setAction("idle");
    }, 1200);
  };

  return (
    <div
      className="relative cursor-pointer select-none"
      style={{ width: size, height: size * 1.25 }}
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
          className="pointer-events-none absolute left-1/2 top-1/3 z-30 -translate-x-1/2 text-4xl"
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
          className="pointer-events-none absolute left-1/2 top-1/3 z-30 -translate-x-1/2 text-4xl"
        >
          👍
        </motion.div>
      )}

      {/* CHARACTER SVG CONTAINER */}
      <motion.svg
        viewBox="0 0 240 300"
        width={size}
        height={size * 1.25}
        className="overflow-visible"
      >
        {/* DYNAMIC SHADOW */}
        <motion.ellipse
          cx="120"
          cy="276"
          rx="63"
          ry="12"
          fill="#6b4736"
          opacity="0.18"
          animate={{
            rx: action === "jumping" ? [63, 24, 63] : [63, 76, 63],
            opacity: action === "jumping" ? [0.18, 0.04, 0.18] : 0.18,
            scaleX: action === "walking" ? [1, 1.2, 0.8, 1.2, 1] : 1,
          }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />

        {/* FULL BODY GROUP WITH EXAGGERATED ACTIONS */}
        <motion.g
          animate={action}
          variants={bodyVariants}
          style={{ transformOrigin: "120px 270px" }}
        >
          {/* LEFT ARM (HIGH WAVING OR WIDE WALKING SWING) */}
          <motion.g
            animate={{
              rotate:
                action === "waving"
                  ? [-15, -110, -35, -110, -15]
                  : action === "walking"
                    ? [45, -45, 45]
                    : action === "jumping"
                      ? [-40, 20, -40]
                      : [-4, 8, -4],
            }}
            transition={{
              duration:
                action === "waving" ? 1.2 : action === "walking" ? 0.55 : 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ transformOrigin: "73px 185px" }}
          >
            <path
              d="M76 178 C57 181 48 198 51 218 C53 232 64 239 75 232 C84 226 83 209 82 195 Z"
              fill="#9b674b"
              stroke="#563a2c"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </motion.g>

          {/* RIGHT ARM (BIG DRINKING ELEVATION OR COUNTER-WALK) */}
          <motion.g
            animate={{
              rotate:
                action === "sipping"
                  ? -75
                  : action === "walking"
                    ? [-45, 45, -45]
                    : action === "jumping"
                      ? [40, -20, 40]
                      : [4, -8, 4],
            }}
            transition={{
              duration:
                action === "sipping" ? 0.5 : action === "walking" ? 0.55 : 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ transformOrigin: "167px 185px" }}
          >
            <path
              d="M164 178 C183 181 192 198 189 218 C187 232 176 239 165 232 C156 226 157 209 158 195 Z"
              fill="#9b674b"
              stroke="#563a2c"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </motion.g>

          {/* TORSO */}
          <path
            d="M79 157 C89 145 103 139 120 139 C137 139 151 145 161 157 C173 174 176 220 164 243 C154 260 138 267 120 267 C102 267 86 260 76 243 C64 220 67 174 79 157 Z"
            fill="#9b674b"
            stroke="#563a2c"
            strokeWidth="6"
          />

          {/* BELLY */}
          <ellipse
            cx="120"
            cy="214"
            rx="48"
            ry="43"
            fill="#d69b79"
            opacity="0.95"
          />

          {/* FEET (BIG STEPPING & HOPPING MOVEMENTS) */}
          <motion.ellipse
            cx="93"
            cy="260"
            rx="28"
            ry="17"
            fill="#7d513b"
            stroke="#563a2c"
            strokeWidth="5"
            animate={{
              y:
                action === "walking"
                  ? [0, -18, 0]
                  : action === "jumping"
                    ? [0, -14, 0]
                    : 0,
              x: action === "walking" ? [0, -8, 0] : 0,
            }}
            transition={{
              duration: action === "walking" ? 0.28 : 0.4,
              repeat: action === "walking" ? Infinity : 0,
            }}
          />
          <motion.ellipse
            cx="147"
            cy="260"
            rx="28"
            ry="17"
            fill="#7d513b"
            stroke="#563a2c"
            strokeWidth="5"
            animate={{
              y:
                action === "walking"
                  ? [-18, 0, -18]
                  : action === "jumping"
                    ? [0, -14, 0]
                    : 0,
              x: action === "walking" ? [0, 8, 0] : 0,
            }}
            transition={{
              duration: action === "walking" ? 0.28 : 0.4,
              repeat: action === "walking" ? Infinity : 0,
            }}
          />

          {/* HEAD GROUP (EXAGGERATED TILT AND SQUASH) */}
          <motion.g
            animate={{
              rotate:
                action === "sipping"
                  ? -14
                  : action === "jumping"
                    ? [-10, 10, -10]
                    : action === "waving"
                      ? [-6, 6, -6]
                      : [-3, 3, -3],
              y: action === "sipping" ? [0, -4, 0] : 0,
            }}
            transition={{
              duration: action === "sipping" ? 0.5 : 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ transformOrigin: "120px 110px" }}
          >
            {/* LEFT EAR (DYNAMIC WIGGLE) */}
            <motion.g
              animate={{
                rotate:
                  action === "jumping"
                    ? [-25, 25, -25]
                    : action === "walking"
                      ? [-18, 18, -18]
                      : [0, -12, 0, -6, 0],
              }}
              transition={{
                duration: action === "walking" ? 0.3 : 2.5,
                repeat: Infinity,
              }}
              style={{ transformOrigin: "75px 66px" }}
            >
              <circle
                cx="75"
                cy="66"
                r="28"
                fill="#8d5d45"
                stroke="#563a2c"
                strokeWidth="6"
              />
              <circle cx="75" cy="66" r="14" fill="#d69b79" />
            </motion.g>

            {/* RIGHT EAR (DYNAMIC WIGGLE) */}
            <motion.g
              animate={{
                rotate:
                  action === "jumping"
                    ? [25, -25, 25]
                    : action === "walking"
                      ? [18, -18, 18]
                      : [0, 12, 0, 6, 0],
              }}
              transition={{
                duration: action === "walking" ? 0.3 : 2.8,
                repeat: Infinity,
                delay: 0.2,
              }}
              style={{ transformOrigin: "165px 66px" }}
            >
              <circle
                cx="165"
                cy="66"
                r="28"
                fill="#8d5d45"
                stroke="#563a2c"
                strokeWidth="6"
              />
              <circle cx="165" cy="66" r="14" fill="#d69b79" />
            </motion.g>

            {/* HEAD BASE */}
            <ellipse
              cx="120"
              cy="108"
              rx="67"
              ry="66"
              fill="#9b674b"
              stroke="#563a2c"
              strokeWidth="6"
            />

            {/* MUZZLE */}
            <ellipse cx="120" cy="135" rx="38" ry="29" fill="#d69b79" />

            {/* EYES (EXAGGERATED LOOK & BLINK) */}
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
              style={{ transformOrigin: "120px 106px" }}
            >
              <ellipse cx="94" cy="105" rx="7" ry="10" fill="#3c2921" />
              <ellipse cx="146" cy="105" rx="7" ry="10" fill="#3c2921" />

              {!blink && (
                <>
                  <circle cx="96" cy="102" r="2.5" fill="white" />
                  <circle cx="148" cy="102" r="2.5" fill="white" />
                </>
              )}
            </motion.g>

            {/* NOSE */}
            <ellipse cx="120" cy="130" rx="13" ry="9" fill="#3c2921" />

            {/* EXPRESSIVE SMILE */}
            <path
              d={
                action === "sipping"
                  ? "M114 145 C118 138 122 138 126 145"
                  : action === "jumping" || action === "waving"
                    ? "M102 140 C113 162 127 162 138 140"
                    : "M106 144 C113 153 127 153 134 144"
              }
              fill="none"
              stroke="#3c2921"
              strokeWidth="5"
              strokeLinecap="round"
            />

            {/* ROSY CHEEKS */}
            <ellipse
              cx="88"
              cy="132"
              rx="10"
              ry="5"
              fill="#eaa99b"
              opacity="0.75"
            />
            <ellipse
              cx="152"
              cy="132"
              rx="10"
              ry="5"
              fill="#eaa99b"
              opacity="0.75"
            />
          </motion.g>

          {/* COFFEE CUP DRINKING ANIMATION (RAISES ALL THE WAY TO MUZZLE) */}
          <motion.g
            animate={{
              y: action === "sipping" ? -58 : 0,
              x: action === "sipping" ? -4 : 0,
              rotate: action === "sipping" ? -18 : [-2, 2, -2],
            }}
            transition={{
              duration: action === "sipping" ? 0.5 : 2.8,
              repeat: action === "sipping" ? 0 : Infinity,
              ease: "easeInOut",
            }}
            style={{ transformOrigin: "120px 190px" }}
          >
            <rect
              x="101"
              y="178"
              width="38"
              height="29"
              rx="7"
              fill="#fff8f1"
              stroke="#563a2c"
              strokeWidth="4"
            />

            <path
              d="M139 185 C153 182 153 201 139 198"
              fill="none"
              stroke="#563a2c"
              strokeWidth="4"
            />

            {/* COFFEE LIQUID */}
            <rect x="106" y="181" width="28" height="8" rx="4" fill="#70452f" />

            {/* ANIMATED STEAM PUFFS */}
            <motion.path
              d="M112 174 C106 166 118 162 112 154"
              fill="none"
              stroke="#fff"
              strokeWidth="3"
              strokeLinecap="round"
              animate={{
                opacity: action === "sipping" ? [1, 0] : [0.2, 0.8, 0.2],
                y: action === "sipping" ? -16 : [2, -4, 2],
              }}
              transition={{
                duration: action === "sipping" ? 0.5 : 2,
                repeat: action === "sipping" ? 0 : Infinity,
              }}
            />

            <motion.path
              d="M126 174 C120 166 132 162 126 154"
              fill="none"
              stroke="#fff"
              strokeWidth="3"
              strokeLinecap="round"
              animate={{
                opacity: action === "sipping" ? [1, 0] : [0.2, 0.8, 0.2],
                y: action === "sipping" ? -18 : [0, -5, 0],
              }}
              transition={{
                duration: action === "sipping" ? 0.5 : 2.3,
                repeat: action === "sipping" ? 0 : Infinity,
                delay: action === "sipping" ? 0.1 : 0.4,
              }}
            />
          </motion.g>
        </motion.g>
      </motion.svg>
    </div>
  );
}
