import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

export const dynamic = 'force-dynamic';

const UPLOADCARE_PUBLIC_KEY = process.env.UPLOADCARE_PUBLIC_KEY || '4f5bb3abfd7da51634e7';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file received' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit for Uploadcare)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const originalName = file.name || 'image.jpg';
    const cleanOriginalName = originalName.replace(/[^a-zA-Z0-9._-]/g, '_');

    // Uploadcare CDN Direct Upload
    const uploadFormData = new FormData();
    uploadFormData.append('UPLOADCARE_PUB_KEY', UPLOADCARE_PUBLIC_KEY);
    uploadFormData.append('UPLOADCARE_STORE', '1');
    uploadFormData.append('file', new Blob([buffer], { type: file.type }), cleanOriginalName);

    const uploadResponse = await fetch('https://upload.uploadcare.com/base/', {
      method: 'POST',
      body: uploadFormData,
    });

    if (!uploadResponse.ok) {
      const errText = await uploadResponse.text();
      console.error(`Uploadcare upload error (${uploadResponse.status}): ${errText}`);
      return NextResponse.json(
        { error: 'Failed to upload image to Uploadcare CDN.' },
        { status: 502 }
      );
    }

    const uploadResult = await uploadResponse.json();
    if (!uploadResult || !uploadResult.file) {
      return NextResponse.json(
        { error: 'Uploadcare returned invalid response' },
        { status: 500 }
      );
    }

    const cdnUrl = `https://ucarecdn.com/${uploadResult.file}/${encodeURIComponent(cleanOriginalName)}`;
    return NextResponse.json({
      message: 'File uploaded to Uploadcare CDN successfully',
      fileUrl: cdnUrl,
      fileName: uploadResult.file,
      storage: 'uploadcare',
      cdnUrl: cdnUrl,
      originalFilename: file.name,
      size: file.size
    });

  } catch (error: any) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/upload - Purge file from Uploadcare CDN
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { fileUrl } = await request.json();
    if (!fileUrl) {
      return NextResponse.json({ error: 'fileUrl is required' }, { status: 400 });
    }

    const { deleteFromUploadcare } = await import('@/lib/utils/uploadcare');
    const success = await deleteFromUploadcare(fileUrl);

    return NextResponse.json({
      success,
      message: success ? 'File purged from Uploadcare CDN' : 'File was not on Uploadcare or could not be purged'
    });
  } catch (error: any) {
    console.error('Error in DELETE /api/upload:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}