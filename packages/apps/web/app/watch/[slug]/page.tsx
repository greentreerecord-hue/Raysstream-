import { notFound } from "next/navigation";
import { prisma } from "@raysstream/db";
import { VideoPlayer } from "@/components/video-player";
import { CommentForm } from "@/components/comment-form";
import { getCurrentUser } from "@/lib/auth";

export default async function WatchPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const user = await getCurrentUser();

  const video = await prisma.video.findUnique({
    where: { slug },
    include: {
      channel: true,
      comments: {
        include: { author: true },
        orderBy: { createdAt: "desc" },
        take: 25
      }
    }
  });

  if (!video || video.status !== "PUBLISHED") notFound();
  if (video.visibility === "PREMIUM" && !user) notFound();

  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-8 xl:grid-cols-[1.4fr_0.8fr]">
      <section>
        <VideoPlayer src={video.manifestUrl ?? video.playbackUrl ?? ""} poster={video.thumbnailUrl ?? undefined} />
        <h1 className="mt-6 text-3xl font-bold">{video.title}</h1>
        <p className="mt-2 text-zinc-400">{video.description}</p>
        <div className="mt-3 text-sm text-zinc-500">By {video.channel.name}</div>
        <CommentForm videoId={video.id} slug={video.slug} />
        <div className="mt-6 space-y-4">
          {video.comments.map((comment) => (
            <div key={comment.id} className="rounded-2xl bg-white/5 p-4">
              <p className="font-medium">{comment.author.name}</p>
              <p className="mt-2 text-zinc-300">{comment.body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
