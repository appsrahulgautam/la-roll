"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";

type Props = {
  size?: number;
  state?: "idle" | "new" | "selected";
  reaction?: "like" | "heart" | null;
};

type MouseAction = "idle" | "scurrying" | "bigHop" | "nibbling" | "sniffing";

export function Mouse({ size = 220, state = "idle", reaction = null }: Props) {
  const [blink, setBlink] = useState(false);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [action, setAction] = useState<MouseAction>("idle");
  const [isTapped, setIsTapped] = useState(false);

  const isNew = state === "new";

  /* =========================================================
     1. EXAGGERATED FULL-BODY ACTION VARIANTS (BIGGER MOVEMENTS)
     ========================================================= */
  const bodyVariants: Variants = {
    idle: {
      y: isNew ? [0, -20, 0] : [0, -10, 0],
      x: 0,
      rotate: [0, -2, 2, 0],
      scale: [1, 1.04, 1],
      transition: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
    },
    scurrying: {
      x: [-35, 35, -35],
      y: [0, -15, 0, -15, 0],
      rotate: [-12, 12, -12],
      scaleX: [1, 1.08, 1],
      transition: { duration: 0.7, repeat: Infinity, ease: "easeInOut" },
    },
    bigHop: {
      y: [0, -55, 0, -25, 0],
      scaleY: [1, 0.75, 1.2, 0.88, 1],
      scaleX: [1, 1.15, 0.88, 1.08, 1],
      rotate: [0, -18, 18, -6, 0],
      transition: { duration: 0.9, ease: "easeInOut" },
    },
    nibbling: {
      y: [0, 8, -4, 8, 0],
      rotate: [0, 15, -10, 15, 0],
      scale: [1, 1.06, 0.96, 1.06, 1],
      transition: { duration: 1.1, repeat: Infinity, ease: "easeInOut" },
    },
    sniffing: {
      y: [0, 16, 16, 0],
      rotate: [0, 18, -12, 0],
      scale: [1, 1.05, 1],
      transition: { duration: 1.6, ease: "easeInOut" },
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
            { x: 0, y: 3 },
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
          const actions: MouseAction[] = [
            "scurrying",
            "bigHop",
            "nibbling",
            "sniffing",
            "idle",
          ];
          const nextAction =
            actions[Math.floor(Math.random() * actions.length)];
          setAction(nextAction);

          const duration =
            nextAction === "bigHop"
              ? 1400
              : nextAction === "scurrying"
                ? 2200
                : nextAction === "nibbling"
                  ? 2000
                  : 1800;

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
    setAction("bigHop");
    setTimeout(() => {
      setIsTapped(false);
      setAction("idle");
    }, 1000);
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
          rx="50"
          ry="10"
          fill="#503322"
          opacity="0.2"
          animate={{
            rx: action === "bigHop" ? [50, 20, 50] : [50, 40, 50],
            opacity: action === "bigHop" ? [0.2, 0.04, 0.2] : 0.2,
            scale: action === "scurrying" ? [1, 1.2, 1] : 1,
          }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
        />

        {/* FULL BODY GROUP WITH DYNAMIC BIG ACTIONS */}
        <motion.g
          animate={action}
          variants={bodyVariants}
          style={{ transformOrigin: "108px 190px" }}
        >
          {/* WILD TAIL (WHIPS WITH DYNAMIC MOVEMENTS) */}
          <motion.path
            d="M145 168 Q192 177 190 135 Q188 117 170 120"
            fill="none"
            stroke="#9c7567"
            strokeWidth="8"
            strokeLinecap="round"
            animate={{
              rotate:
                action === "bigHop"
                  ? [-35, 40, -35]
                  : action === "scurrying"
                    ? [-30, 30, -30]
                    : [-15, 20, -15],
              scale: action === "bigHop" ? [1, 1.25, 1] : 1,
            }}
            transition={{
              duration:
                action === "scurrying" || action === "bigHop" ? 0.35 : 1.1,
              repeat: Infinity,
            }}
            style={{ transformOrigin: "145px 168px" }}
          />

          {/* BODY */}
          <ellipse
            cx="108"
            cy="157"
            rx="44"
            ry="49"
            fill="#b99082"
            stroke="#503322"
            strokeWidth="5"
          />

          {/* BELLY */}
          <ellipse cx="108" cy="163" rx="25" ry="30" fill="#ead4c9" />

          {/* FEET (BIG STEPPING / HOPPING ACTION) */}
          <motion.ellipse
            cx="83"
            cy="199"
            rx="19"
            ry="9"
            fill="#9c7567"
            stroke="#503322"
            strokeWidth="3"
            animate={{
              y:
                action === "scurrying"
                  ? [0, -12, 0]
                  : action === "bigHop"
                    ? [0, -18, 0]
                    : 0,
              rotate: action === "scurrying" ? [-15, 15, -15] : 0,
            }}
            transition={{
              duration: 0.2,
              repeat: action === "scurrying" ? Infinity : 0,
            }}
          />
          <motion.ellipse
            cx="133"
            cy="199"
            rx="19"
            ry="9"
            fill="#9c7567"
            stroke="#503322"
            strokeWidth="3"
            animate={{
              y:
                action === "scurrying"
                  ? [-12, 0, -12]
                  : action === "bigHop"
                    ? [0, -18, 0]
                    : 0,
              rotate: action === "scurrying" ? [15, -15, 15] : 0,
            }}
            transition={{
              duration: 0.2,
              repeat: action === "scurrying" ? Infinity : 0,
            }}
          />

          {/* EXAGGERATED CHEESE DANCE */}
          <motion.g
            animate={{
              rotate:
                action === "nibbling"
                  ? [-25, 25, -25]
                  : action === "bigHop"
                    ? [-15, 15, -15]
                    : [-6, 6, -6],
              scale: action === "nibbling" ? [1, 1.2, 1] : 1,
              y: action === "nibbling" ? [0, -8, 0] : 0,
            }}
            transition={{
              duration: action === "nibbling" ? 0.3 : 1.2,
              repeat: Infinity,
            }}
            style={{ transformOrigin: "160px 160px" }}
          >
            <path
              d="M151 150 L178 162 L151 177 Z"
              fill="#f0c85b"
              stroke="#503322"
              strokeWidth="4"
            />
            <circle cx="160" cy="164" r="3" fill="#d89c3f" />
            <circle cx="169" cy="168" r="3" fill="#d89c3f" />
          </motion.g>

          {/* HEAD & EARS GROUP */}
          <motion.g
            animate={{
              rotate:
                action === "sniffing"
                  ? [0, 20, -15, 0]
                  : action === "bigHop"
                    ? [-12, 12, 0]
                    : [-4, 4, -4],
            }}
            transition={{
              duration: action === "sniffing" ? 0.8 : 2.2,
              repeat: action === "sniffing" ? Infinity : Infinity,
              ease: "easeInOut",
            }}
            style={{ transformOrigin: "108px 94px" }}
          >
            {/* BIG EAR TWITCHES */}
            <motion.g
              animate={{
                rotate: action === "bigHop" ? [-25, 25, -25] : [-12, 14, -12],
                scale: action === "sniffing" ? [1, 1.15, 1] : 1,
              }}
              transition={{ duration: 0.4, repeat: Infinity }}
              style={{ transformOrigin: "73px 62px" }}
            >
              <circle
                cx="73"
                cy="62"
                r="27"
                fill="#dba7a0"
                stroke="#503322"
                strokeWidth="5"
              />
              <circle cx="73" cy="62" r="15" fill="#efaaa8" />
            </motion.g>

            <motion.g
              animate={{
                rotate: action === "bigHop" ? [25, -25, 25] : [12, -14, 12],
                scale: action === "sniffing" ? [1, 1.15, 1] : 1,
              }}
              transition={{ duration: 0.4, repeat: Infinity, delay: 0.1 }}
              style={{ transformOrigin: "143px 62px" }}
            >
              <circle
                cx="143"
                cy="62"
                r="27"
                fill="#dba7a0"
                stroke="#503322"
                strokeWidth="5"
              />
              <circle cx="143" cy="62" r="15" fill="#efaaa8" />
            </motion.g>

            {/* HEAD BASE */}
            <circle
              cx="108"
              cy="94"
              r="45"
              fill="#b99082"
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
              style={{ transformOrigin: "108px 91px" }}
            >
              <circle cx="92" cy="91" r="5" fill="#332119" />
              <circle cx="124" cy="91" r="5" fill="#332119" />

              {!blink && (
                <>
                  <circle cx="93.5" cy="89.5" r="2" fill="white" />
                  <circle cx="125.5" cy="89.5" r="2" fill="white" />
                </>
              )}
            </motion.g>

            {/* MUZZLE */}
            <ellipse cx="108" cy="108" rx="24" ry="18" fill="#ead4c9" />

            {/* NOSE (SNIFFING / TWITCHING) */}
            <motion.circle
              cx="108"
              cy="105"
              r="6"
              fill="#503322"
              animate={{
                scale:
                  action === "sniffing" || action === "nibbling"
                    ? [1, 1.4, 1]
                    : [1, 1.15, 1],
              }}
              transition={{
                duration: 0.18,
                repeat: Infinity,
              }}
            />

            {/* WHISKERS (DYNAMIC WIGGLE) */}
            <motion.path
              d="M86 108 L61 102 M86 114 L60 116 M130 108 L155 102 M130 114 L156 116"
              stroke="#503322"
              strokeWidth="2.5"
              strokeLinecap="round"
              animate={{
                rotate: action === "sniffing" ? [-10, 10, -10] : [-4, 4, -4],
                scale: action === "sniffing" ? [1, 1.1, 1] : 1,
              }}
              transition={{ duration: 0.2, repeat: Infinity }}
              style={{ transformOrigin: "108px 108px" }}
            />

            {/* SMILE / EXPRESSION */}
            <path
              d={
                action === "bigHop"
                  ? "M98 110 Q108 124 118 110"
                  : "M100 112 Q108 120 116 112"
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
