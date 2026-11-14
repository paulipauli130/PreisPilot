import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { refreshProductOffers } from "@/lib/pricing/refresh-product";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  try {
    const result = await refreshProductOffers(id);
    const [product, offers] = await Promise.all([
      prisma.product.findUnique({ where: { id } }),
      prisma.productOffer.findMany({ where: { productId: id, provider: "ebay" }, orderBy: { itemPriceCents: "asc" } }),
    ]);
    return NextResponse.json({ product, offers, bestOffer: result.bestOffer, searchTitle: result.searchTitle, observedAt: result.observedAt });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Die Preisabfrage ist fehlgeschlagen.";
    const missing = message === "Produkt wurde nicht gefunden.";
    const needsTitle = message.startsWith("Ergänze zuerst");
    if (!message.includes("noch nicht eingerichtet") && !needsTitle && !missing) console.error("eBay-Preisabfrage fehlgeschlagen:", message);
    return NextResponse.json({ error: message }, { status: missing ? 404 : needsTitle ? 422 : message.includes("noch nicht eingerichtet") ? 503 : 502 });
  }
}
