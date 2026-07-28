import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // In a real app, you would destroy the session or invalidate the JWT token here
    // For now, we'll just return a success message
    return NextResponse.json(
      { message: 'Logout successful' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}