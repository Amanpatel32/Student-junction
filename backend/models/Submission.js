const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    test: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    answers: { type: [Number], default: [] }, // selected option index per question, -1 = unanswered
    score: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

submissionSchema.index({ test: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Submission', submissionSchema);
