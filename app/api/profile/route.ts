import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import User from '@/lib/models/User';
import connectToDatabase from '@/lib/db/connect';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    if (session.user.id === 'admin-static-id' || session.user.email === 'admin@saudifabstore.com' || session.user.email === 'admin@example.com') {
      return NextResponse.json({
        message: 'Profile retrieved successfully',
        user: {
          _id: 'admin-static-id',
          name: session.user.name || 'Saudi Fab Admin',
          email: session.user.email,
          role: 'admin'
        }
      }, { status: 200 });
    }

    try {
      await connectToDatabase();
      const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(session.user.id);
      if (isValidObjectId) {
        const user = await User.findById(session.user.id).select('-password');
        if (user) {
          return NextResponse.json(
            { 
              message: 'Profile retrieved successfully',
              user
            },
            { status: 200 }
          );
        }
      }
    } catch (dbErr) {
      console.warn("DB profile retrieval failed, returning session user info:", dbErr);
    }

    // Fallback: Return profile user object constructed from active session
    return NextResponse.json(
      { 
        message: 'Profile retrieved successfully',
        user: {
          _id: session.user.id || 'user-session-id',
          name: session.user.name || 'Valued Client',
          email: session.user.email || '',
          role: session.user.role || 'user'
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Profile retrieval error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { name, email } = await request.json();
    
    await connectToDatabase();
    
    const user = await User.findByIdAndUpdate(
      session.user.id,
      { name, email },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { 
        message: 'Profile updated successfully',
        user
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
