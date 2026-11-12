import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  try {
    const observations = await prisma.priceObservation.findMany({
      where: { productId: id },
      orderBy: { observedAt: "desc" },
    });
    return NextResponse.json({ observations });
  } catch (error) {
    console.error("Preisverlauf konnte nicht geladen werden:", error);
    return NextResponse.json({ error: "Preisverlauf konnte nicht geladen werden." }, { status: 500 });
  }
}

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || !("amountCents" in body) || typeof body.amountCents !== "number" || !Number.isInteger(body.amountCents) || body.amountCents <= 0) {
    return NextResponse.json({ error: "Der Preis muss als positiver Cent-Betrag angegeben werden." }, { status: 400 });
  }
  const amountCents = body.amountCents;
  const shippingCents = "shippingCents" in body ? body.shippingCents : 0;
  if (typeof shippingCents !== "number" || !Number.isInteger(shippingCents) || shippingCents < 0) {
    return NextResponse.json({ error: "Der Versandpreis muss als Cent-Betrag ab null angegeben werden." }, { status: 400 });
  }
  if (!("source" in body) || typeof body.source !== "string" || !body.source.trim() || body.source.length > 100) {
    return NextResponse.json({ error: "Bitte gib eine gültige Datenquelle an." }, { status: 400 });
  }
  const observedAt = "observedAt" in body ? new Date(String(body.observedAt)) : new Date();
  if (Number.isNaN(observedAt.getTime())) {
    return NextResponse.json({ error: "Der Zeitstempel ist ungültig." }, { status: 400 });
  }

  try {
    const observation = await prisma.priceObservation.create({
      data: {
        productId: id,
        amountCents,
        shippingCents,
        source: body.source.trim(),
        observedAt,
      },
    });
    return NextResponse.json({ observation }, { status: 201 });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2003") {
      return NextResponse.json({ error: "Das Produkt wurde nicht gefunden." }, { status: 404 });
    }
    console.error("Preisbeobachtung konnte nicht gespeichert werden:", error);
    return NextResponse.json({ error: "Preisbeobachtung konnte nicht gespeichert werden." }, { status: 500 });
  }
}
