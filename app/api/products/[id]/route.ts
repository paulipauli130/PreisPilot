import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
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
