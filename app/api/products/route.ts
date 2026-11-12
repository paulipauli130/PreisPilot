import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { _count: { select: { priceHistory: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ products });
  } catch (error) {
    console.error("Produkte konnten nicht geladen werden:", error);
    return NextResponse.json({ error: "Produkte konnten nicht geladen werden." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || !("url" in body) || typeof body.url !== "string") {
    return NextResponse.json({ error: "Bitte gib einen Produktlink an." }, { status: 400 });
  }

  let productUrl: URL;
  try {
    productUrl = new URL(body.url.trim());
  } catch {
    return NextResponse.json({ error: "Der Produktlink ist ungültig." }, { status: 400 });
  }
  if (!["http:", "https:"].includes(productUrl.protocol) || productUrl.username || productUrl.password) {
    return NextResponse.json({ error: "Der Link muss eine gültige HTTP- oder HTTPS-Adresse sein." }, { status: 400 });
  }
  if (productUrl.href.length > 2048) {
    return NextResponse.json({ error: "Der Produktlink ist zu lang." }, { status: 400 });
  }

  const shop = productUrl.hostname.replace(/^www\./, "").split(".").slice(0, -1).join(".") || productUrl.hostname;
  try {
    const product = await prisma.product.create({ data: { url: productUrl.href, shop } });
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
      return NextResponse.json({ error: "Diesen Produktlink hast du bereits vorgemerkt." }, { status: 409 });
    }
    console.error("Produkt konnte nicht gespeichert werden:", error);
    return NextResponse.json({ error: "Produkt konnte nicht gespeichert werden." }, { status: 500 });
  }
}
