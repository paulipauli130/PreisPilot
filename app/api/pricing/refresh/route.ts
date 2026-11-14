import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { refreshProductOffers } from "@/lib/pricing/refresh-product";

export const runtime = "nodejs";

const REFRESH_INTERVAL_MS = 60 * 60 * 1000;
const MAX_PRODUCTS_PER_RUN = 10;

function hasValidSecret(request: Request, secret: string) {
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const expectedBuffer = Buffer.from(secret);
  const suppliedBuffer = Buffer.from(supplied);
  return expectedBuffer.length === suppliedBuffer.length && timingSafeEqual(expectedBuffer, suppliedBuffer);
}

export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return NextResponse.json({ error: "Der automatische Preisabruf ist nicht eingerichtet." }, { status: 503 });
  if (!hasValidSecret(request, secret)) return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });

  if (!process.env.EBAY_CLIENT_ID?.trim() || !process.env.EBAY_CLIENT_SECRET?.trim()) {
    return NextResponse.json({ error: "eBay-Zugangsdaten fehlen." }, { status: 503 });
  }

  const staleBefore = new Date(Date.now() - REFRESH_INTERVAL_MS);
  const products = await prisma.product.findMany({
    where: { OR: [{ lastCheckedAt: null }, { lastCheckedAt: { lt: staleBefore } }] },
    orderBy: [{ lastCheckedAt: "asc" }, { createdAt: "asc" }],
    take: MAX_PRODUCTS_PER_RUN,
    select: { id: true },
  });

  const failures: Array<{ productId: string; error: string }> = [];
  let refreshed = 0;
  for (const product of products) {
    try {
      await refreshProductOffers(product.id);
      refreshed += 1;
    } catch (error) {
      failures.push({ productId: product.id, error: error instanceof Error ? error.message : "Preisabruf fehlgeschlagen." });
    }
  }

  return NextResponse.json({ checked: products.length, refreshed, failed: failures.length, failures, nextRunAfterMinutes: 60 });
}
