import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

// Uploadcare Configuration - Production Ready!
// Public Key: 58e60a300a0570589035
// Secret Key: b6a9fe9ff99422f2cc01
// Free Tier: 10GB storage, 3GB bandwidth

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
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename with proper extension handling
    const originalName = file.name;
    const fileExtension = originalName.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${randomUUID()}.${fileExtension}`;

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch {
      // Directory might already exist, ignore error
    }

    // Choose storage method based on environment
    const useUploadcare = process.env.USE_UPLOADCARE === 'true';

    if (useUploadcare) {
      // Uploadcare upload
      try {
        const UPLOADCARE_PUBLIC_KEY = process.env.UPLOADCARE_PUBLIC_KEY;
        const UPLOADCARE_SECRET_KEY = process.env.UPLOADCARE_SECRET_KEY;

        if (!UPLOADCARE_PUBLIC_KEY || !UPLOADCARE_SECRET_KEY) {
          throw new Error('Uploadcare credentials not configured');
        }

        // Uploadcare Direct Upload with correct format
        const formData = new FormData();
        formData.append('file', new Blob([buffer], { type: file.type }), fileName);
        formData.append('UPLOADCARE_STORE', '1'); // Store the file permanently

        console.log('Uploading to Uploadcare with public key:', UPLOADCARE_PUBLIC_KEY);

        // Use query parameter for public key (Uploadcare's preferred method)
        const uploadUrl = `https://upload.uploadcare.com/base/?pub_key=${UPLOADCARE_PUBLIC_KEY}`;
        const uploadResponse = await fetch(uploadUrl, {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          console.error('Uploadcare API error:', uploadResponse.status, errorText);
          throw new Error(`Uploadcare upload failed: ${uploadResponse.status} - ${errorText}`);
        }

        const uploadResult = await uploadResponse.json();
        console.log('Uploadcare upload result:', uploadResult);

        // Verify the file was uploaded successfully
        if (!uploadResult.file) {
          throw new Error('Uploadcare upload incomplete - no file ID returned');
        }

        return NextResponse.json({
          message: 'File uploaded to Uploadcare successfully',
          fileUrl: `https://ucarecdn.com/${uploadResult.file}/`,
          fileName: uploadResult.file,
          uploadcare: true,
          cdnUrl: `https://ucarecdn.com/${uploadResult.file}/`,
          originalFilename: file.name,
          size: uploadResult.size || file.size
        });

      } catch (uploadcareError) {
        console.log('Uploadcare upload failed, falling back to local storage:', uploadcareError);
        // Fall back to local storage
      }
    }

    // Local storage (fallback or primary method)
    const filePath = join(uploadsDir, fileName);
    await writeFile(filePath, buffer);

    // Return file URL
    const fileUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      message: 'File uploaded successfully',
      fileUrl,
      fileName,
      storage: useUploadcare ? 'uploadcare' : 'local'
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}