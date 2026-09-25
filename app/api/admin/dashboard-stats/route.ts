import { NextResponse } from "next/server";
import { and, count, eq, gte, lt, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { admins, reviews, motivationalQuotes } from "@/db/schema";

export async function GET() {
  try {
    // Start/end of today in the server's local timezone.
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

    const [
      reviewsResult,
      todayReviewsResult,
      quotesResult,
      adminsResult,
      superAdminsResult,
      developersResult,
      engagementResult,
    ] = await Promise.all([
      db.select({ count: count() }).from(reviews),

      db
        .select({ count: count() })
        .from(reviews)
        .where(
          and(
            gte(reviews.createdAt, startOfToday),
            lt(reviews.createdAt, startOfTomorrow),
          ),
        ),

      db.select({ count: count() }).from(motivationalQuotes),

      db.select({ count: count() }).from(admins),

      db
        .select({ count: count() })
        .from(admins)
        .where(eq(admins.role, "super-admin")),

      db
        .select({ count: count() })
        .from(admins)
        .where(eq(admins.role, "developer")),

      db
        .select({
          totalLikes: sql<number>`COALESCE(SUM(${reviews.likes}), 0)`,
          totalHearts: sql<number>`COALESCE(SUM(${reviews.hearts}), 0)`,
        })
        .from(reviews),
    ]);

    return NextResponse.json({
      reviewsCount: Number(reviewsResult[0]?.count ?? 0),
      todayReviewsCount: Number(todayReviewsResult[0]?.count ?? 0),
      quotesCount: Number(quotesResult[0]?.count ?? 0),

      adminsCount: Number(adminsResult[0]?.count ?? 0),
      superAdminsCount: Number(superAdminsResult[0]?.count ?? 0),
      developersCount: Number(developersResult[0]?.count ?? 0),

      totalLikes: Number(engagementResult[0]?.totalLikes ?? 0),
      totalHearts: Number(engagementResult[0]?.totalHearts ?? 0),
    });
  } catch (error) {
    console.error("Failed to load dashboard stats:", error);

    return NextResponse.json(
      {
        error: "Failed to load dashboard statistics.",
      },
      { status: 500 },
    );
  }
}
