import { NextRequest, NextResponse } from "next/server";
import { desc, gte, count } from "drizzle-orm";
import { reviews } from "@/db/schema";
import { AVATARS } from "@/lib/avatars";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // Get midnight today (UTC)
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);

    // Run review fetch and daily count in parallel
    const [latestReviews, [todayCountResult]] = await Promise.all([
      db.select().from(reviews).orderBy(desc(reviews.createdAt)).limit(7),

      db
        .select({ value: count() })
        .from(reviews)
        .where(gte(reviews.createdAt, todayStart)),
    ]);

    return NextResponse.json({
      reviews: latestReviews,
      dailyCount: todayCountResult?.value ?? 0,
    });
  } catch (error) {
    console.error("GET /api/reviews", error);

    return NextResponse.json(
      {
        error: "Unable to load reviews",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const name = String(body.name ?? "").trim();
    const message = String(body.message ?? "").trim();
    const avatar = String(body.avatar ?? "").trim();
    const isBirthday = Boolean(body.isBirthday);
    const isChristmas = Boolean(body.isChristmas);

    if (!name) {
      return NextResponse.json(
        { error: "Please enter your name." },
        { status: 400 },
      );
    }

    if (!message) {
      return NextResponse.json(
        { error: "Please enter a message." },
        { status: 400 },
      );
    }

    if (message.length > 200) {
      return NextResponse.json(
        { error: "Your message must be 200 characters or less." },
        { status: 400 },
      );
    }

    const validAvatar = AVATARS.some((item) => item.id === avatar);

    if (!validAvatar) {
      return NextResponse.json(
        { error: "Please choose a character." },
        { status: 400 },
      );
    }
    

    const [review] = await db
      .insert(reviews)
      .values({
        name: name.slice(0, 50),
        message,
        avatar,
        isBirthday,
        isChristmas: Boolean(isChristmas),
      })
      .returning();

    return NextResponse.json(review, {
      status: 201,
    });
  } catch (error) {
    console.error("POST /api/reviews", error);

    return NextResponse.json(
      {
        error: "Unable to create review.",
      },
      {
        status: 500,
      },
    );
  }
}
