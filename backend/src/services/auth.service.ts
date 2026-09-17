import jwt from 'jsonwebtoken';
import { UserModel, IUser } from '../models/user.model';
import { AppError } from '../utils/AppError';

export class AuthService {
  // Generate JWT Token
  private signToken(id: string): string {
    const secret = process.env.JWT_SECRET as string;
    
    // ✅ FIX 1: Cast expiresIn to the exact type jsonwebtoken expects
    const expiresIn = process.env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'];

    return jwt.sign({ id }, secret, { expiresIn });
  }

  // Temporary function to register the initial admin
  async registerAdmin(data: Partial<IUser>): Promise<{ user: IUser; token: string }> {
    const existingUser = await UserModel.findOne({ email: data.email });
    if (existingUser) {
      throw new AppError('An admin with this email already exists', 400);
    }

    const user = await UserModel.create({
      name: data.name,
      email: data.email,
      password: data.password,
      role: 'admin',
    });

    // ✅ FIX 2: Use .toString() instead of 'as string'
    const token = this.signToken(user._id.toString());
    return { user, token };
  }

  // Login function
  async login(email: string, password: string): Promise<{ user: IUser; token: string }> {
    // 1. Find user and explicitly select the password field (since it is select: false)
    const user = await UserModel.findOne({ email }).select('+password');
    
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // 2. Check if password matches using the method we built in Phase 5
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    // 3. Generate token
    // ✅ FIX 2: Use .toString() instead of 'as string'
    const token = this.signToken(user._id.toString());

    // 4. Remove password from the output before returning
    user.password = undefined;

    return { user, token };
  }
}

export const authService = new AuthService();