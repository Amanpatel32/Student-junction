const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    options: {
      type: [String],
      validate: [(arr) => arr.length >= 2 && arr.length <= 6, 'Provide between 2 and 6 options'],
    },
    correctOption: { type: Number, required: true }, // index into options
    marks: { type: Number, default: 1, min: 1 },
  },
  { _id: true }
);

const testSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Test title is required'], trim: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    description: { type: String, trim: true },
    questions: {
      type: [questionSchema],
      validate: [(arr) => arr.length > 0, 'A test needs at least one question'],
    },
    durationMinutes: { type: Number, required: true, min: 1, default: 30 },
    isPublished: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

testSchema.virtual('totalMarks').get(function () {
  return this.questions.reduce((sum, q) => sum + q.marks, 0);
});
testSchema.set('toJSON', { virtuals: true });
testSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Test', testSchema);
