// "use client";

// import { motion } from "framer-motion";
// import { useState, useMemo, memo, useEffect } from "react";
// import { Avatar } from "@/components/avatars/Avatar";

// type Review = {
//   id: number;
//   name: string;
//   message: string;
//   avatar: string;
//   likes: number;
//   hearts: number;
//   isBirthday?: boolean;
//   isChristmas?: boolean;
//   createdAt: Date | string;
// };

// type Props = {
//   review: Review;
//   latest?: boolean;
//   index: number;
//   newReview?: boolean;
// };

// function ReviewCharacterComponent({
//   review,
//   latest = false,
//   newReview = false,
// }: Props) {
//   const [likes, setLikes] = useState(review.likes);
//   const [hearts, setHearts] = useState(review.hearts);
//   const [loading, setLoading] = useState<"like" | "heart" | null>(null);
//   const [reaction, setReaction] = useState<"like" | "heart" | null>(null);

//   // Sync likes and hearts when updated from parent realtime subscription
//   useEffect(() => {
//     setLikes(review.likes);
//     setHearts(review.hearts);
//   }, [review.likes, review.hearts]);

//   const walkConfig = useMemo(() => {
//     const idNum = typeof review.id === "number" ? review.id : 1;
//     const direction = idNum % 2 === 0 ? "ltr" : "rtl";
//     const duration = 45 + (idNum % 20);
//     const bottomOffset = 4 + (idNum % 6) * 3.5;
//     return { direction, duration, bottomOffset, delay: 0 };
//   }, [review.id]);

//   const isLTR = walkConfig.direction === "ltr";

//   async function react(selectedReaction: "like" | "heart") {
//     if (loading) return;

//     setLoading(selectedReaction);
//     setReaction(selectedReaction);

//     if (selectedReaction === "like") setLikes((v) => v + 1);
//     else setHearts((v) => v + 1);

//     try {
//       const response = await fetch(`/api/reviews/${review.id}/reaction`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ reaction: selectedReaction }),
//       });
//       if (!response.ok) throw new Error("Reaction failed");
//     } catch {
//       if (selectedReaction === "like") setLikes((v) => Math.max(0, v - 1));
//       else setHearts((v) => Math.max(0, v - 1));
//     } finally {
//       setTimeout(() => setReaction(null), 1000);
//       setLoading(null);
//     }
//   }

//   // --- SUB-RENDERERS TO REDUCE DUPLICATION ---
//   const renderBadges = () => (
//     <div className="relative z-50 mb-1 flex flex-col items-center gap-0.5">
//       {latest && (
//         <div className="rounded-full bg-[#503322] px-2 py-0.5 text-[7px] font-bold tracking-[0.18em] text-amber-200 shadow-md sm:text-[8px]">
//           ✦ LATEST MESSAGE
//         </div>
//       )}
//       {review.isBirthday && (
//         <div className="rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 px-2.5 py-0.5 text-[7px] font-extrabold tracking-wider text-white shadow-lg sm:text-[8px] animate-pulse">
//           🎂 BIRTHDAY CELEBRATION! 🎈
//         </div>
//       )}
//       {review.isChristmas && (
//         <div className="rounded-full bg-gradient-to-r from-emerald-600 via-red-600 to-amber-500 px-2.5 py-0.5 text-[7px] font-extrabold tracking-wider text-white shadow-lg sm:text-[8px] animate-pulse">
//           💫 SPECIAL DAY ✨🎉
//         </div>
//       )}
//     </div>
//   );

