import { NextRequest, NextResponse } from 'next/server';
import { registerNewUser } from '@/lib/userStore';

export async function POST(request: NextRequest) {
  try {
    const { name, email, company, referralSource, password } = await request.json();

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return NextResponse.json(
        { error: 'Name, email, and password are required.' },
        { status: 400 }
      );
    }

    const result = await registerNewUser({ name, email, company, referralSource, password });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Registration failed.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'User registered successfully', userId: result.user?.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}