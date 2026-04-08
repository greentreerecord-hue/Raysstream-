import { Queue } from "bullmq";

const connection = {
  url: process.env.REDIS_URL,
};

export const mediaQueue = new Queue("media", { connection });

export async function enqueueTranscodeJob(payload: { videoId: string; sourceUrl: string }) {
  await mediaQueue.add("transcode-video", payload, {
    attempts: 3,
    removeOnComplete: true,
    backoff: { type: "exponential", delay: 3000 },
  });
}
