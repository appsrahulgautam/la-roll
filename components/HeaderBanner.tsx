"use client";

import { useState, useEffect } from "react";
import { Clock, MessageSquareQuote, Sparkles } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

type Props = {
  initialCount?: number;
};

type Quote = {
  id: string;
  quote: string;
  created_at: string;
  updated_at: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function HeaderBanner({ initialCount = 0 }: Props) {
  const [dailyCount, setDailyCount] = useState<number>(initialCount);

  const [timeString, setTimeString] = useState<string>("");

  const [dateString, setDateString] = useState<string>("");

  const [quotes, setQuotes] = useState<string[]>([]);
  const [quoteIndex, setQuoteIndex] = useState(0);
  // -----------------------------------------
  // GET TODAY'S DATE RANGE
  // -----------------------------------------
  const getTodayRange = () => {
    const now = new Date();

    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0,
    );

    const startOfTomorrow = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      0,
      0,
    );

    return {
      start: startOfDay.toISOString(),
      end: startOfTomorrow.toISOString(),
    };
  };

  // -----------------------------------------
  // LOAD TODAY'S REVIEW COUNT
  // -----------------------------------------
  const fetchDailyCount = async () => {
    const { start, end } = getTodayRange();

    const { count, error } = await supabase
      .from("reviews")
      .select("*", {
        count: "exact",
        head: true,
      })
      .gte("created_at", start)
      .lt("created_at", end);

    if (error) {
      console.error("Failed to load today's review count:", error);
      return;
    }

    setDailyCount(count ?? 0);
  };

  // -----------------------------------------
  // LOAD MOTIVATIONAL QUOTE
  // -----------------------------------------
  const fetchQuotes = async () => {
    const { data, error } = await supabase
      .from("motivational_quotes")
      .select("quote")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error("Failed to load motivational quotes:", error);
      return;
    }

    setQuotes((data ?? []).map((item) => item.quote));
  };

  // -----------------------------------------
  // INITIAL LOAD + REALTIME
  // -----------------------------------------
  useEffect(() => {
    fetchDailyCount();
    fetchQuotes();

    // -----------------------------------------
    // REVIEWS REALTIME
    // -----------------------------------------
    const reviewsChannel = supabase
      .channel("header-reviews-sync")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "reviews",
        },
        (payload) => {
          const createdAt = (payload.new as any)?.created_at;

          if (!createdAt) {
            fetchDailyCount();
            return;
          }

          const { start, end } = getTodayRange();

          const createdTime = new Date(createdAt).getTime();

          const startTime = new Date(start).getTime();

          const endTime = new Date(end).getTime();

          // Only increment if the new review
          // belongs to today
          if (createdTime >= startTime && createdTime < endTime) {
            setDailyCount((prev) => prev + 1);
            setQuotes((currentQuotes) => {
              if (currentQuotes.length === 0) {
                return currentQuotes;
              }
              setQuoteIndex((currentIndex) => {
                return (currentIndex + 1) % currentQuotes.length;
              });
              return currentQuotes;
            });
          }
        },
      )
      .subscribe((status) => {
        console.log("Header reviews realtime:", status);
      });

    // -----------------------------------------
    // MOTIVATIONAL QUOTES REALTIME
    // -----------------------------------------
    const quotesChannel = supabase
      .channel("header-quotes-sync")

      // New quote added
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "motivational_quotes",
        },
        () => {
          fetchQuotes();
        },
      )

      // Existing quote edited
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "motivational_quotes",
        },
        () => {
          fetchQuotes();
        },
      )

      // Quote deleted
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "motivational_quotes",
        },
        () => {
          fetchQuotes();
        },
      )

      .subscribe((status) => {
        console.log("Header quotes realtime:", status);
      });

    // -----------------------------------------
    // CLOCK
    // -----------------------------------------
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

    // -----------------------------------------
    // MIDNIGHT RESET
    // -----------------------------------------
    const midnightTimer = setInterval(() => {
      const now = new Date();

      if (now.getHours() === 0 && now.getMinutes() === 0) {
        fetchDailyCount();
      }
    }, 60 * 1000);

    // -----------------------------------------
    // CLEANUP
    // -----------------------------------------
    return () => {
      clearInterval(timer);
      clearInterval(midnightTimer);

      supabase.removeChannel(reviewsChannel);

      supabase.removeChannel(quotesChannel);
    };
  }, []);

  return (
    <div className="w-full bg-[#503322] px-4 py-2.5 text-[#fffaf5] shadow-md transition-all landscape:px-3 landscape:py-1">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 text-xs sm:text-sm md:flex-row landscape:flex-row landscape:gap-3">
        {/* ----------------------------------------- */}
        {/* MOTIVATIONAL QUOTE */}
        {/* ----------------------------------------- */}
        <div className="flex items-center gap-2 text-center font-medium tracking-wide text-amber-200/90 md:text-left landscape:text-left">
          <Sparkles
            size={14}
            className="shrink-0 text-amber-300 landscape:h-3 landscape:w-3"
          />

          <span className="max-w-[280px] truncate landscape:text-[11px] sm:max-w-none">
            {quotes.length > 0
              ? quotes[quoteIndex]
              : "A little thought, a little character. ☕"}
          </span>
        </div>

        {/* ----------------------------------------- */}
        {/* COUNTER + CLOCK */}
        {/* ----------------------------------------- */}
        <div className="flex items-center gap-4 text-[11px] sm:gap-6 sm:text-xs landscape:gap-3">
          {/* TODAY'S MESSAGE COUNTER */}
          <div className="flex items-center gap-1.5 rounded-full border border-[#835339]/50 bg-[#69422d]/60 px-3 py-1 landscape:px-2 landscape:py-0.5">
            <MessageSquareQuote
              size={13}
              className="text-pink-300 landscape:h-3 landscape:w-3"
            />

            <span className="text-amber-100/80 landscape:text-[10px]">
              Today&apos;s Messages:
            </span>

            <span className="rounded-full bg-[#b95745] px-1.5 py-0.2 text-xs font-bold text-white landscape:text-[10px]">
              {dailyCount}
            </span>
          </div>

          {/* ----------------------------------------- */}
          {/* LOCAL DATE & TIME */}
          {/* ----------------------------------------- */}
          <div className="flex items-center gap-1.5 rounded-md bg-[#69422d]/30 px-2.5 py-1 font-mono text-amber-100/90 landscape:px-2 landscape:py-0.5">
            <Clock
              size={12}
              className="text-amber-300 landscape:h-3 landscape:w-3"
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
