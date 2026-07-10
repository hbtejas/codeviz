const mongoose = require('mongoose');

const starterCodeSchema = new mongoose.Schema({
  javascript: { type: String, default: '' },
  python: { type: String, default: '' },
  java: { type: String, default: '' },
  cpp: { type: String, default: '' }
}, { _id: false });

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  expectedOutput: { type: String, required: true }
}, { _id: false });

const problemSchema = new mongoose.Schema({
  problemId: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  leetcodeNumber: { type: Number, default: null },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' },
  patterns: [{ type: String }],
  dataStructures: [{ type: String }],
  description: { type: String, required: true },
  starterCode: { type: starterCodeSchema, required: true },
  visualizerConfig: {
    primaryView: { type: String, default: 'ArrayView' },
    secondaryView: { type: String, default: 'VariablePanel' },
    annotations: [{ type: String }]
  },
  testCases: [testCaseSchema],
  companyTags: [{ type: String }],
  topicSlug: { type: String, default: 'general' }
}, { timestamps: true });

module.exports = mongoose.model('Problem', problemSchema);
