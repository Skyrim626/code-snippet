import { create } from "domain";
import mongoose from "mongoose";

const SnippetSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    max_length: 100,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    max_length: 500,
  },
  code: {
    type: String,
    required: true,
  },
  programmingLanguage: {
    type: String,
    required: true,
    enum: [
      "javascript",
      "python",
      "java",
      "csharp",
      "php",
      "ruby",
      "html",
      "css",
      "sql",
      "bash",
      "typescript",
      "swift",
      "go",
      "kotlin",
      "rust",
      "dart",
      "scala",
      "elixir",
      "haskell",
      "clojure",
      "groovy",
      "lua",
      "perl",
      "r",
      "objective-c",
      "assembly",
      "matlab",
      "powershell",
      "visual-basic",
      "fortran",
      "cobol",
      "pascal",
      "f#",
      "julia",
    ],
  },
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  isPublic: {
    type: Boolean,
    default: true,
  },
  favorites: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
SnippetSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Add text index for searching
SnippetSchema.index({
  title: "text",
  description: "text",
  code: "text",
  tags: "text",
});

export default mongoose.model("Snippet", SnippetSchema);
