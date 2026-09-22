"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { ReviewModal } from "./ReviewModal";

export function AddReviewButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="
          flex
          items-center
          gap-2
          rounded-full
          bg-[#69422d]
          px-5
          py-3
          text-sm
          font-medium
          text-white
          shadow-sm
          transition
          hover:scale-[1.03]
          active:scale-95
        "
      >
        <Plus size={16} />

        <span className="hidden sm:inline">Leave a little note</span>

        <span className="sm:hidden">Say something</span>
      </button>

      <ReviewModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
