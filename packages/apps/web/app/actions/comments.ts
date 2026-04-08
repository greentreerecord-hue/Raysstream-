"use server";

import { prisma } from "@raysstream/db";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createComment(videoId: string, body: string, slug: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  if (!body.trim()) throw new Error("Comment cannot be empty");

  await prisma.$transaction([
    prisma.comment.create({
      data: {
        videoId,
        authorId: user.id,
        body: body.trim()
      }
    }),
    prisma.video.update({
      where: { id: videoId },
      data: { commentsCount: { increment: 1 } }
    })
  ]);

  revalidatePath(`/watch/${slug}`);
}
