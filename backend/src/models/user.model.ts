import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// 1. TypeScript Interface for the User Document
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'admin';
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// 2. Mongoose Schema Definition
const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['admin'], default: 'admin' },
  },
  { timestamps: true }
);

// 3. Pre-save Hook: Modern async/await (No more 'next' errors!)
UserSchema.pre<IUser>('save', async function () {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return;

  // Generate a salt and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password as string, salt);
});

// 4. Instance Method: Explicit 'this' typing
UserSchema.methods.comparePassword = async function (
  this: IUser, 
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password as string);
};

// 5. Export the Model
export const UserModel = mongoose.model<IUser>('User', UserSchema);