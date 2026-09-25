import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { admins } from "@/db/schema";

export async function GET() {
  try {
    const result = await db
      .select({
        id: admins.id,
        email: admins.email,
        role: admins.role,
        createdAt: admins.createdAt,
      })
      .from(admins);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch admins:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch administrators",
      },
      {
        status: 500,
      },
    );
  }
}
