import { NextResponse } from "next/server";

import { desc } from "drizzle-orm";

import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const result = await db
      .select({
        id: users.id,
        name: users.name,
        profilePicUrl: users.profilePicUrl,
        email: users.email,
        institutionName: users.institutionName,
        specialityName: users.specialityName,
        specialityYear: users.specialityYear,
        medicineStage: users.medicineStage,
        trainingSite: users.trainingSite,
        interests: users.interests,
        goals: users.goals,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt));

    return NextResponse.json({
      success: true,
      users: result,
    });
  } catch (error) {
    console.error("GET /api/admin/users:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load users.",
      },
      { status: 500 },
    );
  }
}
