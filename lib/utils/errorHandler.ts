import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

export function handleZodError(error: ZodError) {
  const errors = error.issues.map((err) => ({
    path: err.path.join('.'),
    message: err.message,
  }));
  
  return NextResponse.json(
    { 
      error: 'Validation failed',
      details: errors
    },
    { status: 400 }
  );
}

interface MongoError extends Error {
  errors: { [key: string]: { path: string; message: string } };
  code?: number;
  keyPattern?: { [key: string]: number };
}

export function handleMongoError(error: MongoError) {
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map((err: { path: string; message: string }) => ({
      path: err.path,
      message: err.message,
    }));
    
    return NextResponse.json(
      { 
        error: 'Validation failed',
        details: errors
      },
      { status: 400 }
    );
  }
  
  if (error.name === 'CastError') {
    return NextResponse.json(
      { error: 'Invalid ID format' },
      { status: 400 }
    );
  }
  
  if (error.code === 11000 && error.keyPattern) {
    const field = Object.keys(error.keyPattern)[0];
    return NextResponse.json(
      { error: `${field} already exists` },
      { status: 400 }
    );
  }
  
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}

export function handleGeneralError(error: Error) {
  console.error('Unhandled error:', error);
  
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}