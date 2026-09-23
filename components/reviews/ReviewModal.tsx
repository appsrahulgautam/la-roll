"use client";

import { useState } from "react";
import { X, Cake } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { AVATARS } from "@/lib/avatars";
import { Avatar } from "@/components/avatars/Avatar";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function ReviewModal({ open, onClose }: Props) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [avatar, setAvatar] = useState("bear");
  const [isBirthday, setIsBirthday] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function submit() {
    if (!name.trim() || !message.trim()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          message,
          avatar,
          isBirthday,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to submit");
      }

      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-end
        justify-center
        bg-[#503322]/40
        p-0
        backdrop-blur-sm
        sm:items-center
        sm:p-4
      "
    >
      <div
        className="
          relative
          max-h-[85vh]
          w-full
          max-w-lg
          overflow-y-auto
          rounded-t-[28px]
          bg-[#fffaf4]
          p-5
          shadow-2xl
          sm:max-h-[90vh]
          sm:rounded-[32px]
          sm:p-8
        "
      >
        {/* Sticky top mobile handle bar */}
        <div className="mb-3 flex justify-center sm:hidden">
          <div className="h-1.5 w-10 rounded-full bg-[#e6d5cf]" />
        </div>

        <button
          onClick={onClose}
          className="
            absolute
            right-4
            top-4
            rounded-full
            p-2
            text-[#684535]
            hover:bg-[#f5e9e3]
            sm:right-5
            sm:top-5
          "
        >
          <X size={20} />
        </button>

        <div className="pr-8 sm:pr-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#a08378] sm:text-xs">
            La Roll
          </p>

          <h2 className="mt-1 font-serif text-2xl text-[#503322] sm:mt-2 sm:text-3xl">
            A little thought.
            <br />A little character.
          </h2>
        </div>

        <div className="mt-5 space-y-4 sm:mt-7 sm:space-y-5">
          {/* Name */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#684535] sm:mb-2 sm:text-sm">
              Your name
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
              placeholder="What should we call you?"
              className="
                w-full
                rounded-xl
                border
                border-[#e6d5cf]
                bg-white
                px-3.5
                py-2.5
                text-sm
                text-[#503322]
                outline-none
                placeholder:text-[#b7a29a]
                focus:border-[#9b6855]
                sm:rounded-2xl
                sm:px-4
                sm:py-3.5
              "
            />
          </div>

          {/* Message */}
          <div>
            <div className="mb-1.5 flex items-center justify-between sm:mb-2">
              <label className="text-xs font-medium text-[#684535] sm:text-sm">
                Your message
              </label>

              <span className="text-[10px] text-[#a08378] sm:text-xs">
                {message.length} / 150
              </span>
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, 150))}
              maxLength={150}
              rows={3}
              placeholder="Coffee first. Everything else later ☕"
              className="
                w-full
                resize-none
                rounded-xl
                border
                border-[#e6d5cf]
                bg-white
                px-3.5
                py-2.5
                text-sm
                text-[#503322]
                outline-none
                placeholder:text-[#b7a29a]
                focus:border-[#9b6855]
                sm:rounded-2xl
                sm:px-4
                sm:py-3.5
              "
            />
          </div>

          {/* Birthday Celebration Checkbox */}
          <div className="rounded-xl border border-[#e6d5cf] bg-white p-3.5 sm:rounded-2xl sm:p-4">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={isBirthday}
                onChange={(e) => setIsBirthday(e.target.checked)}
                className="h-4 w-4 rounded border-[#e6d5cf] text-[#b95745] focus:ring-[#b95745]"
              />
              <div className="flex items-center gap-2">
                <Cake size={18} className="text-[#b95745]" />
                <span className="text-xs font-medium text-[#503322] sm:text-sm">
                  I am celebrating my birthday! 🎂🎉
                </span>
              </div>
            </label>
          </div>

          {/* Avatar Picker */}
          <div>
            <label className="mb-2 block text-xs font-medium text-[#684535] sm:mb-3 sm:text-sm">
              Pick your little character
            </label>

            <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 sm:gap-3">
              {AVATARS.map((item) => {
                const selected = avatar === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAvatar(item.id)}
                    className={`
                      relative
                      flex
                      flex-col
                      items-center
                      justify-center
                      rounded-xl
                      border
                      p-1.5
                      transition
                      active:scale-95
                      sm:rounded-2xl
                      sm:p-2
                      ${
                        selected
                          ? "border-[#69422d] bg-[#f7e5e3]"
                          : "border-[#eadbd5] bg-white hover:bg-[#fff6f2]"
                      }
                    `}
                  >
                    <div className="relative flex h-12 w-12 items-center justify-center sm:h-14 sm:w-14">
                      {/* Highlight Aura Glow */}
                      {isBirthday && selected && (
                        <motion.div
                          className="absolute inset-[-4px] rounded-full bg-gradient-to-r from-pink-400/40 via-amber-300/40 to-rose-400/40 blur-sm"
                          animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.6, 0.9, 0.6],
                          }}
                          transition={{
                            duration: 1.8,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                      )}

                      <Avatar
                        type={item.id}
                        size={52}
                        state={selected ? "selected" : "idle"}
                      />

                      {/* Birthday Decorations */}
                      <AnimatePresence>
                        {isBirthday && selected && (
                          <>
                            {/* Party Hat SVG */}
                            <motion.div
                              initial={{ opacity: 0, scale: 0.5, y: 5 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.5 }}
                              className="absolute -top-3 left-1/2 -translate-x-1/2 pointer-events-none select-none z-20"
                            >
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M12 2L18 20H6L12 2Z" fill="#F43F5E" />
                                <path d="M12 2L15 20H6L12 2Z" fill="#FBBF24" />
                                <circle cx="12" cy="2" r="2.5" fill="#38BDF8" />
                              </svg>
                            </motion.div>

                            {/* Floating Cake */}
                            <motion.span
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.5 }}
                              className="absolute -bottom-1 -right-1 text-xs sm:text-sm select-none pointer-events-none z-20 drop-shadow-sm"
                            >
                              🎂
                            </motion.span>

                            {/* Floating Confetti Sparkles */}
                            <motion.span
                              initial={{ opacity: 0, y: 0 }}
                              animate={{ opacity: [0, 1, 0], y: [-2, -12] }}
                              transition={{ duration: 1.8, repeat: Infinity }}
                              className="absolute -top-1 -right-1 text-[10px] select-none pointer-events-none z-20"
                            >
                              🎉
                            </motion.span>
                          </>
                        )}
                      </AnimatePresence>
                    </div>

                    <span className="mt-0.5 max-w-full truncate text-[9px] font-medium text-[#684535] sm:text-[10px]">
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={submit}
            disabled={loading || !name.trim() || !message.trim()}
            className="
              w-full
              rounded-xl
              bg-[#b95745]
              px-4
              py-3
              text-xs
              font-semibold
              text-white
              transition
              hover:bg-[#a94d3d]
              active:scale-[0.98]
              disabled:cursor-not-allowed
              disabled:opacity-50
              sm:rounded-2xl
              sm:px-5
              sm:py-4
              sm:text-sm
            "
          >
            {loading ? "Sending..." : "Send it to the wall →"}
          </button>
        </div>
      </div>
    </div>
  );
}
