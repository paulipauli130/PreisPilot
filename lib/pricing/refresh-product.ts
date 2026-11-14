import { prisma } from "@/lib/prisma";
import { inferSearchTitle, searchEbayOffers } from "@/lib/pricing/ebay";

export async function refreshProductOffers(id: string) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new Error("Produkt wurde nicht gefunden.");

  const searchTitle = product.title?.trim() || inferSearchTitle(product.url);
  if (!searchTitle) {
    const message = "Ergänze zuerst eine Produktbezeichnung, damit die eBay-Suche das richtige Modell findet.";
    await prisma.product.update({ where: { id }, data: { lastCheckedAt: new Date(), lastRefreshError: message } });
    throw new Error(message);
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
      if (bestOffer) {
        await transaction.priceObservation.create({
          data: {
            productId: id,
            amountCents: bestOffer.itemPriceCents,
            shippingCents: bestOffer.shippingCents!,
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

    return { productId: id, searchTitle, observedAt, offers, bestOffer };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Die Preisabfrage ist fehlgeschlagen.";
    await prisma.product.update({ where: { id }, data: { lastCheckedAt: new Date(), lastRefreshError: message } });
    throw error;
  }
}
