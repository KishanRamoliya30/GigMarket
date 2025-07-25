import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import User from '@/app/models/user';
import dbConnect from '@/app/lib/dbConnect';
import "@/app/models/profile";

export async function getUserFromSession(cookieStore: ReturnType<typeof cookies>) {
  await dbConnect();
  const token = (await cookieStore).get('token')?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string, role: string };
    const user = await User.findById(decoded.userId).select('-password').populate({ path: 'profile', model: 'profiles' });
    const userWithRole = {...user._doc, role: decoded.role}
    return user ? userWithRole : null;
  } catch (err) {
    console.error('Invalid token', err);
    return null;
  }
}
