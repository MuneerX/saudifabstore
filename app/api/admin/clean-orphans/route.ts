import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Product from '@/lib/models/Product';
import connectToDatabase from '@/lib/db/connect';
import { purgeOrphanedUploadcareFiles } from '@/lib/utils/uploadcare';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const products = await Product.find({}, 'images specImage image');
    const activeUrls: string[] = [];

    products.forEach(p => {
      if (Array.isArray(p.images)) {
        activeUrls.push(...p.images);
      }
      if (p.specImage) {
        activeUrls.push(p.specImage);
      }
      if (p.image) {
        activeUrls.push(p.image);
      }
    });

    const purgedCount = await purgeOrphanedUploadcareFiles(activeUrls);

    return NextResponse.json({
      message: `Cleaned up ${purgedCount} unattached orphan image(s) from Uploadcare CDN.`,
      purgedCount
    });
  } catch (error: any) {
    console.error('Error cleaning orphan images:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
