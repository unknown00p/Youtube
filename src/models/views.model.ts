import mongoose, { Schema, Types } from "mongoose";

interface IViews {
  video_id: Types.ObjectId;
  user_id: Types.ObjectId | null; // nullable for anonymous users
  // watch_time: number; // seconds watched
  // device_info: {
  //   platform: string;
  //   browser: string;
  // };
  createdAt: Date;
  updatedAt: Date;
}

export type ViewsDocument = mongoose.HydratedDocument<IViews>;

const viewsSchema = new Schema<IViews>(
  {
    video_id: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    }, // indexed
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    }, // nullable for anonymous users
    // watch_time: Number, // seconds watched
    // device_info: {
    //   platform: String,
    //   browser: String,
    // },
},
{ timestamps: true }
);

// Define indexes
// Indexes: {video_id: 1, createdAt: -1},
viewsSchema.index({ video_id: 1, createdAt: -1 });

//  {user_id: 1, video_id: 1}
viewsSchema.index({ user_id: 1, video_id: 1 });

// TTL index: {createdAt: 1}, expireAfterSeconds: 7776000 (90 days)
viewsSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 });

export const Views = mongoose.model<IViews>("Views", viewsSchema);
