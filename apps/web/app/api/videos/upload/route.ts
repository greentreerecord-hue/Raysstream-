import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@raysstream/db";
import { getCurrentUser } from "@/lib/auth";
import { enqueueTranscodeJob } from "@/server/queues";

function slugify(input: string) {
  return input.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "CREATOR" && user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const channel = await prisma.channel.findUnique({
    where: { ownerId: user.id }
  });

  if (!channel) {
    return NextResponse.json({ error: "Channel not found" }, { status: 404 });
  }

  const video = await prisma.video.create({
    data: {
      channelId: channel.id,
      title: body.title,
      slug: slugify(body.title),
      description: body.description,
      category: body.category ?? "Trending",
      type: body.type ?? "Movie",
      sourceUrl: body.sourceUrl,
      thumbnailUrl: body.thumbnailUrl,
      premium: !!body.premium,
      monetized: body.monetized ?? true,
      visibility: body.visibility ?? "PRIVATE",
      status: "PROCESSING"
    }
  });

  if (video.sourceUrl) {
    await enqueueTranscodeJob({ videoId: video.id, sourceUrl: video.sourceUrl });
  }

  return NextResponse.json({ ok: true, videoId: video.id });
}
