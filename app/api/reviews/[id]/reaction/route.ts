import { NextRequest, NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { reviews } from "@/db/schema";

export async function POST(
  request: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    const { id } = await context.params;

    const reviewId = Number(id);

    if (!Number.isInteger(reviewId)) {
      return NextResponse.json(
        { error: "Invalid review ID." },
        { status: 400 },
      );
    }

    const body = await request.json();

    const reaction = body.reaction;

    if (reaction !== "like" && reaction !== "heart") {
      return NextResponse.json({ error: "Invalid reaction." }, { status: 400 });
    }

    const field = reaction === "like" ? reviews.likes : reviews.hearts;

    const [updatedReview] = await db
      .update(reviews)
      .set({
        [reaction === "like" ? "likes" : "hearts"]: sql`${field} + 1`,
      })
      .where(eq(reviews.id, reviewId))
      .returning();

    if (!updatedReview) {
      return NextResponse.json({ error: "Review not found." }, { status: 404 });
    }

    return NextResponse.json(updatedReview);
  } catch (error) {
    console.error("POST /api/reviews/[id]/reaction", error);

    return NextResponse.json(
      {
        error: "Unable to add reaction.",
      },
      {
        status: 500,
      },
    );
  }
}
