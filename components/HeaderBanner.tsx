"use client";

import { useState, useEffect } from "react";
import { Clock, MessageSquareQuote, Sparkles } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const MOTIVATIONAL_QUOTES = [
  "A little thought, a little character. ☕",
  "Small steps lead to sweet memories. ✨",
  "Warm coffee, warm hearts, warm stories.",
  "Spread joy, one message at a time. 🥐",
  "Every review brings a smile to the wall. 🌟",
];

type Props = {
  initialCount?: number;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function HeaderBanner({ initialCount = 0 }: Props) {
  const [dailyCount, setDailyCount] = useState<number>(initialCount);
  const [timeString, setTimeString] = useState<string>("");
  const [dateString, setDateString] = useState<string>("");
  const [quote, setQuote] = useState<string>("");

  useEffect(() => {
    const randomQuote =
      MOTIVATIONAL_QUOTES[
        Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)
      ];
    setQuote(randomQuote);

    async function fetchInitialCount() {
      const { count, error } = await supabase
        .from("reviews")
        .select("*", { count: "exact", head: true });

      if (!error && count !== null) {
        setDailyCount(count);
      }
    }

    fetchInitialCount();

    const channel = supabase
      .channel("header-count-sync")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "reviews" },
        () => {
          setDailyCount((prev) => prev + 1);
        },
      )
      .subscribe();

    const updateDateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
      setDateString(
        now.toLocaleDateString([], {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
      );
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);

    return () => {
      clearInterval(timer);
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="w-full bg-[#503322] text-[#fffaf5] px-4 py-2.5 landscape:py-1 landscape:px-3 shadow-md transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row landscape:flex-row items-center justify-between gap-2 landscape:gap-3 text-xs sm:text-sm">
        {/* Motivational Quote (hidden on short landscape screens to save vertical space) */}
        <div className="flex items-center gap-2 font-medium tracking-wide text-amber-200/90 text-center md:text-left landscape:text-left">
          <Sparkles
            size={14}
            className="text-amber-300 shrink-0 landscape:w-3 landscape:h-3"
          />
          <span className="landscape:text-[11px] truncate max-w-[280px] sm:max-w-none">
            {quote || "A little thought, a little character. ☕"}
          </span>
        </div>

        {/* Counter and Clock */}
        <div className="flex items-center gap-4 sm:gap-6 landscape:gap-3 text-[11px] sm:text-xs">
          {/* Daily Message Counter */}
          <div className="flex items-center gap-1.5 bg-[#69422d]/60 px-3 py-1 landscape:py-0.5 landscape:px-2 rounded-full border border-[#835339]/50">
            <MessageSquareQuote
              size={13}
              className="text-pink-300 landscape:w-3 landscape:h-3"
            />
            <span className="text-amber-100/80 landscape:text-[10px]">
              Today&apos;s Messages:
            </span>
            <span className="font-bold text-white bg-[#b95745] px-1.5 py-0.2 rounded-full text-xs landscape:text-[10px]">
              {dailyCount}
            </span>
          </div>

          {/* Local Device Date & Time */}
          <div className="flex items-center gap-1.5 font-mono text-amber-100/90 bg-[#69422d]/30 px-2.5 py-1 landscape:py-0.5 landscape:px-2 rounded-md">
            <Clock
              size={12}
              className="text-amber-300 landscape:w-3 landscape:h-3"
            />
            <span className="landscape:text-[10px]">{dateString}</span>
            <span className="opacity-40">|</span>
            <span className="font-semibold text-white landscape:text-[10px]">
              {timeString || "--:--:--"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
