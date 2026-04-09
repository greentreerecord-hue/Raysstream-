import Link from "next/link";
import { prisma } from "@raysstream/db";
import { getCurrentUser } from "@/lib/auth";

export default async function HomePage() {
  const user = await getCurrentUser();

  const videos: any[] = await prisma.video.findMany({
    where: user
      ? {
          status: "PUBLISHED",
        }
      : {
          status: "PUBLISHED",
          visibility: "PUBLIC" as any,
        },
    include: {
      channel: true,
    },
    orderBy: [
      { publishedAt: "desc" },
      { viewsCount: "desc" },
    ],
    take: 18,
  });

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-4xl font-bold">Ray&apos;sStream</h1>
      <p className="mt-2 text-zinc-400">
        Premium streaming and creator platform.
      </p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video: any) => (
          <Link
            key={video.id}
            href={`/watch/${video.slug}`}
            className="overflow-hidden rounded-3xl border transition hover:-translate-y-1"
          >
            <img
              src={video.thumbnailUrl ?? ""}
              alt={video.title}
              className="h-56 w-full object-cover"
            />
            <div className="p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">{video.title}</h2>
                {video.premium && (
                  <span className="rounded-full bg-white px-2 py-1 text-xs text-black">
                    Premium
                  </span>
                )}
              </div>

              <p className="mt-1 text-sm text-zinc-400">
                {video.channel?.name}
              </p>

              <p className="mt-3 text-sm text-zinc-500">
                {video.viewsCount?.toLocaleString?.() ?? video.viewsCount} views
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
} 
