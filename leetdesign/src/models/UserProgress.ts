import mongoose, { Schema, Document, Model } from 'mongoose';

export type ProgressStatus = 'not_started' | 'in_progress' | 'completed';

export interface UserProgressDocument extends Document {
  userId: mongoose.Types.ObjectId;
  problemId: mongoose.Types.ObjectId;
  status: ProgressStatus;
  solution: string;
  lastUpdated: Date;
}

const UserProgressSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  problemId: {
    type: Schema.Types.ObjectId,
    ref: 'Problem',
    required: true,
  },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed'],
    default: 'not_started',
    required: true,
  },
  solution: {
    type: String,
    default: '',
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Create a compound index to ensure a user can only have one progress record per problem
UserProgressSchema.index({ userId: 1, problemId: 1 }, { unique: true });

let UserProgress: Model<UserProgressDocument>;

// Check if we're on the server (mongoose is fully available) or client side
if (typeof window === 'undefined') {
  // We're on the server
  UserProgress = mongoose.models.UserProgress || mongoose.model<UserProgressDocument>('UserProgress', UserProgressSchema);
} else {
  // We're on the client, provide a mock or placeholder
  // @ts-expect-error - This is intentional for client-side
  UserProgress = { findById: () => null, find: () => [], countDocuments: () => 0 };
}

export default UserProgress; 