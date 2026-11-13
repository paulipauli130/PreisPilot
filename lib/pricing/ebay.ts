export type LiveOffer = {
  provider: "ebay";
  externalId: string;
  title: string;
  seller: string;
  url: string;
  itemPriceCents: number;
  shippingCents: number | null;
  currency: string;
  availability: string | null;
};

type EbayToken = { value: string; expiresAt: number };
type EbaySearchResponse = {
  itemSummaries?: Array<{
    itemId?: string;
    title?: string;
    itemWebUrl?: string;
    price?: { value?: string; currency?: string };
    shippingOptions?: Array<{ shippingCost?: { value?: string; currency?: string } }>;
    seller?: { username?: string };
    estimatedAvailabilityStatus?: string;
  }>;
};

declare global {
  var __sparwacheEbayToken: EbayToken | undefined;
}

const API_SCOPE = "https://api.ebay.com/oauth/api_scope";

export function inferSearchTitle(url: string): string | null {
  try {
    const parsed = new URL(url);
    const segments = parsed.pathname.split("/").filter(Boolean).map((part) => decodeURIComponent(part));
    const dpIndex = segments.findIndex((part) => part.toLowerCase() === "dp");
    let candidate = dpIndex > 0 ? segments[dpIndex - 1] : segments.at(-1);
    if (!candidate || /^(dp|gp|product|itm|[A-Z0-9]{8,})$/i.test(candidate)) return null;
    candidate = candidate.replace(/[-_]+/g, " ").replace(/\b[A-Z0-9]{8,}\b/g, "").replace(/\s+/g, " ").trim();
    return candidate.length >= 3 ? candidate.slice(0, 100) : null;
  } catch {
    return null;
  }
}

async function getApplicationToken(): Promise<string> {
  const clientId = process.env.EBAY_CLIENT_ID?.trim();
  const clientSecret = process.env.EBAY_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) {
    throw new Error("eBay ist noch nicht eingerichtet. Ergänze EBAY_CLIENT_ID und EBAY_CLIENT_SECRET in der lokalen .env-Datei.");
  }

  const cachedToken = globalThis.__sparwacheEbayToken;
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value;

  const isSandbox = process.env.EBAY_SANDBOX === "true";
  const apiRoot = isSandbox ? "https://api.sandbox.ebay.com" : "https://api.ebay.com";
  const response = await fetch(`${apiRoot}/identity/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "client_credentials", scope: API_SCOPE }),
    cache: "no-store",
    signal: AbortSignal.timeout(12_000),
  });
  if (!response.ok) throw new Error("eBay hat die Zugangsdaten abgelehnt. Prüfe Schlüssel, Umgebung und Produktionsfreigabe.");
  const result = await response.json() as { access_token?: string; expires_in?: number };
  if (!result.access_token) throw new Error("eBay hat kein Zugriffstoken zurückgegeben.");
  globalThis.__sparwacheEbayToken = {
    value: result.access_token,
    expiresAt: Date.now() + Math.max(60, result.expires_in ?? 3600) * 1000,
  };
  return result.access_token;
}

export async function searchEbayOffers(searchTitle: string): Promise<LiveOffer[]> {
  const token = await getApplicationToken();
  const isSandbox = process.env.EBAY_SANDBOX === "true";
  const apiRoot = isSandbox ? "https://api.sandbox.ebay.com" : "https://api.ebay.com";
  const marketplace = process.env.EBAY_MARKETPLACE_ID?.trim() || "EBAY_DE";
  const query = new URL(`${apiRoot}/buy/browse/v1/item_summary/search`);
  query.searchParams.set("q", searchTitle.slice(0, 100));
  query.searchParams.set("limit", "12");
  query.searchParams.set("sort", "price");
  query.searchParams.set("filter", "conditions:{NEW},deliveryCountry:DE");

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "X-EBAY-C-MARKETPLACE-ID": marketplace,
    "Accept-Language": "de-DE",
  };
  const postalCode = process.env.EBAY_POSTAL_CODE?.trim();
  if (postalCode) headers["X-EBAY-C-ENDUSERCTX"] = `contextualLocation=country%3DDE%2Czip%3D${encodeURIComponent(postalCode)}`;

  const response = await fetch(query, { headers, cache: "no-store", signal: AbortSignal.timeout(15_000) });
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      globalThis.__sparwacheEbayToken = undefined;
      throw new Error("eBay hat die Suche nicht freigegeben. Für Live-Daten ist ein genehmigter Produktionszugang zur Browse API erforderlich.");
    }
    if (response.status === 429) throw new Error("eBay hat das Abruflimit erreicht. Sparwache versucht es beim nächsten Intervall erneut.");
    throw new Error(`Die eBay-Preissuche ist fehlgeschlagen (HTTP ${response.status}).`);
  }
  const result = await response.json() as EbaySearchResponse;
  return (result.itemSummaries ?? []).flatMap((item): LiveOffer[] => {
    const itemPrice = Number(item.price?.value);
    const currency = item.price?.currency ?? "EUR";
    if (!item.itemId || !item.title || !item.itemWebUrl || !Number.isFinite(itemPrice) || itemPrice <= 0 || currency !== "EUR") return [];
    const shippingPrice = Number(item.shippingOptions?.[0]?.shippingCost?.value);
    const shippingCents = Number.isFinite(shippingPrice) && shippingPrice >= 0 ? Math.round(shippingPrice * 100) : null;
    return [{
      provider: "ebay",
      externalId: item.itemId,
      title: item.title,
      seller: item.seller?.username || "eBay-Händler",
      url: item.itemWebUrl,
      itemPriceCents: Math.round(itemPrice * 100),
      shippingCents,
      currency,
      availability: item.estimatedAvailabilityStatus ?? null,
    }];
  });
}
