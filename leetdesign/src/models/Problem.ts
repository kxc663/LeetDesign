import mongoose, { Schema, Document, Model } from 'mongoose';

export interface Hint{
  id: string;
  title: string;
  content: string;
}

export interface CreateProblemInput {
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
  functional_requirements: string[];
  non_functional_requirements: string[];
  hints: { id: string; title: string; content: string }[];
  reference_solution: string;
}

export interface Problem extends Document {
  displayId: number;
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  functional_requirements: string[];
  non_functional_requirements: string[];
  hints: Hint[];
  category: string;
  reference_solution: string;
}

export interface ProblemListItem {
  id: string;
  displayId: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  category: string;
  attempted: boolean;
  completed: boolean;
} 

const HintSchema = new Schema<Hint>({
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  }
});

const ProblemSchema = new Schema({
  displayId: {
    type: Number,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard'],
  },
  description: {
    type: String,
    required: true,
  },
  functional_requirements: {
    type: [String],
    required: true,
  },
  non_functional_requirements: {
    type: [String],
    required: true,
  },
  hints: {
    type: [HintSchema],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  reference_solution: {
    type: String,
    required: true,
  },
});

// Only add middleware on the server side
if (typeof window === 'undefined') {
  ProblemSchema.pre('save', async function (next) {
    if (!this.isModified('displayId')) {
      this.displayId = await mongoose.models.Problem?.countDocuments() || 0;
    }
    next();
  });
}

// Create and export the model
let Problem: Model<Problem>;

// Check if we're on the server (mongoose is fully available) or client side
if (typeof window === 'undefined') {
  // We're on the server
  Problem = mongoose.models.Problem || mongoose.model<Problem>('Problem', ProblemSchema);
} else {
  // We're on the client, provide a mock or placeholder
  // @ts-expect-error - This is intentional for client-side
  Problem = { findById: () => null, find: () => [], countDocuments: () => 0 };
}

export default Problem;