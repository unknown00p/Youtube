import mongoose, { Schema, Types } from "mongoose";

export type PlaylistVisibility = "public" | "private" | "unlisted";

export interface IPlaylistVideo {
  video_id: Types.ObjectId;
  added_at: Date | null;
  position: number;
}

export interface IPlaylist {
  name: string;
  owner_id: Types.ObjectId;
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
    owner_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    }, // indexed
    visibility: { type: String, enum: ["public", "private", "unlisted"] }, // 'public', 'private', 'unlisted'

    // Video references with ordering
    videos: [
      {
        video_id: {
          type: Schema.Types.ObjectId,
          ref: "Video",
        },
        added_at: { type: Date, default: null },
        position: { type: Number, required: true },
      },
    ],

    video_count: { type: Number, default: 0 }, // denormalized count
  },
  { timestamps: true }
);

// Define indexes
// Indexes: {owner_id: 1}, {videos.video_id: 1}
PlaylistSchema.index({ owner_id: 1 });
PlaylistSchema.index({ "videos.video_id": 1 });

export const Playlist = mongoose.model<IPlaylist>("Playlist", PlaylistSchema);
