import mongoose from "mongoose";

const TagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Tag name is required"],
    trim: true,
    max_length: [50, "Tag name cannot exceed 50 characters"],
  },
  color: {
    type: String,
    required: [true, "Tag color is required"],
    trim: true,
    max_length: [7, "Tag color cannot exceed 7 characters"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  snippetCount: {
    type: Number,
    default: 0,
  },
});

// Create composite index for name and user
TagSchema.index({ name: 1, user: 1 }, { unique: true });
// Update the snippetCount field before saving
TagSchema.pre("save", function (next) {
  this.snippetCount = this.snippetCount || 0;
  next();
});

export default mongoose.model("Tag", TagSchema);
