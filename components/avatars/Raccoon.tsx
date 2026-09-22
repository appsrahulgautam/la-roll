"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";

type Props = {
  size?: number;
  state?: "idle" | "new" | "selected";
  reaction?: "like" | "heart" | null;
};

type RaccoonAction =
  | "idle"
  | "tailSwoosh"
  | "bobaSip"
  | "curiousHop"
  | "maskSneak";

export function Raccoon({
  size = 220,
  state = "idle",
  reaction = null,
}: Props) {
  const [blink, setBlink] = useState(false);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [action, setAction] = useState<RaccoonAction>("idle");
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
      transition: { duration: 2.0, repeat: Infinity, ease: "easeInOut" },
    },
    tailSwoosh: {
      x: [-25, 25, -25],
      y: [0, -12, 0, -12, 0],
      rotate: [-14, 14, -14],
      scaleX: [1, 1.08, 0.94, 1.08, 1],
      transition: { duration: 0.7, repeat: Infinity, ease: "easeInOut" },
    },
    bobaSip: {
      y: [0, 10, -6, 10, 0],
      rotate: [0, 16, -12, 16, 0],
      scale: [1, 1.06, 0.96, 1.06, 1],
      transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" },
    },
    curiousHop: {
      y: [0, -58, 0, -28, 0],
      scaleY: [1, 0.76, 1.22, 0.86, 1],
      scaleX: [1, 1.16, 0.86, 1.08, 1],
      rotate: [0, -18, 18, -6, 0],
      transition: { duration: 0.9, ease: "easeInOut" },
    },
    maskSneak: {
      x: [-20, 20, -20],
      y: [0, 12, 0],
      rotate: [-12, 12, -12],
      scale: [1, 1.05, 1],
      transition: { duration: 1.4, ease: "easeInOut" },
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
          const actions: RaccoonAction[] = [
            "tailSwoosh",
            "bobaSip",
            "curiousHop",
            "maskSneak",
            "idle",
          ];
          const nextAction =
            actions[Math.floor(Math.random() * actions.length)];
          setAction(nextAction);

          const duration =
            nextAction === "curiousHop"
              ? 1400
              : nextAction === "bobaSip"
                ? 2200
                : nextAction === "tailSwoosh"
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
    setAction("curiousHop");
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
          rx="52"
          ry="10"
          fill="#503322"
          opacity="0.2"
          animate={{
            rx: action === "curiousHop" ? [52, 20, 52] : [52, 42, 52],
            opacity: action === "curiousHop" ? [0.2, 0.04, 0.2] : 0.2,
            scale: action === "tailSwoosh" ? [1, 1.2, 1] : 1,
          }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
        />

        {/* FULL BODY GROUP WITH DYNAMIC BIG ACTIONS */}
        <motion.g
          animate={action}
          variants={bodyVariants}
          style={{ transformOrigin: "108px 188px" }}
        >
          {/* STRIPED RACCOON TAIL (WHIPS AND SWOOSHES) */}
          <motion.g
            animate={{
              rotate:
                action === "tailSwoosh" || action === "curiousHop"
                  ? [-35, 40, -35]
                  : [-10, 20, -10],
              scale: action === "tailSwoosh" ? [1, 1.25, 1] : 1,
            }}
            transition={{
              duration:
                action === "tailSwoosh" || action === "curiousHop" ? 0.35 : 1.1,
              repeat: Infinity,
            }}
            style={{ transformOrigin: "164px 157px" }}
          >
            <path
              d="M164 157 Q202 148 192 111 Q187 91 170 99"
              fill="none"
              stroke="#76564a"
              strokeWidth="25"
              strokeLinecap="round"
            />
            {/* Tail Stripes */}
            <path
              d="M184 104 L176 119
                 M190 126 L177 136
                 M187 147 L171 151"
              stroke="#503322"
              strokeWidth="8"
              strokeLinecap="round"
            />
          </motion.g>

          {/* BODY */}
          <ellipse
            cx="108"
            cy="148"
            rx="53"
            ry="54"
            fill="#8c7168"
            stroke="#503322"
            strokeWidth="5"
          />

          {/* BELLY */}
          <ellipse cx="108" cy="159" rx="31" ry="34" fill="#ead8ca" />

          {/* FEET (STEPPING / HOPPING ACTION) */}
          <motion.ellipse
            cx="78"
            cy="198"
            rx="20"
            ry="9"
            fill="#76564a"
            animate={{
              y:
                action === "tailSwoosh"
                  ? [0, -10, 0]
                  : action === "curiousHop"
                    ? [0, -16, 0]
                    : 0,
              rotate: action === "tailSwoosh" ? [-12, 12, -12] : 0,
            }}
            transition={{
              duration: 0.2,
              repeat: action === "tailSwoosh" ? Infinity : 0,
            }}
          />
          <motion.ellipse
            cx="137"
            cy="198"
            rx="20"
            ry="9"
            fill="#76564a"
            animate={{
              y:
                action === "tailSwoosh"
                  ? [-10, 0, -10]
                  : action === "curiousHop"
                    ? [0, -16, 0]
                    : 0,
              rotate: action === "tailSwoosh" ? [12, -12, 12] : 0,
            }}
            transition={{
              duration: 0.2,
              repeat: action === "tailSwoosh" ? Infinity : 0,
            }}
          />

          {/* EXAGGERATED BUBBLE TEA DANCE / SIP */}
          <motion.g
            animate={{
              rotate:
                action === "bobaSip"
                  ? [-22, 22, -22]
                  : action === "curiousHop"
                    ? [-15, 15, -15]
                    : [-5, 5, -5],
              scale: action === "bobaSip" ? [1, 1.2, 1] : 1,
              y: action === "bobaSip" ? [0, -6, 0] : 0,
            }}
            transition={{
              duration: action === "bobaSip" ? 0.35 : 1.2,
              repeat: Infinity,
            }}
            style={{ transformOrigin: "144px 145px" }}
          >
            <g transform="translate(144 145)">
              <rect
                x="-14"
                y="-22"
                width="28"
                height="42"
                rx="7"
                fill="#e7b18e"
                stroke="#503322"
                strokeWidth="4"
              />
              <path d="M-5 -22 L5 -49" stroke="#503322" strokeWidth="4" />
              {/* Boba Pearls (Jiggle on Sip) */}
              <motion.g
                animate={{
                  y: action === "bobaSip" ? [0, -3, 0] : 0,
                }}
                transition={{ duration: 0.2, repeat: Infinity }}
              >
                <circle cx="-7" cy="11" r="3" fill="#503322" />
                <circle cx="2" cy="12" r="3" fill="#503322" />
                <circle cx="8" cy="6" r="3" fill="#503322" />
              </motion.g>
            </g>
          </motion.g>

          {/* HEAD & FACE GROUP */}
          <motion.g
            animate={{
              rotate:
                action === "maskSneak"
                  ? [-18, 18, -18]
                  : action === "curiousHop"
                    ? [-12, 12, 0]
                    : [-3, 3, -3],
            }}
            transition={{
              duration: action === "maskSneak" ? 0.7 : 2.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ transformOrigin: "105px 91px" }}
          >
            {/* EARS (EXAGGERATED TWITCHES) */}
            <motion.g
              animate={{
                rotate:
                  action === "curiousHop" ? [-25, 25, -25] : [-12, 14, -12],
                scale: action === "maskSneak" ? [1, 1.15, 1] : 1,
              }}
              transition={{ duration: 0.35, repeat: Infinity }}
              style={{ transformOrigin: "69px 55px" }}
            >
              <circle
                cx="69"
                cy="55"
                r="17"
                fill="#76564a"
                stroke="#503322"
                strokeWidth="5"
              />
            </motion.g>

            <motion.g
              animate={{
                rotate: action === "curiousHop" ? [25, -25, 25] : [12, -14, 12],
                scale: action === "maskSneak" ? [1, 1.15, 1] : 1,
              }}
              transition={{ duration: 0.35, repeat: Infinity, delay: 0.1 }}
              style={{ transformOrigin: "141px 55px" }}
            >
              <circle
                cx="141"
                cy="55"
                r="17"
                fill="#76564a"
                stroke="#503322"
                strokeWidth="5"
              />
            </motion.g>

            {/* HEAD BASE */}
            <circle
              cx="105"
              cy="91"
              r="48"
              fill="#8c7168"
              stroke="#503322"
              strokeWidth="5"
            />

            {/* FACE MASK */}
            <path
              d="M61 86 Q82 69 105 82 Q128 69 149 86
                 Q142 116 105 113 Q68 116 61 86Z"
              fill="#4f403b"
            />

            {/* WHITE FACE PATCHES */}
            <ellipse cx="86" cy="91" rx="14" ry="11" fill="#f2e6dc" />
            <ellipse cx="124" cy="91" rx="14" ry="11" fill="#f2e6dc" />

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
              style={{ transformOrigin: "105px 92px" }}
            >
              <circle cx="87" cy="92" r="5" fill="#241914" />
              <circle cx="123" cy="92" r="5" fill="#241914" />

              {!blink && (
                <>
                  <circle cx="88.5" cy="90.5" r="1.8" fill="white" />
                  <circle cx="124.5" cy="90.5" r="1.8" fill="white" />
                </>
              )}
            </motion.g>

            {/* NOSE (SNIFFING / TWITCHING) */}
            <motion.ellipse
              cx="105"
              cy="107"
              rx="7"
              ry="5"
              fill="#241914"
              animate={{
                scale:
                  action === "maskSneak" || action === "bobaSip"
                    ? [1, 1.35, 1]
                    : [1, 1.1, 1],
              }}
              transition={{
                duration: 0.18,
                repeat: Infinity,
              }}
            />

            {/* SMILE */}
            <path
              d={
                action === "curiousHop"
                  ? "M95 110 Q105 124 115 110"
                  : "M97 113 Q105 121 113 113"
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
