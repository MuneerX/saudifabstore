import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

import { Session } from "next-auth";

type AuthenticatedRequest = NextRequest & {
    user: Session["user"];
};

type Handler = (request: AuthenticatedRequest) => Promise<NextResponse>;

export async function withAuth(handler: Handler, roles: string[] = []) {
  return async function (request: NextRequest) {
    try {
      const session = await getServerSession(authOptions);
      
      // Check if user is authenticated
      if (!session || !session.user) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
      
      // Check if user has required role (if specified)
      if (roles.length > 0 && !roles.includes(session.user.role)) {
        return NextResponse.json(
          { error: 'Forbidden' },
          { status: 403 }
        );
      }
      
      // Add user to request object
      (request as AuthenticatedRequest).user = session.user;

      // Call the handler function
      return await handler(request as AuthenticatedRequest);
    } catch (error) {
      console.error('Authentication error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}