//   const renderSpeechBubble = () => (
//     <div className="relative z-40 mb-1.5 flex justify-center">
//       <div
//         className={`relative inline-block w-fit min-w-[120px] max-w-[180px] sm:max-w-[220px] rounded-[16px] border px-2.5 py-1.5 text-center shadow-md backdrop-blur-md transition-all ${
//           review.isChristmas
//             ? "border-emerald-500 bg-[#f0fdf4]/95 ring-2 ring-emerald-500/50 shadow-[0_4px_16px_rgba(16,185,129,0.25)]"
//             : review.isBirthday
//               ? "border-pink-400 bg-[#fff0f4]/95 ring-2 ring-pink-400/50 shadow-[0_4px_16px_rgba(236,72,153,0.25)]"
//               : latest
//                 ? "border-amber-400 bg-[#fffdfa]/95 ring-2 ring-amber-300/50 shadow-[0_4px_14px_rgba(217,119,6,0.15)]"
//                 : "border-[#503322]/15 bg-[#fffaf5]/95 shadow-sm"
//         }`}
//       >
//         <p className="line-clamp-2 break-words text-[10px] font-medium leading-tight text-[#503322] sm:text-xs">
//           {review.message}
//         </p>

//         <div className="mt-1 flex items-center justify-between gap-2 text-[9px] text-[#69422d]/80 sm:text-[10px]">
//           <span className="truncate font-bold text-[#503322]">
//             — {review.name}
//           </span>
//           <div className="flex gap-1 font-medium">
//             <button
//               type="button"
//               onClick={() => react("heart")}
//               disabled={loading !== null}
//               className="flex items-center gap-0.5 rounded-full bg-pink-100/60 px-1 py-0.2 transition hover:scale-105 active:scale-95"
//             >
//               ❤️ <span className="text-[8px] sm:text-[9px]">{hearts}</span>
//             </button>
//             <button
//               type="button"
//               onClick={() => react("like")}
//               disabled={loading !== null}
//               className="flex items-center gap-0.5 rounded-full bg-blue-100/60 px-1 py-0.2 transition hover:scale-105 active:scale-95"
//             >
//               👍 <span className="text-[8px] sm:text-[9px]">{likes}</span>
//             </button>
//           </div>
//         </div>

//         <div
//           className={`absolute -bottom-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-b border-r ${
//             review.isChristmas
//               ? "border-emerald-500 bg-[#f0fdf4]"
//               : review.isBirthday
//                 ? "border-pink-400 bg-[#fff0f4]"
//                 : latest
//                   ? "border-amber-400 bg-[#fffdfa]"
//                   : "border-[#503322]/15 bg-[#fffaf5]"
//           }`}
//         />
//       </div>
//     </div>
//   );

//   const renderAvatarAndDecorations = () => (
//     <motion.div
//       className="relative z-10 flex h-[80px] w-[80px] items-center justify-center sm:h-[90px] sm:w-[90px]"
//       animate={{ y: [0, -4, 0] }}
//       transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
//     >
//       {/* GLOW AURAS */}
//       {review.isBirthday && (
//         <motion.div
//           className="absolute inset-[-10px] rounded-full bg-gradient-to-r from-pink-400/40 via-amber-300/40 to-rose-400/40 blur-md -z-10"
//           animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.9, 0.6] }}
//           transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
//         />
//       )}
//       {review.isChristmas && (
//         <motion.div
//           className="absolute inset-[-10px] rounded-full bg-gradient-to-r from-emerald-500/40 via-red-500/40 to-amber-300/40 blur-md -z-10"
//           animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.9, 0.6] }}
//           transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
//         />
//       )}

