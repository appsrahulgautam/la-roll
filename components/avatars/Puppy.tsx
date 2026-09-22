"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";

type Props = {
  size?: number;
  state?: "idle" | "new" | "selected";
  reaction?: "like" | "heart" | null;
};

type PuppyAction = "idle" | "tailWagZoom" | "playBow" | "happyHop" | "earFlap";

export function Puppy({ size = 220, state = "idle", reaction = null }: Props) {
  const [blink, setBlink] = useState(false);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [action, setAction] = useState<PuppyAction>("idle");
  const [isTapped, setIsTapped] = useState(false);

  const isNew = state === "new";

  /* =========================================================
     1. EXAGGERATED FULL-BODY ACTION VARIANTS (BIGGER MOVEMENTS)
     ========================================================= */
  const bodyVariants: Variants = {
    idle: {
      y: isNew ? [0, -20, 0] : [0, -10, 0],
      x: 0,
      rotate: [0, -3, 3, 0],
      scale: [1, 1.04, 1],
      transition: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
    },
    tailWagZoom: {
      x: [-28, 28, -28],
      y: [0, -12, 0, -12, 0],
      rotate: [-14, 14, -14],
      scaleX: [1, 1.08, 0.94, 1.08, 1],
      transition: { duration: 0.6, repeat: Infinity, ease: "easeInOut" },
    },
    playBow: {
      y: [0, 24, 24, 0],
      rotate: [0, -12, 12, 0],
      scaleY: [1, 0.8, 0.8, 1],
      scaleX: [1, 1.15, 1.15, 1],
      transition: { duration: 1.3, ease: "easeInOut" },
    },
    happyHop: {
      y: [0, -60, 0, -30, 0],
      scaleY: [1, 0.75, 1.25, 0.85, 1],
      scaleX: [1, 1.18, 0.85, 1.08, 1],
      rotate: [0, -20, 20, -8, 0],
      transition: { duration: 0.95, ease: "easeInOut" },
    },
    earFlap: {
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
          const actions: PuppyAction[] = [
            "tailWagZoom",
            "playBow",
            "happyHop",
            "earFlap",
            "idle",
          ];
          const nextAction =
            actions[Math.floor(Math.random() * actions.length)];
          setAction(nextAction);

          const duration =
            nextAction === "happyHop"
              ? 1400
              : nextAction === "tailWagZoom"
                ? 2000
                : nextAction === "playBow"
                  ? 1800
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
          cy="204"
          rx="52"
          ry="10"
          fill="#503322"
          opacity="0.2"
          animate={{
            rx: action === "happyHop" ? [52, 20, 52] : [52, 42, 52],
            opacity: action === "happyHop" ? [0.2, 0.04, 0.2] : 0.2,
            scale: action === "playBow" ? [1, 1.2, 1] : 1,
          }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
        />

        {/* FULL BODY GROUP WITH DYNAMIC BIG ACTIONS */}
        <motion.g
          animate={action}
          variants={bodyVariants}
          style={{ transformOrigin: "108px 188px" }}
        >
          {/* WILD WAGGING TAIL */}
          <motion.path
            d="M157 157 Q195 145 185 111 Q180 96 164 104"
            fill="none"
            stroke="#b9784f"
            strokeWidth="20"
            strokeLinecap="round"
            animate={{
              rotate:
                action === "tailWagZoom" || action === "happyHop"
                  ? [-45, 50, -45]
                  : [-10, 22, -10],
              scale: action === "tailWagZoom" ? [1, 1.2, 1] : 1,
            }}
            transition={{
              duration:
                action === "tailWagZoom" || action === "happyHop" ? 0.18 : 0.6,
              repeat: Infinity,
            }}
            style={{ transformOrigin: "157px 157px" }}
          />

          {/* BODY */}
          <ellipse
            cx="108"
            cy="151"
            rx="55"
            ry="55"
            fill="#c88a5d"
            stroke="#503322"
            strokeWidth="5"
          />

          {/* BELLY */}
          <ellipse cx="108" cy="159" rx="32" ry="35" fill="#f4d2b1" />

          {/* PAWS (STEPPING / HOPPING ACTION) */}
          <motion.ellipse
            cx="70"
            cy="188"
            rx="20"
            ry="11"
            fill="#b9784f"
            animate={{
              y:
                action === "tailWagZoom"
                  ? [0, -10, 0]
                  : action === "happyHop"
                    ? [0, -16, 0]
                    : 0,
              rotate: action === "tailWagZoom" ? [-12, 12, -12] : 0,
            }}
            transition={{
              duration: 0.2,
              repeat: action === "tailWagZoom" ? Infinity : 0,
            }}
          />
          <motion.ellipse
            cx="145"
            cy="188"
            rx="20"
            ry="11"
            fill="#b9784f"
            animate={{
              y:
                action === "tailWagZoom"
                  ? [-10, 0, -10]
                  : action === "happyHop"
                    ? [0, -16, 0]
                    : 0,
              rotate: action === "tailWagZoom" ? [12, -12, 12] : 0,
            }}
            transition={{
              duration: 0.2,
              repeat: action === "tailWagZoom" ? Infinity : 0,
            }}
          />

          {/* COLLAR & TAG (BOBS WITH BODY) */}
          <path
            d="M75 126 Q109 139 143 126"
            fill="none"
            stroke="#efaaa8"
            strokeWidth="8"
          />
          <motion.circle
            cx="109"
            cy="135"
            r="6"
            fill="#e5a53e"
            stroke="#503322"
            strokeWidth="3"
            animate={{
              rotate: action === "tailWagZoom" ? [-25, 25, -25] : [-8, 8, -8],
              scale: action === "happyHop" ? [1, 1.3, 1] : 1,
            }}
            transition={{ duration: 0.3, repeat: Infinity }}
            style={{ transformOrigin: "109px 126px" }}
          />

          {/* HEAD & EARS GROUP */}
          <motion.g
            animate={{
              rotate:
                action === "playBow"
                  ? [-18, 18, -18]
                  : action === "earFlap"
                    ? [-15, 15, -15]
                    : [-3, 3, -3],
            }}
            transition={{
              duration: action === "playBow" ? 0.6 : 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ transformOrigin: "109px 91px" }}
          >
            {/* FLOPPY EARS (EXAGGERATED BOUNCING & FLAPPING) */}
            <motion.ellipse
              cx="65"
              cy="88"
              rx="25"
              ry="42"
              transform="rotate(20 65 88)"
              fill="#9d633f"
              stroke="#503322"
              strokeWidth="5"
              animate={{
                rotate:
                  action === "happyHop"
                    ? [-20, 50, -20]
                    : action === "earFlap"
                      ? [10, 45, 10]
                      : [20, 32, 20],
                scaleY: action === "happyHop" ? [1, 1.25, 1] : 1,
              }}
              transition={{
                duration:
                  action === "happyHop" || action === "earFlap" ? 0.25 : 1.8,
                repeat: Infinity,
              }}
              style={{ transformOrigin: "65px 60px" }}
            />

            <motion.ellipse
              cx="153"
              cy="88"
              rx="25"
              ry="42"
              transform="rotate(-20 153 88)"
              fill="#9d633f"
              stroke="#503322"
              strokeWidth="5"
              animate={{
                rotate:
                  action === "happyHop"
                    ? [20, -50, 20]
                    : action === "earFlap"
                      ? [-10, -45, -10]
                      : [-20, -32, -20],
                scaleY: action === "happyHop" ? [1, 1.25, 1] : 1,
              }}
              transition={{
                duration:
                  action === "happyHop" || action === "earFlap" ? 0.25 : 1.8,
                repeat: Infinity,
              }}
              style={{ transformOrigin: "153px 60px" }}
            />

            {/* HEAD BASE */}
            <circle
              cx="109"
              cy="91"
              r="51"
              fill="#c88a5d"
              stroke="#503322"
              strokeWidth="5"
            />

            {/* FACE PATCH */}
            <ellipse cx="109" cy="108" rx="29" ry="24" fill="#f4d2b1" />

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
              style={{ transformOrigin: "109px 91px" }}
            >
              <circle cx="90" cy="91" r="6" fill="#332119" />
              <circle cx="128" cy="91" r="6" fill="#332119" />

              {!blink && (
                <>
                  <circle cx="91.8" cy="89.2" r="2" fill="white" />
                  <circle cx="129.8" cy="89.2" r="2" fill="white" />
                </>
              )}
            </motion.g>

            {/* NOSE (TWITCHES ON HAPPY HOP) */}
            <motion.ellipse
              cx="109"
              cy="105"
              rx="9"
              ry="7"
              fill="#332119"
              animate={{
                scale:
                  action === "happyHop" || action === "playBow"
                    ? [1, 1.3, 1]
                    : 1,
              }}
              transition={{ duration: 0.2, repeat: Infinity }}
            />

            {/* TONGUE (HAPPY PANTING & WIGGLE) */}
            <motion.path
              d="M103 113 Q109 128 115 113"
              fill="#e88991"
              stroke="#503322"
              strokeWidth="3"
              animate={{
                scaleY:
                  action === "happyHop" || action === "tailWagZoom"
                    ? [1, 1.4, 1]
                    : [1, 1.1, 1],
                rotate: action === "tailWagZoom" ? [-8, 8, -8] : 0,
              }}
              transition={{ duration: 0.2, repeat: Infinity }}
              style={{ transformOrigin: "109px 113px" }}
            />
          </motion.g>
        </motion.g>
      </motion.svg>
    </div>
  );
}
