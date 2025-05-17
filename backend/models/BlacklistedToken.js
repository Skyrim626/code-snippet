import mongoose from "mongoose";

const BlacklistedTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400, // Automatically delete entries after 24 hours (or longer than your JWT expiry)
  },
});

export default mongoose.model("BlacklistedToken", BlacklistedTokenSchema);
