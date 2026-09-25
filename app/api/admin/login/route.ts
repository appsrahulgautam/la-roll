import { db } from "@/lib/db";
import { admins } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  console.log("cred are " + email + " " + password);
  console.log(process.env.DATABASE_URL);

  const admin = await db.query.admins.findFirst({
    where: eq(admins.email, email),
  });

  if (!admin) return NextResponse.json({ error: "Invalid" }, { status: 401 });

  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) return NextResponse.json({ error: "Invalid" }, { status: 401 });

  const res = NextResponse.json({ success: true });
  const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
  res.cookies.set("admin_token", token, { httpOnly: true, path: "/" });

  return res;
}
