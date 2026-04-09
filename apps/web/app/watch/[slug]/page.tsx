export const dynamic = "force-dynamic"
import { prisma } from "@raysstream/db";
import { getCurrentUser } from "@/lib/auth";
import { notFound } from "next/navigation";
export default async function 
  Watchpage({ params }: any) {
  const user = await getCurrentUser();
  const slug = params.slug;
  const video: any = await prisma.video.findUnique({
    where: { slug },
    include: {
      channel: true,
      comments: {
        include: { author: true },
        orderBy: { createdAt: "desc" },
        take: 25,
      },
    },
  });

  if (!video) notFound();
  if (video.status !== "PUBLISHED") notFound();
  if (video.visibility === "PREMIUM" && !user) notFound();

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold">{video.title}</h1>

      <p className="mt-2 text-sm text-zinc-400">
        {video.channel?.name}
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl border">
        <video
          controls
          className="w-full"
          poster={video.thumbnailUrl ?? ""}
          src={video.videoUrl ?? ""}
        />
      </div>

      {video.description && (
        <p className="mt-6 text-zinc-300">{video.description}</p>
      )}

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Comments</h2>

        {video.comments?.length ? (
          <div className="mt-4 space-y-4">
            {video.comments.map((comment: any) => (
              <div key={comment.id} className="rounded-xl border p-4">
                <p className="text-sm font-medium">
                  {comment.author?.name ?? "User"}
                </p>
                <p className="mt-2 text-sm text-zinc-300">
                  {comment.content}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-zinc-500">
            No comments yet.
          </p>
        )}
      </section>
    </main>
  );
} 
