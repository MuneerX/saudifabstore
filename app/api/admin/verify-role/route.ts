import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import User from '@/lib/models/User';
import connectToDatabase from '@/lib/db/connect';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized', isAdmin: false },
        { status: 401 }
      );
    }

    // Hardcoded bypass for demo admin roles
    if (session.user.email === 'admin@brooqalkhalij.com' || session.user.email === 'admin@example.com') {
      return NextResponse.json({
        isAdmin: true,
        user: {
          id: 'admin-static-id',
          name: 'Brooq Admin',
          email: session.user.email,
          role: 'admin'
        }
      });
    }

    try {
      await connectToDatabase();
      const user = await User.findOne({ email: session.user.email });
      if (user) {
        return NextResponse.json({
          isAdmin: user.role === 'admin',
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        });
      }
    } catch (dbErr) {
      console.warn("Verify role database check failed, checking static credentials only:", dbErr);
    }

    return NextResponse.json(
      { error: 'User not found', isAdmin: false },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error verifying admin role:', error);
    return NextResponse.json(
      { error: 'Internal server error', isAdmin: false },
      { status: 500 }
    );
  }
}