import mongoose, { Schema, Types } from "mongoose";

export type PlaylistVisibility = "public" | "private";

export interface IPlaylistVideo {
  videoId: Types.ObjectId;
  addedAt: Date | null;
  position: number;
}

export interface IPlaylist {
  name: string;
  ownerId: Types.ObjectId;
  visibility: PlaylistVisibility;
  videos: IPlaylistVideo[];
  video_count: number;
  createdAt: Date;
  updatedAt: Date;
}

export type PlaylistDocument = mongoose.HydratedDocument<IPlaylist>;

const PlaylistSchema = new Schema<IPlaylist>(
  {
    name: { type: String, required: true },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "Channel",
    }, // indexed
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "private",
    },

    // Video references with ordering
    videos: {
      type: [
        {
          videoId: {
            type: Schema.Types.ObjectId,
            ref: "Video",
          },
          addedAt: { type: Date, default: null },
          position: { type: Number, required: true },
        },
      ],

      default: []
    },

    video_count: { type: Number, default: 0 }, // denormalized count
  },
  { timestamps: true },
);

// Define indexes
// Indexes: {owner_id: 1}, {videos.video_id: 1}
PlaylistSchema.index({ ownerId: 1 });
PlaylistSchema.index({ "videos.videoId": 1 });

export const Playlist = mongoose.model<IPlaylist>("Playlist", PlaylistSchema);
