"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";

type Props = {
  size?: number;
  state?: "idle" | "new" | "selected";
  reaction?: "like" | "heart" | null;
};

type OwlAction = "idle" | "wingFlap" | "headTilt" | "bigSwoop" | "tuftTwitch";

export function Owl({ size = 220, state = "idle", reaction = null }: Props) {
  const [blink, setBlink] = useState(false);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [action, setAction] = useState<OwlAction>("idle");
  const [isTapped, setIsTapped] = useState(false);

  const isNew = state === "new";

  /* =========================================================
     1. EXAGGERATED FULL-BODY ACTION VARIANTS (BIGGER MOVEMENTS)
     ========================================================= */
  const bodyVariants: Variants = {
    idle: {
      y: isNew ? [0, -25, 0] : [0, -10, 0],
      x: 0,
      rotate: [0, -3, 3, 0],
      scale: [1, 1.04, 1],
      transition: { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
    },
    wingFlap: {
      y: [0, -20, 0, -20, 0],
      scaleY: [1, 0.9, 1.1, 0.95, 1],
      rotate: [-8, 8, -8],
      transition: { duration: 0.9, repeat: Infinity, ease: "easeInOut" },
    },
    headTilt: {
      rotate: [0, -32, 32, -20, 0],
      y: [0, -8, -8, 0],
      scale: [1, 1.06, 1],
      transition: { duration: 1.6, ease: "easeInOut" },
    },
    bigSwoop: {
      y: [0, -60, 0, -30, 0],
      scaleY: [1, 0.75, 1.2, 0.88, 1],
      scaleX: [1, 1.18, 0.85, 1.08, 1],
      rotate: [0, -22, 22, -8, 0],
      transition: { duration: 1.0, ease: "easeInOut" },
    },
    tuftTwitch: {
      y: [0, -12, 0],
      rotate: [-10, 10, -10],
      scale: [1, 1.08, 1],
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
            { x: -7, y: 0 },
            { x: 7, y: 0 },
            { x: 0, y: -6 },
            { x: 0, y: 5 },
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
          const actions: OwlAction[] = [
            "wingFlap",
            "headTilt",
            "bigSwoop",
            "tuftTwitch",
            "idle",
          ];
          const nextAction =
            actions[Math.floor(Math.random() * actions.length)];
          setAction(nextAction);

          const duration =
            nextAction === "bigSwoop"
              ? 1500
              : nextAction === "wingFlap"
                ? 2200
                : nextAction === "headTilt"
                  ? 2000
                  : 1600;

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
    setAction("bigSwoop");
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
          cy="208"
          rx="52"
          ry="10"
          fill="#503322"
          opacity="0.2"
          animate={{
            rx: action === "bigSwoop" ? [52, 20, 52] : [52, 42, 52],
            opacity: action === "bigSwoop" ? [0.2, 0.04, 0.2] : 0.2,
          }}
          transition={{ duration: 1.0, ease: "easeInOut" }}
        />

        {/* FULL BODY GROUP WITH DYNAMIC BIG ACTIONS */}
        <motion.g
          animate={action}
          variants={bodyVariants}
          style={{ transformOrigin: "110px 150px" }}
        >
          {/* BODY */}
          <ellipse
            cx="110"
            cy="145"
            rx="63"
            ry="62"
            fill="#8c6048"
            stroke="#503322"
            strokeWidth="5"
          />

          {/* BELLY */}
          <ellipse cx="110" cy="158" rx="39" ry="42" fill="#f4dfc6" />

          {/* FEET */}
          <motion.path
            d="M82 196 Q72 204 63 201 M82 196 Q74 211 66 210
               M138 196 Q148 204 157 201 M138 196 Q146 211 154 210"
            fill="none"
            stroke="#e6a344"
            strokeWidth="6"
            strokeLinecap="round"
            animate={{
              y: action === "bigSwoop" ? [0, -15, 0] : 0,
            }}
            transition={{
              duration: 0.5,
              repeat: action === "bigSwoop" ? 2 : 0,
            }}
          />

          {/* WINGS (DRAMATIC FLAPPING) */}
          {/* Left Wing */}
          <motion.path
            d="M54 133 Q29 144 42 169 Q52 180 69 158"
            fill="#76503e"
            stroke="#503322"
            strokeWidth="5"
            animate={{
              rotate:
                action === "wingFlap" || action === "bigSwoop"
                  ? [-65, 40, -65]
                  : [-4, 8, -4],
              scaleX: action === "wingFlap" ? [1, 1.35, 1] : 1,
            }}
            transition={{
              duration:
                action === "wingFlap" || action === "bigSwoop" ? 0.3 : 2.5,
              repeat: Infinity,
            }}
            style={{ transformOrigin: "60px 140px" }}
          />

          {/* Right Wing */}
          <motion.path
            d="M166 133 Q191 144 178 169 Q168 180 151 158"
            fill="#76503e"
            stroke="#503322"
            strokeWidth="5"
            animate={{
              rotate:
                action === "wingFlap" || action === "bigSwoop"
                  ? [65, -40, 65]
                  : [4, -8, 4],
              scaleX: action === "wingFlap" ? [1, 1.35, 1] : 1,
            }}
            transition={{
              duration:
                action === "wingFlap" || action === "bigSwoop" ? 0.3 : 2.5,
              repeat: Infinity,
            }}
            style={{ transformOrigin: "160px 140px" }}
          />

          {/* HEAD & FACE GROUP (EXAGGERATED HEAD TILT & LOOKING) */}
          <motion.g
            animate={{
              rotate:
                action === "headTilt"
                  ? [-35, 35, -20, 0]
                  : action === "tuftTwitch"
                    ? [-12, 12, -12]
                    : 0,
            }}
            transition={{
              duration: action === "headTilt" ? 1.6 : 0.6,
              repeat: action === "tuftTwitch" ? Infinity : 0,
              ease: "easeInOut",
            }}
            style={{ transformOrigin: "110px 91px" }}
          >
            {/* EAR TUFTS (DYNAMIC TWITCH) */}
            <motion.path
              d="M65 83 L59 43 L82 61
                 M155 83 L161 43 L138 61"
              fill="#795033"
              stroke="#503322"
              strokeWidth="5"
              strokeLinejoin="round"
              animate={{
                rotate: action === "tuftTwitch" ? [-20, 20, -20] : [-3, 3, -3],
                scaleY: action === "headTilt" ? [1, 1.25, 1] : 1,
              }}
              transition={{
                duration: action === "tuftTwitch" ? 0.25 : 1.8,
                repeat: Infinity,
              }}
              style={{ transformOrigin: "110px 65px" }}
            />

            {/* HEAD BASE */}
            <circle
              cx="110"
              cy="91"
              r="58"
              fill="#9d7258"
              stroke="#503322"
              strokeWidth="5"
            />

            {/* EYE PATCHES */}
            <circle cx="84" cy="94" r="25" fill="#f7eadb" />
            <circle cx="136" cy="94" r="25" fill="#f7eadb" />

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
              style={{ transformOrigin: "110px 94px" }}
            >
              {/* Pupils */}
              <circle cx="87" cy="96" r="11" fill="#38251b" />
              <circle cx="133" cy="96" r="11" fill="#38251b" />

              {!blink && (
                <>
                  {/* Catchlights */}
                  <circle cx="90" cy="92" r="3.5" fill="white" />
                  <circle cx="136" cy="92" r="3.5" fill="white" />
                </>
              )}
            </motion.g>

            {/* BEAK (BOBS ON ACTION) */}
            <motion.path
              d="M110 104 L99 119 L110 125 L121 119 Z"
              fill="#e6a344"
              stroke="#503322"
              strokeWidth="4"
              animate={{
                scale: action === "headTilt" ? [1, 1.2, 1] : 1,
                y: action === "tuftTwitch" ? [0, 2, 0] : 0,
              }}
              transition={{
                duration: 0.3,
                repeat: action === "headTilt" ? Infinity : 0,
              }}
              style={{ transformOrigin: "110px 114px" }}
            />
          </motion.g>
        </motion.g>
      </motion.svg>
    </div>
  );
}
