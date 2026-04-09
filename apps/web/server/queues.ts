import { Queue } from "bullmq";
const connection = {
  connection: process.env.REDIS_URL,
import { Queue } from "bullmq";

const redisUrl = new URL(process.env.REDIS_URL!);

const connection = {
  connection: {
    host: redisUrl.hostname,
    port: Number(redisUrl.port),
    password: redisUrl.password || undefined,
  },
};  


export const mediaQueue = new Queue("media", connection); 

export async function enqueueTranscodeJob(payload: { videoId: string; sourceUrl: string }) {
  await mediaQueue.add("transcode-video", payload, {
    attempts: 3,
    removeOnComplete: true,
    backoff: { type: "exponential", delay: 3000 },
  });
}
