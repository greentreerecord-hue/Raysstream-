import { execa } from "execa";
import path from "path";
import fs from "fs/promises";
import { prisma } from "@raysstream/db";

export async function transcodeVideo(data: { videoId: string; sourceUrl: string }) {
  const workingDir = path.join("/tmp", data.videoId);
  await fs.mkdir(workingDir, { recursive: true });

  const outputManifest = path.join(workingDir, "index.m3u8");

  await execa(process.env.FFMPEG_PATH ?? "ffmpeg", [
    "-i",
    data.sourceUrl,
    "-preset",
    "veryfast",
    "-g",
    "48",
    "-sc_threshold",
    "0",
    "-map",
    "0:v:0",
    "-map",
    "0:a:0?",
    "-f",
    "hls",
    "-hls_time",
    "6",
    "-hls_playlist_type",
    "vod",
    outputManifest,
  ]);

  const manifestUrl = `${process.env.CDN_BASE_URL}/videos/${data.videoId}/index.m3u8`;

  await prisma.video.update({
    where: { id: data.videoId },
    data: {
      manifestUrl,
      playbackUrl: manifestUrl,
      status: "READY",
    },
  });
}
