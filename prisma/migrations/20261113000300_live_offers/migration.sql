ALTER TABLE "Product" ADD COLUMN "lastCheckedAt" DATETIME;
ALTER TABLE "Product" ADD COLUMN "lastRefreshError" TEXT;

CREATE TABLE "ProductOffer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "seller" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "itemPriceCents" INTEGER NOT NULL,
    "shippingCents" INTEGER,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "availability" TEXT,
    "observedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProductOffer_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "ProductOffer_productId_provider_externalId_key" ON "ProductOffer"("productId", "provider", "externalId");
CREATE INDEX "ProductOffer_productId_provider_observedAt_idx" ON "ProductOffer"("productId", "provider", "observedAt");
