import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || !("targetPriceCents" in body)) {
    return NextResponse.json({ error: "Bitte gib einen Wunschpreis in Cent an oder setze ihn zurück." }, { status: 400 });
  }
  const targetPriceCents = body.targetPriceCents;
  if (targetPriceCents !== null && (typeof targetPriceCents !== "number" || !Number.isSafeInteger(targetPriceCents) || targetPriceCents <= 0 || targetPriceCents > 2147483647)) {
    return NextResponse.json({ error: "Der Wunschpreis muss größer als null sein." }, { status: 400 });
  }
  try {
    const product = await prisma.product.update({ where: { id }, data: { targetPriceCents } });
    return NextResponse.json({ product });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2025") {
      return NextResponse.json({ error: "Produkt wurde nicht gefunden." }, { status: 404 });
    }
    console.error("Wunschpreis konnte nicht gespeichert werden:", error);
    return NextResponse.json({ error: "Wunschpreis konnte nicht gespeichert werden." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  try {
    await prisma.product.delete({ where: { id } });
    return new Response(null, { status: 204 });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2025") {
      return NextResponse.json({ error: "Produkt wurde nicht gefunden." }, { status: 404 });
    }
    console.error("Produkt konnte nicht gelöscht werden:", error);
    return NextResponse.json({ error: "Produkt konnte nicht gelöscht werden." }, { status: 500 });
  }
}
