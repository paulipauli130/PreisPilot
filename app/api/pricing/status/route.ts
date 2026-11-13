import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const configured = Boolean(process.env.EBAY_CLIENT_ID?.trim() && process.env.EBAY_CLIENT_SECRET?.trim());
  return NextResponse.json({
    provider: "eBay Browse API",
    configured,
    sandbox: process.env.EBAY_SANDBOX === "true",
    refreshIntervalMinutes: 60,
  });
}
