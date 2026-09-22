import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose"; // Using jose for Edge compatibility

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key",
);

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // // --- 1. ADMIN PANEL PROTECTION ---
  // if (path.startsWith("/admin")) {
  //   const adminToken = req.cookies.get("admin_token")?.value;

  //   if (!adminToken) {
  //     return NextResponse.redirect(new URL("/login/admin", req.url));
  //   }

  //   try {
  //     // Note: Admin token might have a different secret if set in a different app,
  //     // but assuming it uses the same JWT_SECRET for now.
  //     await jwtVerify(adminToken, JWT_SECRET);
  //     return NextResponse.next();
  //   } catch (err) {
  //     return NextResponse.redirect(new URL("/login/admin", req.url));
  //   }
  // }

  // // --- 2. CANVASSER DASHBOARD PROTECTION ---
  // if (path.startsWith("/dashboard")) {
  //   const canvasserToken = req.cookies.get("token")?.value;

  //   if (!canvasserToken) {
  //     return NextResponse.redirect(new URL("/login/canvassers", req.url));
  //   }

  //   try {
  //     await jwtVerify(canvasserToken, JWT_SECRET);
  //     return NextResponse.next();
  //   } catch (err) {
  //     return NextResponse.redirect(new URL("/login/canvassers", req.url));
  //   }
  // }

  return NextResponse.next();
}

// Ensure both paths are captured by the matcher
export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
