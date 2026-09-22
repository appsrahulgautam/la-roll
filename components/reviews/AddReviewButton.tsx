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
          gap-1.5
          rounded-full
          bg-[#69422d]
          px-3.5
          py-2
          text-xs
          font-medium
          text-white
          shadow-sm
          transition
          hover:scale-[1.03]
          active:scale-95
          sm:gap-2
          sm:px-5
          sm:py-3
          sm:text-sm
        "
      >
        <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />

        <span className="hidden sm:inline">Leave a little note</span>

        <span className="sm:hidden">Say something</span>
      </button>

      <ReviewModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
