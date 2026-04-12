import { Worker, Job } from "bullmq";
import { Video } from "../../models/video.models";
import { connection } from "../queue";

const worker = new Worker(
  "likeCountUpdateQueue",
  async (job: Job) => {
    const { videoId, name } = job.data;

    if (name === "increaseCount") {
      await Video.updateOne({ _id: videoId }, { $inc: { like_count: 1 } });
    } else if (name === "decreaseCount") {
      await Video.updateOne({ _id: videoId }, { $inc: { like_count: -1 } });
    }

    return "done";
  },
  { connection },
);
