import { NextRequest, NextResponse } from "next/server";
import { count, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { reviews } from "@/db/schema";

const PAGE_SIZE = 20;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const requestedPage = Number(searchParams.get("page") ?? "1");

    const page =
      Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

    // Get total number of reviews
    const totalResult = await db
      .select({
        count: count(),
      })
      .from(reviews);

    const totalReviews = Number(totalResult[0]?.count ?? 0);

    const totalPages = Math.max(1, Math.ceil(totalReviews / PAGE_SIZE));

    // Make sure requested page is valid
    const currentPage = Math.min(page, totalPages);

    const offset = (currentPage - 1) * PAGE_SIZE;

    const data = await db
      .select()
      .from(reviews)
      .orderBy(desc(reviews.createdAt))
      .limit(PAGE_SIZE)
      .offset(offset);

    return NextResponse.json({
      reviews: data,
      pagination: {
        currentPage,
        pageSize: PAGE_SIZE,
        totalReviews,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Failed to fetch reviews:", error);

    return NextResponse.json(
      {
        error: "Failed to load reviews.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();

    const id = Number(body.id);

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        {
          error: "Invalid review ID.",
        },
        {
          status: 400,
        },
      );
    }

    const deleted = await db
      .delete(reviews)
      .where(eq(reviews.id, id))
      .returning({
        id: reviews.id,
      });

    if (deleted.length === 0) {
      return NextResponse.json(
        {
          error: "Review not found.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,
      deletedId: id,
    });
  } catch (error) {
    console.error("Failed to delete review:", error);

    return NextResponse.json(
      {
        error: "Failed to delete review.",
      },
      {
        status: 500,
      },
    );
  }
}
