"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";

type Props = {
  size?: number;
  state?: "idle" | "new" | "selected";
  reaction?: "like" | "heart" | null;
};

type LionAction = "idle" | "pouncing" | "strutting" | "waving" | "sniffing";

export function Lion({ size = 220, state = "idle", reaction = null }: Props) {
  const [blink, setBlink] = useState(false);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [action, setAction] = useState<LionAction>("idle");
  const [isTapped, setIsTapped] = useState(false);

  const isNew = state === "new";

  /* =========================================================
     1. EXAGGERATED FULL-BODY ACTION VARIANTS (BIGGER MOVEMENTS)
     ========================================================= */
  const bodyVariants: Variants = {
    idle: {
      y: isNew ? [0, -22, 0] : [0, -8, 0],
      x: 0,
      rotate: [0, -3, 3, 0],
      scale: [1, 1.04, 1],
      transition: { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
    },
    strutting: {
      x: [-28, 28, -28],
      y: [0, -18, 0, -18, 0],
      rotate: [-12, 12, -12],
      scaleX: [1, 1.08, 0.92, 1.08, 1],
      transition: { duration: 0.9, repeat: Infinity, ease: "easeInOut" },
    },
    pouncing: {
      y: [0, -75, 0, -32, 0],
      scaleY: [1, 0.7, 1.25, 0.85, 1],
      scaleX: [1, 1.2, 0.85, 1.1, 1],
      rotate: [0, -12, 12, 0],
      transition: { duration: 0.95, ease: "easeInOut" },
    },
    waving: {
      y: [0, -10, 0],
      rotate: [-10, 8, -10],
      scale: [1, 1.05, 1],
      transition: { duration: 0.85, repeat: Infinity, ease: "easeInOut" },
    },
    sniffing: {
      y: [0, 18, -6, 0],
      rotate: [0, 12, 12, 0],
      scaleY: [1, 0.9, 1.05, 1],
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
        2200 + Math.random() * 3600,
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
          const actions: LionAction[] = [
            "strutting",
            "pouncing",
            "waving",
            "sniffing",
            "idle",
          ];
          const nextAction =
            actions[Math.floor(Math.random() * actions.length)];
          setAction(nextAction);

          const duration =
            nextAction === "pouncing"
              ? 1600
              : nextAction === "strutting"
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
    setAction("pouncing");
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
          cy="206"
          rx="54"
          ry="9"
          fill="#503322"
          opacity="0.18"
          animate={{
            rx: action === "pouncing" ? [54, 16, 54] : [54, 70, 54],
            opacity: action === "pouncing" ? [0.18, 0.03, 0.18] : 0.18,
            scaleX: action === "strutting" ? [1, 1.3, 0.7, 1.3, 1] : 1,
          }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
        />

        {/* FULL BODY GROUP WITH EXAGGERATED ACTIONS */}
        <motion.g
          animate={action}
          variants={bodyVariants}
          style={{ transformOrigin: "110px 200px" }}
        >
          {/* TAIL (HIGH DYNAMIC SWISHING) */}
          <motion.path
            d="M153 161 Q191 147 178 119"
            fill="none"
            stroke="#d99655"
            strokeWidth="14"
            strokeLinecap="round"
            animate={{
              rotate:
                action === "pouncing"
                  ? [-45, 45, -45]
                  : action === "strutting"
                    ? [-30, 30, -30]
                    : [-12, 16, -12],
              scale: action === "pouncing" ? [1, 1.2, 1] : 1,
            }}
            transition={{
              duration: action === "pouncing" ? 0.25 : 1.0,
              repeat: Infinity,
            }}
            style={{ transformOrigin: "153px 161px" }}
          />

          {/* PAW WAVE / LEFT ARM (EXAGGERATED SWING & WAVING) */}
          <motion.path
            d="M67 146 Q47 131 53 111"
            fill="none"
            stroke="#d99655"
            strokeWidth="17"
            strokeLinecap="round"
            animate={{
              rotate:
                action === "waving"
                  ? [-45, 35, -45]
                  : action === "pouncing"
                    ? [-40, 20, -40]
                    : [-15, 12, -15],
            }}
            transition={{
              duration: action === "waving" ? 0.4 : 1.2,
              repeat: Infinity,
            }}
            style={{ transformOrigin: "67px 146px" }}
          />

          {/* BODY */}
          <ellipse
            cx="110"
            cy="166"
            rx="48"
            ry="43"
            fill="#d99655"
            stroke="#503322"
            strokeWidth="5"
          />

          {/* BELLY */}
          <ellipse cx="110" cy="171" rx="26" ry="29" fill="#f5d9b4" />

          {/* FEET / HIND LEGS (SPRINGY STEPPING) */}
          <motion.ellipse
            cx="80"
            cy="200"
            rx="20"
            ry="10"
            fill="#b86f3e"
            animate={{
              y:
                action === "strutting"
                  ? [0, -16, 0]
                  : action === "pouncing"
                    ? [0, -12, 0]
                    : 0,
              x: action === "strutting" ? [0, -8, 0] : 0,
            }}
            transition={{
              duration: action === "strutting" ? 0.22 : 0.3,
              repeat: action === "strutting" ? Infinity : 0,
            }}
          />
          <motion.ellipse
            cx="140"
            cy="200"
            rx="20"
            ry="10"
            fill="#b86f3e"
            animate={{
              y:
                action === "strutting"
                  ? [-16, 0, -16]
                  : action === "pouncing"
                    ? [0, -12, 0]
                    : 0,
              x: action === "strutting" ? [0, 8, 0] : 0,
            }}
            transition={{
              duration: action === "strutting" ? 0.22 : 0.3,
              repeat: action === "strutting" ? Infinity : 0,
            }}
          />

          {/* HEAD & MANE GROUP */}
          <motion.g
            animate={{
              rotate:
                action === "sniffing"
                  ? 18
                  : action === "pouncing"
                    ? [-12, 12, 0]
                    : [-4, 4, -4],
            }}
            transition={{
              duration: action === "sniffing" ? 0.6 : 2.5,
              repeat: action === "sniffing" ? 0 : Infinity,
              ease: "easeInOut",
            }}
            style={{ transformOrigin: "110px 95px" }}
          >
            {/* MANE (BREATHING & EXPANDING HIGH DRAMA) */}
            <motion.circle
              cx="110"
              cy="91"
              r="70"
              fill="#b86f3e"
              stroke="#503322"
              strokeWidth="5"
              animate={{
                scale:
                  action === "pouncing"
                    ? [1, 1.12, 1]
                    : action === "strutting"
                      ? [1, 1.06, 0.96, 1]
                      : [1, 1.03, 1],
              }}
              transition={{
                duration: action === "pouncing" ? 0.35 : 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ transformOrigin: "110px 91px" }}
            />

            {/* LEFT EAR */}
            <motion.circle
              cx="73"
              cy="62"
              r="18"
              fill="#e8b273"
              stroke="#503322"
              strokeWidth="5"
              animate={{
                rotate:
                  action === "strutting" ? [-20, 20, -20] : [-12, 16, -12],
              }}
              transition={{
                duration: action === "strutting" ? 0.3 : 3.5,
                repeat: Infinity,
              }}
              style={{ transformOrigin: "73px 62px" }}
            />

            {/* RIGHT EAR */}
            <motion.circle
              cx="147"
              cy="62"
              r="18"
              fill="#e8b273"
              stroke="#503322"
              strokeWidth="5"
              animate={{
                rotate: action === "strutting" ? [20, -20, 20] : [12, -16, 12],
              }}
              transition={{
                duration: action === "strutting" ? 0.3 : 3.8,
                repeat: Infinity,
                delay: 0.2,
              }}
              style={{ transformOrigin: "147px 62px" }}
            />

            {/* FACE BASE */}
            <circle
              cx="110"
              cy="95"
              r="47"
              fill="#e8b273"
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
              style={{ transformOrigin: "110px 91px" }}
            >
              <circle cx="92" cy="91" r="5" fill="#332119" />
              <circle cx="128" cy="91" r="5" fill="#332119" />

              {!blink && (
                <>
                  <circle cx="93.5" cy="89.5" r="1.8" fill="white" />
                  <circle cx="129.5" cy="89.5" r="1.8" fill="white" />
                </>
              )}
            </motion.g>

            {/* MUZZLE */}
            <ellipse cx="110" cy="110" rx="25" ry="19" fill="#f5d9b4" />

            {/* NOSE (TWITCHES INTENSIFIED ON SNIFFING) */}
            <motion.path
              d="M102 106 Q110 100 118 106 L110 114 Z"
              fill="#503322"
              animate={{
                scale: action === "sniffing" ? [1, 1.45, 1] : 1,
                y: action === "sniffing" ? [0, -3, 0] : 0,
              }}
              transition={{
                duration: 0.18,
                repeat: action === "sniffing" ? Infinity : 0,
              }}
              style={{ transformOrigin: "110px 108px" }}
            />

            {/* SMILE / ROAR */}
            <path
              d={
                action === "pouncing" || action === "waving"
                  ? "M98 113 Q110 130 122 113"
                  : "M101 116 Q110 125 119 116"
              }
              fill="none"
              stroke="#503322"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </motion.g>
        </motion.g>
      </motion.svg>
    </div>
  );
}
