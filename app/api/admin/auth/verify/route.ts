import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || null;

    if (verifyAdminToken(token)) {
      return NextResponse.json({
        success: true,
        authenticated: true,
      });
    } else {
      return NextResponse.json(
        { success: false, authenticated: false },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, authenticated: false },
      { status: 401 }
    );
  }
}
