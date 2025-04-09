import mongoose, { Schema, Document, Model } from 'mongoose';
import { hash, compare } from 'bcrypt';

// Define the User interface
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  comparePassword: (password: string) => Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

// Create the schema
const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      maxlength: [60, 'Name cannot be more than 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Don't include password by default in queries
    },
  },
  { timestamps: true }
);

if (typeof window === 'undefined') {
  // Hash password before saving
  UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
      return next();
    }
    
    try {
      const saltRounds = 10;
      this.password = await hash(this.password, saltRounds);
      next();
    } catch (error: any) {
      next(error);
    }
  });
}

// Method to compare passwords
UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return await compare(password, this.password);
};

// Create and export the model
let User: Model<IUser>;

// Check if we're on the server (mongoose is fully available) or client side
if (typeof window === 'undefined') {
  // We're on the server
  User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
} else {
  // We're on the client, provide a mock or placeholder
  // @ts-ignore - This is intentional for client-side
  User = { findById: () => null, find: () => [], countDocuments: () => 0 };
}

export default User; 