import { Queue } from "bullmq";
import IORedis from "ioredis";

// Only connect to Redis if REDIS_URL exists
const connection = process.env.REDIS_URL
  ? new IORedis(process.env.REDIS_URL)
  : null;

// Only create queue if Redis is available
export const videoQueue = connection
  ? new Queue("video-transcode", { connection })
  : null;

// Safe enqueue function
export async function enqueueTranscodeJob(data: { videoId: string }) {
  if (!videoQueue) {
    console.log("Queue disabled (no Redis)");
    return;
  }

  await videoQueue.add("transcode", data);
} 