import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// POST /api/auth/verify-secret - Verify the edit mode secret phrase
export async function POST(request: NextRequest) {
  try {
    const { phrase } = await request.json();

    if (!phrase || typeof phrase !== "string") {
      return NextResponse.json({ valid: false }, { status: 400 });
    }

    const salt = process.env.EDIT_MODE_SALT;
    const storedHash = process.env.EDIT_MODE_HASH;

    if (!salt || !storedHash) {
      console.error("EDIT_MODE_SALT or EDIT_MODE_HASH not configured");
      return NextResponse.json({ valid: false }, { status: 500 });
    }

    // Hash the provided phrase with the salt
    const hash = crypto
      .createHash("sha256")
      .update(salt + phrase)
      .digest("hex");

    // Constant-time comparison to prevent timing attacks
    const valid =
      hash.length === storedHash.length &&
      crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(storedHash));

    return NextResponse.json({ valid });
  } catch (error) {
    console.error("Verify secret error:", error);
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}
