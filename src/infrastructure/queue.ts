import { Queue } from "bullmq";

export const connection = {
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || "6379"),
};

const videoQueue = new Queue("videoQueue", { connection });
const likeCountUpdateQueue = new Queue("likeCountUpdateQueue", { connection });

export { videoQueue, likeCountUpdateQueue };
