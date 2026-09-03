import { NextRequest, NextResponse } from 'next/server';
import { registerNewUser } from '@/lib/userStore';

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, emailOrPhone, company, referralSource, password } = await request.json();
    const identifier = (emailOrPhone || email || phone || '').trim();

    if (!name?.trim() || !identifier || !password?.trim()) {
      return NextResponse.json(
        { error: 'Name, mobile number/email, and password are required.' },
        { status: 400 }
      );
    }

    const result = await registerNewUser({ name, emailOrPhone: identifier, company, referralSource, password });

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