import Link from "next/link";
import { prisma } from "@raysstream/db";
import { getCurrentUser } from "@/lib/auth";

export default async function HomePage() {
  const user = await getCurrentUser();

  const videos = await prisma.video.findMany({
    where: {
      status: "PUBLISHED",
      OR: [{ visibility: "PUBLIC" }, ...(user ? [{ visibility: "PREMIUM" }] : [])]
    },
    include: { channel: true },
    orderBy: [{ publishedAt: "desc" }, { viewsCount: "desc" }],
    take: 18
  });

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold">Ray’sStream</h1>
          <p className="mt-2 text-zinc-400">Premium streaming and creator platform.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/watch/rogue-frequency" className="rounded-2xl bg-white px-4 py-2 font-medium text-zinc-950">Watch Featured</Link>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <Link key={video.id} href={`/watch/${video.slug}`} className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition hover:-translate-y-1">
            <img src={video.thumbnailUrl ?? ""} alt={video.title} className="h-56 w-full object-cover" />
            <div className="p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">{video.title}</h2>
                {video.premium && <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-zinc-950">Premium</span>}
              </div>
              <p className="mt-1 text-sm text-zinc-400">{video.channel.name}</p>
              <p className="mt-3 text-sm text-zinc-500">{video.viewsCount.toLocaleString()} views</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
