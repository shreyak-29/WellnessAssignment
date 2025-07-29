import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      index: true
    },
    tags: [{
      type: String,
      trim: true
    }],
    jsonUrl: {
      type: String,
      trim: true
    },
  content: {
  type: String,
  required: [true, "Content is required"],
  trim: true
},

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft"
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    lastAutoSavedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Index for better query performance
sessionSchema.index({ owner: 1, status: 1 });
sessionSchema.index({ title: "text", tags: "text" });

export const Session = mongoose.model("Session", sessionSchema); 