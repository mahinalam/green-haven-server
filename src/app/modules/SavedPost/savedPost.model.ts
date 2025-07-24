import mongoose from "mongoose";
import { Schema } from "mongoose";
import { ISavedPost } from "./savedPost.interface";

const SavedPostSchema: Schema = new Schema<ISavedPost>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId || String,
      ref: "User",
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId || String,
      ref: "GardeningPost",
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
  },

  { timestamps: true }
);

SavedPostSchema.pre("find", function (next) {
  this.where({ isDeleted: false });
  next();
});
SavedPostSchema.pre("findOne", function (next) {
  this.where({ isDeleted: false });
  next();
});

const SavedPost = mongoose.model<ISavedPost>("SavedPost", SavedPostSchema);

export default SavedPost;
