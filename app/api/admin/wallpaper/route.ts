import { NextRequest, NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { wallpaper } from "@/db/schema";

export async function GET() {
  try {
    const [currentWallpaper] = await db
      .select()
      .from(wallpaper)
      .orderBy(asc(wallpaper.updatedAt))
      .limit(1);

    return NextResponse.json({
      wallpaper: currentWallpaper ?? null,
    });
  } catch (error) {
    console.error("Failed to fetch wallpaper:", error);

    return NextResponse.json(
      {
        error: "Failed to load wallpaper.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const wallpaperUrl =
      typeof body.wallpaperUrl === "string" ? body.wallpaperUrl.trim() : "";

    if (!wallpaperUrl) {
      return NextResponse.json(
        {
          error: "Wallpaper URL is required.",
        },
        {
          status: 400,
        },
      );
    }

    const [existingWallpaper] = await db
      .select()
      .from(wallpaper)
      .orderBy(asc(wallpaper.updatedAt))
      .limit(1);

    if (existingWallpaper) {
      const [updatedWallpaper] = await db
        .update(wallpaper)
        .set({
          wallpaperUrl,
          updatedAt: new Date(),
        })
        .where(eq(wallpaper.id, existingWallpaper.id))
        .returning();

      return NextResponse.json({
        wallpaper: updatedWallpaper,
      });
    }

    const [newWallpaper] = await db
      .insert(wallpaper)
      .values({
        wallpaperUrl,
      })
      .returning();

    return NextResponse.json(
      {
        wallpaper: newWallpaper,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Failed to update wallpaper:", error);

    return NextResponse.json(
      {
        error: "Failed to update wallpaper.",
      },
      {
        status: 500,
      },
    );
  }
}
