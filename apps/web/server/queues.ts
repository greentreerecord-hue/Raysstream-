import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_URL!);

export const videoQueue = new Queue("video-transcode", {
  connection,
});

export async function enqueueTranscodeJob(data: { videoId: string }) {
  await videoQueue.add("transcode", data);
} 