import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    const offers = await prisma.productOffer.findMany({
      where: { productId: id },
      orderBy: [{ itemPriceCents: "asc" }, { observedAt: "desc" }],
    });
    return NextResponse.json({ offers });
  } catch (error) {
    console.error("Angebote konnten nicht geladen werden:", error);
    return NextResponse.json({ error: "Angebote konnten nicht geladen werden." }, { status: 500 });
  }
}
