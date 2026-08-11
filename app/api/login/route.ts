import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/lib/models/User';
import connectToDatabase from '@/lib/db/connect';

// Hardcoded Demo Credentials (active as instant fallback or DB match)
const DEMO_USER = {
  email: 'demo@brooqalkhalij.com',
  passwordPlain: 'demo123',
  name: 'Demo User',
  role: 'user',
  id: 'demo-user-id-999'
};

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    let user = null;
    let dbConnected = false;

    try {
      await connectToDatabase();
      dbConnected = true;
      user = await User.findOne({ email });
    } catch (dbErr) {
      console.warn("MongoDB connection unavailable for login, checking static demo fallback:", dbErr);
    }

    // Check against DB user if found
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: 'Invalid password' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { 
          message: 'Login successful',
          user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
          }
        },
        { status: 200 }
      );
    }

    // Fallback static credentials check (democratizing off-line login)
    if (email === DEMO_USER.email && password === DEMO_USER.passwordPlain) {
      return NextResponse.json(
        {
          message: 'Login successful (Demo Mode)',
          user: {
            id: DEMO_USER.id,
            name: DEMO_USER.name,
            email: DEMO_USER.email,
            role: DEMO_USER.role,
          }
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: 'Invalid email or password' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}