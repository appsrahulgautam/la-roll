"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";

type Props = {
  size?: number;
  state?: "idle" | "new" | "selected";
  reaction?: "like" | "heart" | null;
};

type DeerAction = "idle" | "walking" | "prancing" | "waving" | "sniffing";

export function Deer({ size = 220, state = "idle", reaction = null }: Props) {
  const [blink, setBlink] = useState(false);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [action, setAction] = useState<DeerAction>("idle");
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
    walking: {
      x: [-32, 32, -32],
      y: [0, -18, 0, -18, 0],
      rotate: [-10, 10, -10],
      scaleX: [1, 1.05, 0.95, 1.05, 1],
      transition: { duration: 1.1, repeat: Infinity, ease: "easeInOut" },
    },
    prancing: {
      y: [0, -68, 0, -32, 0],
      scaleY: [1, 0.72, 1.25, 0.82, 1],
      scaleX: [1, 1.2, 0.82, 1.12, 1],
      rotate: [0, -14, 14, -5, 0],
      transition: { duration: 0.95, ease: "easeInOut" },
    },
    waving: {
      y: [0, -12, 0],
      rotate: [-8, 6, -8],
      scale: [1, 1.04, 1],
      transition: { duration: 0.9, repeat: Infinity, ease: "easeInOut" },
    },
    sniffing: {
      y: [0, 18, -6, 0],
      rotate: [0, 14, 14, 0],
      scaleY: [1, 0.94, 1.02, 1],
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
        2200 + Math.random() * 3800,
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
        2800 + Math.random() * 3200,
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
          const actions: DeerAction[] = [
            "walking",
            "prancing",
            "waving",
            "sniffing",
            "idle",
          ];
          const nextAction =
            actions[Math.floor(Math.random() * actions.length)];
          setAction(nextAction);

          const duration =
            nextAction === "prancing"
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
        3800 + Math.random() * 4800,
      );
    };

    actionLoop();

    return () => clearTimeout(actionTimeout);
  }, []);

  const handleTap = () => {
    if (isTapped) return;
    setIsTapped(true);
    setAction("prancing");
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
          cx="110"
          cy="204"
          rx="52"
          ry="9"
          fill="#503322"
          opacity="0.18"
          animate={{
            rx: action === "prancing" ? [52, 20, 52] : [52, 66, 52],
            opacity: action === "prancing" ? [0.18, 0.04, 0.18] : 0.18,
            scaleX: action === "walking" ? [1, 1.25, 0.75, 1.25, 1] : 1,
          }}
          transition={{ duration: 0.95, ease: "easeInOut" }}
        />

        {/* FULL BODY GROUP WITH EXAGGERATED ACTIONS */}
        <motion.g
          animate={action}
          variants={bodyVariants}
          style={{ transformOrigin: "110px 190px" }}
        >
          {/* LEGS (EXAGGERATED STEPPING & PRANCING ANIMATIONS) */}
          <motion.path
            d="M76 174 L72 199"
            stroke="#503322"
            strokeWidth="8"
            strokeLinecap="round"
            animate={{
              d:
                action === "walking"
                  ? [
                      "M76 174 L72 199",
                      "M76 174 L54 185",
                      "M76 174 L82 198",
                      "M76 174 L72 199",
                    ]
                  : action === "prancing"
                    ? ["M76 174 L72 199", "M76 174 L58 182", "M76 174 L72 199"]
                    : "M76 174 L72 199",
            }}
            transition={{
              duration: action === "walking" ? 0.28 : 0.4,
              repeat: action === "walking" ? Infinity : 0,
            }}
          />
          <motion.path
            d="M144 174 L148 199"
            stroke="#503322"
            strokeWidth="8"
            strokeLinecap="round"
            animate={{
              d:
                action === "walking"
                  ? [
                      "M144 174 L148 199",
                      "M144 174 L166 185",
                      "M144 174 L138 198",
                      "M144 174 L148 199",
                    ]
                  : action === "prancing"
                    ? [
                        "M144 174 L148 199",
                        "M144 174 L162 182",
                        "M144 174 L148 199",
                      ]
                    : "M144 174 L148 199",
            }}
            transition={{
              duration: action === "walking" ? 0.28 : 0.4,
              repeat: action === "walking" ? Infinity : 0,
            }}
          />

          {/* NECK / BODY */}
          <path
            d="M72 145 Q110 127 148 145 L157 181 Q110 198 63 181 Z"
            fill="#d99a70"
            stroke="#503322"
            strokeWidth="5"
          />

          {/* CHEST */}
          <path
            d="M92 143 Q110 153 128 143 L133 181 Q110 188 87 181 Z"
            fill="#f8dfc4"
          />

          {/* HIGH WAVING HOOF / LEG EXTENSION */}
          {action === "waving" && (
            <motion.path
              d="M148 150 C168 130 185 105 178 85"
              fill="none"
              stroke="#503322"
              strokeWidth="7"
              strokeLinecap="round"
              animate={{ rotate: [-20, 25, -20] }}
              transition={{
                duration: 0.45,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ transformOrigin: "148px 150px" }}
            />
          )}

          {/* HEAD & ANTLERS GROUP (BIGGER TILTS & SNIFF DIP) */}
          <motion.g
            animate={{
              rotate:
                action === "sniffing"
                  ? 28
                  : action === "prancing"
                    ? [-12, 12, -12]
                    : action === "waving"
                      ? [-8, 8, -8]
                      : [-3, 3, -3],
              y: action === "sniffing" ? 14 : 0,
            }}
            transition={{
              duration: action === "sniffing" ? 0.6 : 2.5,
              repeat: action === "sniffing" ? 0 : Infinity,
              ease: "easeInOut",
            }}
            style={{ transformOrigin: "110px 105px" }}
          >
            {/* ANTLERS (BIG GER SWAY) */}
            <motion.path
              d="M79 67 C58 49 59 30 47 22
                 M59 39 L43 34
                 M62 49 L49 57
                 M140 67 C161 49 160 30 172 22
                 M161 39 L177 34
                 M158 49 L171 57"
              fill="none"
              stroke="#795033"
              strokeWidth="7"
              strokeLinecap="round"
              animate={{
                rotate:
                  action === "prancing"
                    ? [-18, 18, -18]
                    : action === "walking"
                      ? [-10, 10, -10]
                      : [0, 4, 0],
              }}
              transition={{ duration: 0.35, repeat: Infinity }}
              style={{ transformOrigin: "110px 67px" }}
            />

            {/* LEFT EAR (DYNAMIC TWITCH & FLUTTER) */}
            <motion.ellipse
              cx="68"
              cy="72"
              rx="27"
              ry="14"
              transform="rotate(-25 68 72)"
              fill="#d99a70"
              stroke="#503322"
              strokeWidth="5"
              animate={{
                rotate:
                  action === "prancing"
                    ? [-25, -50, -25]
                    : action === "walking"
                      ? [-25, -42, -25]
                      : [-25, -40, -25, -30, -25],
              }}
              transition={{
                duration: action === "walking" ? 0.3 : 2.8,
                repeat: Infinity,
              }}
              style={{ transformOrigin: "68px 72px" }}
            />

            {/* RIGHT EAR (DYNAMIC TWITCH & FLUTTER) */}
            <motion.ellipse
              cx="152"
              cy="72"
              rx="27"
              ry="14"
              transform="rotate(25 152 72)"
              fill="#d99a70"
              stroke="#503322"
              strokeWidth="5"
              animate={{
                rotate:
                  action === "prancing"
                    ? [25, 50, 25]
                    : action === "walking"
                      ? [25, 42, 25]
                      : [25, 40, 25, 30, 25],
              }}
              transition={{
                duration: action === "walking" ? 0.3 : 3.0,
                repeat: Infinity,
                delay: 0.15,
              }}
              style={{ transformOrigin: "152px 72px" }}
            />

            {/* HEAD BASE */}
            <ellipse
              cx="110"
              cy="105"
              rx="48"
              ry="45"
              fill="#d99a70"
              stroke="#503322"
              strokeWidth="5"
            />

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
              style={{ transformOrigin: "110px 103px" }}
            >
              <circle cx="94" cy="103" r="5" fill="#38251b" />
              <circle cx="126" cy="103" r="5" fill="#38251b" />

              {!blink && (
                <>
                  <circle cx="95.5" cy="101.5" r="1.8" fill="white" />
                  <circle cx="127.5" cy="101.5" r="1.8" fill="white" />
                </>
              )}
            </motion.g>

            {/* WHITE MUZZLE */}
            <ellipse cx="110" cy="123" rx="27" ry="19" fill="#f8dfc4" />

            {/* NOSE (TWITCHES INTENSIFIED WHILE SNIFFING) */}
            <motion.ellipse
              cx="110"
              cy="118"
              rx="7"
              ry="5"
              fill="#503322"
              animate={{
                scale: action === "sniffing" ? [1, 1.45, 1] : 1,
                y: action === "sniffing" ? [0, -2, 0] : 0,
              }}
              transition={{
                duration: 0.18,
                repeat: action === "sniffing" ? Infinity : 0,
              }}
            />

            {/* MOUTH / SMILE */}
            <path
              d={
                action === "prancing" || action === "waving"
                  ? "M100 124 Q110 138 120 124"
                  : "M103 127 Q110 134 117 127"
              }
              fill="none"
              stroke="#503322"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* FLOWER ACCENT (FLUTTERS ON PRANCING) */}
            <motion.g
              transform="translate(143 76)"
              animate={{
                rotate:
                  action === "prancing"
                    ? [-25, 25, -25]
                    : action === "walking"
                      ? [-12, 12, -12]
                      : [0, 6, 0],
                scale: action === "prancing" ? [1, 1.25, 1] : 1,
              }}
              transition={{
                duration: action === "prancing" ? 0.4 : 1.5,
                repeat: Infinity,
              }}
              style={{ transformOrigin: "143px 76px" }}
            >
              <circle cx="0" cy="-7" r="7" fill="#efaaa8" />
              <circle cx="7" cy="0" r="7" fill="#efaaa8" />
              <circle cx="0" cy="7" r="7" fill="#efaaa8" />
              <circle cx="-7" cy="0" r="7" fill="#efaaa8" />
              <circle cx="0" cy="0" r="5" fill="#f3c45d" />
            </motion.g>
          </motion.g>
        </motion.g>
      </motion.svg>
    </div>
  );
}
