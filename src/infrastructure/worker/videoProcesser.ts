import { Job, Worker } from "bullmq";

const videoProcessor = new Worker("videoQueue",
    async (job:Job)=>{
        const {videoId, s3FileKey} = job.data

        
    }
)