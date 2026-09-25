import { NextRequest, NextResponse } from "next/server";
import { count, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { motivationalQuotes } from "@/db/schema";

const PAGE_SIZE = 20;

/**
 * GET
 * /api/admin/motivational-quotes?page=1
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const requestedPage = Number(searchParams.get("page") ?? "1");

    const page =
      Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

    // Total count
    const totalResult = await db
      .select({
        count: count(),
      })
      .from(motivationalQuotes);

    const totalQuotes = Number(totalResult[0]?.count ?? 0);

    const totalPages = Math.max(1, Math.ceil(totalQuotes / PAGE_SIZE));

    // Prevent invalid page numbers
    const currentPage = Math.min(page, totalPages);

    const offset = (currentPage - 1) * PAGE_SIZE;

    const quotes = await db
      .select()
      .from(motivationalQuotes)
      .orderBy(desc(motivationalQuotes.createdAt))
      .limit(PAGE_SIZE)
      .offset(offset);

    return NextResponse.json({
      quotes,
      pagination: {
        currentPage,
        pageSize: PAGE_SIZE,
        totalQuotes,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Failed to fetch motivational quotes:", error);

    return NextResponse.json(
      {
        error: "Failed to load motivational quotes.",
      },
      {
        status: 500,
      },
    );
  }
}

/**
 * POST
 * Create a new motivational quote
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const quote = typeof body.quote === "string" ? body.quote.trim() : "";

    if (!quote) {
      return NextResponse.json(
        {
          error: "Quote is required.",
        },
        {
          status: 400,
        },
      );
    }

    const [newQuote] = await db
      .insert(motivationalQuotes)
      .values({
        quote,
      })
      .returning();

    return NextResponse.json(
      {
        quote: newQuote,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Failed to create motivational quote:", error);

    return NextResponse.json(
      {
        error: "Failed to create motivational quote.",
      },
      {
        status: 500,
      },
    );
  }
}

/**
 * DELETE
 * Delete a quote
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();

    const id = body.id;

    if (typeof id !== "string" || !id.trim()) {
      return NextResponse.json(
        {
          error: "Invalid quote ID.",
        },
        {
          status: 400,
        },
      );
    }

    const deleted = await db
      .delete(motivationalQuotes)
      .where(eq(motivationalQuotes.id, id))
      .returning({
        id: motivationalQuotes.id,
      });

    if (deleted.length === 0) {
      return NextResponse.json(
        {
          error: "Quote not found.",
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
    console.error("Failed to delete motivational quote:", error);

    return NextResponse.json(
      {
        error: "Failed to delete motivational quote.",
      },
      {
        status: 500,
      },
    );
  }
}

/**
 * PATCH
 * Update a quote
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    const id = typeof body.id === "string" ? body.id.trim() : "";

    const quote = typeof body.quote === "string" ? body.quote.trim() : "";

    if (!id) {
      return NextResponse.json(
        {
          error: "Quote ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (!quote) {
      return NextResponse.json(
        {
          error: "Quote is required.",
        },
        {
          status: 400,
        },
      );
    }

    const [updatedQuote] = await db
      .update(motivationalQuotes)
      .set({
        quote,
        updatedAt: new Date(),
      })
      .where(eq(motivationalQuotes.id, id))
      .returning();

    if (!updatedQuote) {
      return NextResponse.json(
        {
          error: "Quote not found.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      quote: updatedQuote,
    });
  } catch (error) {
    console.error("Failed to update motivational quote:", error);

    return NextResponse.json(
      {
        error: "Failed to update motivational quote.",
      },
      {
        status: 500,
      },
    );
  }
}