//       {/* BIRTHDAY PARTICLES */}
//       {review.isBirthday && (
//         <div className="absolute inset-0 pointer-events-none overflow-visible z-30">
//           <motion.span
//             className="absolute left-[-12px] top-[-5px] text-[12px]"
//             animate={{
//               y: [0, -25],
//               x: [-5, -15],
//               opacity: [0, 1, 0],
//               rotate: [0, 45],
//             }}
//             transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
//           >
//             🎉
//           </motion.span>
//           <motion.span
//             className="absolute right-[-12px] top-[-8px] text-[12px]"
//             animate={{
//               y: [0, -28],
//               x: [5, 15],
//               opacity: [0, 1, 0],
//               rotate: [0, -45],
//             }}
//             transition={{
//               duration: 2.5,
//               repeat: Infinity,
//               ease: "easeOut",
//               delay: 0.4,
//             }}
//           >
//             ✨
//           </motion.span>
//           <motion.span
//             className="absolute left-[-8px] bottom-[10px] text-[10px]"
//             animate={{ y: [0, -20], x: [-8, 2], opacity: [0, 1, 0] }}
//             transition={{
//               duration: 2,
//               repeat: Infinity,
//               ease: "easeOut",
//               delay: 0.8,
//             }}
//           >
//             🎈
//           </motion.span>
//           <motion.span
//             className="absolute right-[-6px] bottom-[12px] text-[10px]"
//             animate={{ y: [0, -22], x: [8, -2], opacity: [0, 1, 0] }}
//             transition={{
//               duration: 2.1,
//               repeat: Infinity,
//               ease: "easeOut",
//               delay: 1.2,
//             }}
//           >
//             🎊
//           </motion.span>
//         </div>
//       )}

//       {/* CHRISTMAS PARTICLES */}
//       {review.isChristmas && (
//         <div className="absolute inset-0 pointer-events-none overflow-visible z-30">
//           <motion.span
//             className="absolute left-[-10px] top-[-5px] text-[12px]"
//             animate={{
//               y: [0, -25],
//               x: [-5, -12],
//               opacity: [0, 1, 0],
//               rotate: [0, 180],
//             }}
//             transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
//           >
//             ❄️
//           </motion.span>
//           <motion.span
//             className="absolute right-[-10px] top-[-8px] text-[12px]"
//             animate={{
//               y: [0, -28],
//               x: [5, 12],
//               opacity: [0, 1, 0],
//               rotate: [0, -180],
//             }}
//             transition={{
//               duration: 2.5,
//               repeat: Infinity,
//               ease: "easeOut",
//               delay: 0.4,
//             }}
//           >
//             ✨
//           </motion.span>
//           <motion.span
//             className="absolute left-[-6px] bottom-[10px] text-[10px]"
//             animate={{ y: [0, -20], x: [-6, 2], opacity: [0, 1, 0] }}
//             transition={{
//               duration: 2,
//               repeat: Infinity,
//               ease: "easeOut",
//               delay: 0.8,
//             }}
//           >
//             🎄
//           </motion.span>
//           <motion.span
//             className="absolute right-[-6px] bottom-[12px] text-[10px]"
//             animate={{ y: [0, -22], x: [6, -2], opacity: [0, 1, 0] }}
//             transition={{
//               duration: 2.1,
//               repeat: Infinity,
//               ease: "easeOut",
//               delay: 1.2,
//             }}
//           >
//             🔔
//           </motion.span>
//         </div>
//       )}

//       {/* HATS */}
//       {review.isBirthday && (
//         <motion.div
//           className="absolute -top-4 z-30 pointer-events-none"
//           animate={{ rotate: [-3, 3, -3] }}
//           transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
//         >
//           <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
//             <path d="M12 2L18 20H6L12 2Z" fill="#F43F5E" />
//             <path d="M12 2L15 20H6L12 2Z" fill="#FBBF24" />
//             <circle cx="12" cy="2" r="2.5" fill="#38BDF8" />
//           </svg>
//         </motion.div>
//       )}

//       {review.isChristmas && (
//         <motion.div
//           className="absolute -top-5 z-30 pointer-events-none"
//           animate={{ rotate: [-3, 3, -3] }}
//           transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
//         >
//           <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
//             <path
//               d="M4 19C4 17 8 16 12 16C16 16 20 17 20 19V20H4V19Z"
//               fill="white"
//             />
//             <path d="M6 16L12 3L18 16H6Z" fill="#DC2626" />
//             <circle cx="12" cy="3" r="2.5" fill="white" />
//           </svg>
//         </motion.div>
//       )}

