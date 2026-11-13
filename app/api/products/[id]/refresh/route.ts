import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { inferSearchTitle, searchEbayOffers } from "@/lib/pricing/ebay";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return NextResponse.json({ error: "Produkt wurde nicht gefunden." }, { status: 404 });

  const searchTitle = product.title?.trim() || inferSearchTitle(product.url);
  if (!searchTitle) {
    const message = "Ergänze zuerst eine Produktbezeichnung, damit die eBay-Suche das richtige Modell findet.";
    await prisma.product.update({ where: { id }, data: { lastCheckedAt: new Date(), lastRefreshError: message } });
    return NextResponse.json({ error: message }, { status: 422 });
  }

  try {
    const offers = await searchEbayOffers(searchTitle);
    const observedAt = new Date();
    const comparableOffers = offers.filter((offer) => offer.shippingCents !== null)
      .sort((a, b) => a.itemPriceCents + a.shippingCents! - b.itemPriceCents - b.shippingCents!);
    const bestOffer = comparableOffers[0] ?? null;

    await prisma.$transaction(async (transaction) => {
      await transaction.productOffer.deleteMany({ where: { productId: id, provider: "ebay" } });
      if (offers.length) {
        await transaction.productOffer.createMany({
          data: offers.map((offer) => ({ ...offer, productId: id, observedAt })),
        });
      }
      if (bestOffer?.shippingCents !== null && bestOffer) {
        await transaction.priceObservation.create({
          data: {
            productId: id,
            amountCents: bestOffer.itemPriceCents,
            shippingCents: bestOffer.shippingCents,
            source: `eBay · ${bestOffer.seller}`,
            observedAt,
          },
        });
      }
      await transaction.product.update({
        where: { id },
        data: { title: product.title || searchTitle, lastCheckedAt: observedAt, lastRefreshError: null },
      });
    });

    const [updatedProduct, storedOffers] = await Promise.all([
      prisma.product.findUnique({ where: { id } }),
      prisma.productOffer.findMany({ where: { productId: id, provider: "ebay" }, orderBy: { itemPriceCents: "asc" } }),
    ]);
    return NextResponse.json({ product: updatedProduct, offers: storedOffers, bestOffer: bestOffer ? { ...bestOffer, observedAt } : null, searchTitle, observedAt });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Die Preisabfrage ist fehlgeschlagen.";
    await prisma.product.update({ where: { id }, data: { lastCheckedAt: new Date(), lastRefreshError: message } });
    if (message.includes("noch nicht eingerichtet")) {
      return NextResponse.json({ error: message }, { status: 503 });
    }
    console.error("eBay-Preisabfrage fehlgeschlagen:", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
