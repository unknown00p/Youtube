export type VideoVisibility = "public" | "private" | "unlisted";
export type VideoStatus = "processing" | "published" | "failed";

export interface IUploadVideoData {
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  duration: number;
  s3FileKey: string;
  
  tags: string[];
  category: string;
  language: string;

  visibility: VideoVisibility;
  status: VideoStatus;
}

async function uploadVideo_service(videoData:IUploadVideoData, channelId:string) {
    
}

export {
    uploadVideo_service
}