"use client";

import { useState } from "react";
import { X } from "lucide-react";

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
        items-center
        justify-center
        bg-[#503322]/30
        p-4
        backdrop-blur-sm
      "
    >
      <div
        className="
          relative
          max-h-[90vh]
          w-full
          max-w-lg
          overflow-y-auto
          rounded-[32px]
          bg-[#fffaf4]
          p-6
          shadow-2xl
          md:p-8
        "
      >
        <button
          onClick={onClose}
          className="
            absolute
            right-5
            top-5
            rounded-full
            p-2
            text-[#684535]
            hover:bg-[#f5e9e3]
          "
        >
          <X size={20} />
        </button>

        <div className="pr-10">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#a08378]">
            La Roll
          </p>

          <h2 className="mt-2 font-serif text-3xl text-[#503322]">
            A little thought.
            <br />A little character.
          </h2>
        </div>

        <div className="mt-7 space-y-5">
          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#684535]">
              Your name
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
              placeholder="What should we call you?"
              className="
                w-full
                rounded-2xl
                border
                border-[#e6d5cf]
                bg-white
                px-4
                py-3.5
                text-[#503322]
                outline-none
                placeholder:text-[#b7a29a]
                focus:border-[#9b6855]
              "
            />
          </div>

          {/* Message */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-[#684535]">
                Your message
              </label>

              <span className="text-xs text-[#a08378]">
                {message.length} / 150
              </span>
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, 200))}
              maxLength={150}
              rows={4}
              placeholder="Coffee first. Everything else later ☕"
              className="
                w-full
                resize-none
                rounded-2xl
                border
                border-[#e6d5cf]
                bg-white
                px-4
                py-3.5
                text-[#503322]
                outline-none
                placeholder:text-[#b7a29a]
                focus:border-[#9b6855]
              "
            />
          </div>

          {/* Avatar */}
          <div>
            <label className="mb-3 block text-sm font-medium text-[#684535]">
              Pick your little character
            </label>

            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
              {AVATARS.map((item) => {
                const selected = avatar === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAvatar(item.id)}
                    className={`
          flex
          flex-col
          items-center
          rounded-2xl
          border
          p-2
          transition
          ${
            selected
              ? "border-[#69422d] bg-[#f7e5e3]"
              : "border-[#eadbd5] bg-white hover:bg-[#fff6f2]"
          }
        `}
                  >
                    <Avatar
                      type={item.id}
                      size={70}
                      state={selected ? "selected" : "idle"}
                    />

                    <span className="mt-1 text-[10px] text-[#684535]">
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
              rounded-2xl
              bg-[#b95745]
              px-5
              py-4
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-[#a94d3d]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {loading ? "Sending..." : "Send it to the wall →"}
          </button>
        </div>
      </div>
    </div>
  );
}