//       {/* ACCESSORIES */}
//       {review.isBirthday && (
//         <motion.div
//           className="absolute -bottom-1 -right-3 z-30 pointer-events-none text-lg sm:text-xl drop-shadow-md"
//           animate={{ y: [0, -3, 0], rotate: [0, 5, 0] }}
//           transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
//         >
//           🎂
//         </motion.div>
//       )}

//       {review.isChristmas && (
//         <motion.div
//           className="absolute -bottom-1 -left-2 z-30 pointer-events-none text-lg sm:text-xl drop-shadow-md"
//           animate={{ y: [0, -3, 0], rotate: [0, -5, 0] }}
//           transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
//         >
//           🎁
//         </motion.div>
//       )}

//       {/* AVATAR WITH DIRECTION FLIP */}
//       <div
//         style={{ transform: !latest && !isLTR ? "scaleX(-1)" : "scaleX(1)" }}
//       >
//         <Avatar
//           type={review.avatar}
//           size={85}
//           state={latest ? "new" : "idle"}
//           reaction={reaction}
//         />
//       </div>

//       {/* REACTION POPUP */}
//       {reaction && (
//         <motion.div
//           initial={{ opacity: 0, y: 10, scale: 0.5 }}
//           animate={{ opacity: [0, 1, 0], y: -40, scale: [0.5, 1.2, 1] }}
//           transition={{ duration: 1 }}
//           className="pointer-events-none absolute -top-4 z-50 text-xl"
//         >
//           {reaction === "heart" ? "❤️" : "👍"}
//         </motion.div>
//       )}
//     </motion.div>
//   );

//   // SPOTLIGHT VIEW
//   if (latest) {
//     return (
//       <div className="flex flex-col items-center pointer-events-auto">
//         {renderBadges()}
//         {renderSpeechBubble()}
//         {renderAvatarAndDecorations()}
//       </div>
//     );
//   }

//   // BACKGROUND WALKING LOOP VIEW
//   return (
//     <motion.div
//       key={`avatar-motion-${review.id}`}
//       className="absolute flex flex-col items-center pointer-events-auto"
//       style={{
//         bottom: `${walkConfig.bottomOffset}%`,
//         zIndex: Math.floor(100 - walkConfig.bottomOffset),
//       }}
//       initial={{
//         x: newReview ? "0vw" : isLTR ? "-30vw" : "130vw",
//         opacity: newReview ? 1 : 0,
//       }}
//       animate={{
//         x: isLTR ? ["-30vw", "130vw"] : ["130vw", "-30vw"],
//         opacity: [0, 1, 1, 0],
//       }}
//       transition={{
//         duration: walkConfig.duration,
//         repeat: Infinity,
//         ease: "linear",
//         delay: newReview ? 0 : walkConfig.delay,
//         times: [0, 0.05, 0.95, 1],
//       }}
//     >
//       {renderBadges()}
//       {renderSpeechBubble()}
//       {renderAvatarAndDecorations()}
//     </motion.div>
//   );
// }

// export const ReviewCharacter = memo(ReviewCharacterComponent);

"use client";

import { motion } from "framer-motion";
import { useState, useMemo, memo, useEffect } from "react";
import { Avatar } from "@/components/avatars/Avatar";

type Review = {
  id: number;
  name: string;
  message: string;
  avatar: string;
  likes: number;
  hearts: number;
  isBirthday?: boolean;
  isChristmas?: boolean;
  createdAt: Date | string;
};

type Props = {
  review: Review;
  latest?: boolean;
  index: number;
  newReview?: boolean;
};

