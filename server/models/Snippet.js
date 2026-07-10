const mongoose = require('mongoose');

const SnippetSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    code: { type: String, required: true, maxlength: 100000 },
    language: {
      type: String,
      required: true,
      enum: ['javascript', 'python', 'java', 'cpp', 'c'],
    },
    title: { type: String, default: 'Untitled Snippet', maxlength: 200 },
    sessionId: { type: String, index: true },
    // Optional: cache the computed trace to avoid re-execution
    cachedTrace: { type: mongoose.Schema.Types.Mixed, default: null },
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Auto-expire old anonymous snippets after 30 days
SnippetSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

module.exports = mongoose.model('Snippet', SnippetSchema);
