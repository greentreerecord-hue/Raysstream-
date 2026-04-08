import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@raysstream/db";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q) return NextResponse.json({ results: [] });

  const results = await prisma.video.findMany({
    where: {
      status: "PUBLISHED",
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { channel: { name: { contains: q, mode: "insensitive" } } }
      ]
    },
    include: { channel: true },
    take: 20
  });

  return NextResponse.json({ results });
}