function ReviewCharacterComponent({
  review,
  latest = false,
  newReview = false,
}: Props) {
  const [likes, setLikes] = useState(review.likes);
  const [hearts, setHearts] = useState(review.hearts);
  const [loading, setLoading] = useState<"like" | "heart" | null>(null);
  const [reaction, setReaction] = useState<"like" | "heart" | null>(null);

  // Sync likes and hearts on realtime updates
  useEffect(() => {
    setLikes(review.likes);
    setHearts(review.hearts);
  }, [review.likes, review.hearts]);

  const walkConfig = useMemo(() => {
    const idNum = typeof review.id === "number" ? review.id : 1;
    const direction = idNum % 2 === 0 ? "ltr" : "rtl";
    const duration = 45 + (idNum % 20);
    const bottomOffset = 4 + (idNum % 6) * 3.5;
    return { direction, duration, bottomOffset };
  }, [review.id]);

  const isLTR = walkConfig.direction === "ltr";

  async function react(selectedReaction: "like" | "heart") {
    if (loading) return;

    setLoading(selectedReaction);
    setReaction(selectedReaction);

    if (selectedReaction === "like") setLikes((v) => v + 1);
    else setHearts((v) => v + 1);

    try {
      const response = await fetch(`/api/reviews/${review.id}/reaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reaction: selectedReaction }),
      });
      if (!response.ok) throw new Error("Reaction failed");
    } catch {
      if (selectedReaction === "like") setLikes((v) => Math.max(0, v - 1));
      else setHearts((v) => Math.max(0, v - 1));
    } finally {
      setTimeout(() => setReaction(null), 1000);
      setLoading(null);
    }
  }

  const renderBadges = () => (
    <div className="relative z-50 mb-1 flex flex-col items-center gap-0.5">
      {latest && (
        <div className="rounded-full bg-[#503322] px-2 py-0.5 text-[7px] font-bold tracking-[0.18em] text-amber-200 shadow-md sm:text-[8px]">
          ✦ LATEST MESSAGE
        </div>
      )}
      {review.isBirthday && (
        <div className="rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 px-2.5 py-0.5 text-[7px] font-extrabold tracking-wider text-white shadow-lg sm:text-[8px] animate-pulse">
          🎂 BIRTHDAY CELEBRATION! 🎈
        </div>
      )}
      {review.isChristmas && (
        <div className="rounded-full bg-gradient-to-r from-emerald-600 via-red-600 to-amber-500 px-2.5 py-0.5 text-[7px] font-extrabold tracking-wider text-white shadow-lg sm:text-[8px] animate-pulse">
          💫 SPECIAL DAY ✨🎉
        </div>
      )}
    </div>
  );

  const renderSpeechBubble = () => (
    <div className="relative z-40 mb-1.5 flex justify-center">
      <div
        className={`relative inline-block w-fit min-w-[120px] max-w-[180px] sm:max-w-[220px] rounded-[16px] border px-2.5 py-1.5 text-center shadow-md backdrop-blur-md transition-all ${
          review.isChristmas
            ? "border-emerald-500 bg-[#f0fdf4]/95 ring-2 ring-emerald-500/50 shadow-[0_4px_16px_rgba(16,185,129,0.25)]"
            : review.isBirthday
              ? "border-pink-400 bg-[#fff0f4]/95 ring-2 ring-pink-400/50 shadow-[0_4px_16px_rgba(236,72,153,0.25)]"
              : latest
                ? "border-amber-400 bg-[#fffdfa]/95 ring-2 ring-amber-300/50 shadow-[0_4px_14px_rgba(217,119,6,0.15)]"
                : "border-[#503322]/15 bg-[#fffaf5]/95 shadow-sm"
        }`}
      >
        <p className="line-clamp-2 break-words text-[10px] font-medium leading-tight text-[#503322] sm:text-xs">
          {review.message}
        </p>

        <div className="mt-1 flex items-center justify-between gap-2 text-[9px] text-[#69422d]/80 sm:text-[10px]">
          <span className="truncate font-bold text-[#503322]">
            — {review.name}
          </span>
          <div className="flex gap-1 font-medium">
            <button
              type="button"
              onClick={() => react("heart")}
              disabled={loading !== null}
              className="flex items-center gap-0.5 rounded-full bg-pink-100/60 px-1 py-0.2 transition hover:scale-105 active:scale-95"
            >
              ❤️ <span className="text-[8px] sm:text-[9px]">{hearts}</span>
            </button>
            <button
              type="button"
              onClick={() => react("like")}
              disabled={loading !== null}
              className="flex items-center gap-0.5 rounded-full bg-blue-100/60 px-1 py-0.2 transition hover:scale-105 active:scale-95"
            >
              👍 <span className="text-[8px] sm:text-[9px]">{likes}</span>
            </button>
          </div>
        </div>

        <div
          className={`absolute -bottom-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-b border-r ${
            review.isChristmas
              ? "border-emerald-500 bg-[#f0fdf4]"
              : review.isBirthday
                ? "border-pink-400 bg-[#fff0f4]"
                : latest
                  ? "border-amber-400 bg-[#fffdfa]"
                  : "border-[#503322]/15 bg-[#fffaf5]"
          }`}
        />
      </div>
    </div>
  );

  const renderAvatarAndDecorations = () => (
    <motion.div
      className="relative z-10 flex h-[80px] w-[80px] items-center justify-center sm:h-[90px] sm:w-[90px]"
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
    >
      {review.isBirthday && (
        <motion.div
          className="absolute inset-[-10px] rounded-full bg-gradient-to-r from-pink-400/40 via-amber-300/40 to-rose-400/40 blur-md -z-10"
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      {review.isChristmas && (
        <motion.div
          className="absolute inset-[-10px] rounded-full bg-gradient-to-r from-emerald-500/40 via-red-500/40 to-amber-300/40 blur-md -z-10"
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* BIRTHDAY PARTICLES */}
      {review.isBirthday && (
        <div className="absolute inset-0 pointer-events-none overflow-visible z-30">
          <motion.span
            className="absolute left-[-12px] top-[-5px] text-[12px]"
            animate={{
              y: [0, -25],
              x: [-5, -15],
              opacity: [0, 1, 0],
              rotate: [0, 45],
            }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
          >
            🎉
          </motion.span>
          <motion.span
            className="absolute right-[-12px] top-[-8px] text-[12px]"
            animate={{
              y: [0, -28],
              x: [5, 15],
              opacity: [0, 1, 0],
              rotate: [0, -45],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.4,
            }}
          >
            ✨
          </motion.span>
          <motion.span
            className="absolute left-[-8px] bottom-[10px] text-[10px]"
            animate={{ y: [0, -20], x: [-8, 2], opacity: [0, 1, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.8,
            }}
          >
            🎈
          </motion.span>
          <motion.span
            className="absolute right-[-6px] bottom-[12px] text-[10px]"
            animate={{ y: [0, -22], x: [8, -2], opacity: [0, 1, 0] }}
            transition={{
              duration: 2.1,
              repeat: Infinity,
              ease: "easeOut",
              delay: 1.2,
            }}
          >
            🎊
          </motion.span>
        </div>
      )}

      {/* CHRISTMAS PARTICLES */}
      {review.isChristmas && (
        <div className="absolute inset-0 pointer-events-none overflow-visible z-30">
          <motion.span
            className="absolute left-[-10px] top-[-5px] text-[12px]"
            animate={{
              y: [0, -25],
              x: [-5, -12],
              opacity: [0, 1, 0],
              rotate: [0, 180],
            }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
          >
            ❄️
          </motion.span>
          <motion.span
            className="absolute right-[-10px] top-[-8px] text-[12px]"
            animate={{
              y: [0, -28],
              x: [5, 12],
              opacity: [0, 1, 0],
              rotate: [0, -180],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.4,
            }}
          >
            ✨
          </motion.span>
          <motion.span
            className="absolute left-[-6px] bottom-[10px] text-[10px]"
            animate={{ y: [0, -20], x: [-6, 2], opacity: [0, 1, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.8,
            }}
          >
            🎄
          </motion.span>
          <motion.span
            className="absolute right-[-6px] bottom-[12px] text-[10px]"
            animate={{ y: [0, -22], x: [6, -2], opacity: [0, 1, 0] }}
            transition={{
              duration: 2.1,
              repeat: Infinity,
              ease: "easeOut",
              delay: 1.2,
            }}
          >
            🔔
          </motion.span>
        </div>
      )}

      {/* HATS */}
      {review.isBirthday && (
        <motion.div
          className="absolute -top-4 z-30 pointer-events-none"
          animate={{ rotate: [-3, 3, -3] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L18 20H6L12 2Z" fill="#F43F5E" />
            <path d="M12 2L15 20H6L12 2Z" fill="#FBBF24" />
            <circle cx="12" cy="2" r="2.5" fill="#38BDF8" />
          </svg>
        </motion.div>
      )}

      {review.isChristmas && (
        <motion.div
          className="absolute -top-5 z-30 pointer-events-none"
          animate={{ rotate: [-3, 3, -3] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 19C4 17 8 16 12 16C16 16 20 17 20 19V20H4V19Z"
              fill="white"
            />
            <path d="M6 16L12 3L18 16H6Z" fill="#DC2626" />
            <circle cx="12" cy="3" r="2.5" fill="white" />
          </svg>
        </motion.div>
      )}

      {/* ACCESSORIES */}
      {review.isBirthday && (
        <motion.div
          className="absolute -bottom-1 -right-3 z-30 pointer-events-none text-lg sm:text-xl drop-shadow-md"
          animate={{ y: [0, -3, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        >
          🎂
        </motion.div>
      )}

      {review.isChristmas && (
        <motion.div
          className="absolute -bottom-1 -left-2 z-30 pointer-events-none text-lg sm:text-xl drop-shadow-md"
          animate={{ y: [0, -3, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        >
          🎁
        </motion.div>
      )}

      {/* AVATAR WITH DIRECTION FLIP */}
      <div
        style={{ transform: !latest && !isLTR ? "scaleX(-1)" : "scaleX(1)" }}
      >
        <Avatar
          type={review.avatar}
          size={85}
          state={latest ? "new" : "idle"}
          reaction={reaction}
        />
      </div>

      {/* REACTION POPUP */}
      {reaction && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.5 }}
          animate={{ opacity: [0, 1, 0], y: -40, scale: [0.5, 1.2, 1] }}
          transition={{ duration: 1 }}
          className="pointer-events-none absolute -top-4 z-50 text-xl"
        >
          {reaction === "heart" ? "❤️" : "👍"}
        </motion.div>
      )}
    </motion.div>
  );

  // 1. SPOTLIGHT VIEW (STATIONARY AT CENTER)
  if (latest) {
    return (
      <div className="flex flex-col items-center pointer-events-auto">
        {renderBadges()}
        {renderSpeechBubble()}
        {renderAvatarAndDecorations()}
      </div>
    );
  }

  // 2. BACKGROUND WALKING LOOP VIEW (WALKS OUT FROM CENTER IF NEWLY UN-SPOTLIGHTED)
  const startPos = newReview ? "0vw" : isLTR ? "-30vw" : "130vw";
  const endPos = isLTR ? "130vw" : "-30vw";

  return (
    <motion.div
      key={`avatar-motion-${review.id}`}
      className="absolute flex flex-col items-center pointer-events-auto"
      style={{
        bottom: `${walkConfig.bottomOffset}%`,
        zIndex: Math.floor(100 - walkConfig.bottomOffset),
      }}
      initial={{
        x: startPos,
        opacity: newReview ? 1 : 0,
      }}
      animate={{
        x: [startPos, endPos],
        opacity: [newReview ? 1 : 0, 1, 1, 0],
      }}
      transition={{
        duration: newReview ? walkConfig.duration * 0.5 : walkConfig.duration,
        repeat: Infinity,
        ease: "linear",
        times: [0, 0.05, 0.95, 1],
      }}
    >
      {renderBadges()}
      {renderSpeechBubble()}
      {renderAvatarAndDecorations()}
    </motion.div>
  );
}

export const ReviewCharacter = memo(ReviewCharacterComponent);
