import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Product from '@/lib/models/Product';
import connectToDatabase from '@/lib/db/connect';
import { INITIAL_PRODUCTS } from '@/lib/data/initialProducts';
import { deleteMultipleFromUploadcare } from '@/lib/utils/uploadcare';

// GET /api/admin/products/[id] - Get a single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const resolvedParams = await params;
    const rawTargetId = resolvedParams.id;
    const targetId = decodeURIComponent(rawTargetId);
    let product: any = null;

    const isMongoId = /^[0-9a-fA-F]{24}$/.test(targetId);
    const queryId = isMongoId ? new mongoose.Types.ObjectId(targetId) : null;

    // 1. Try finding in MongoDB collection using raw driver (bypasses CastError for string _ids like "prod-1")
    try {
      if (Product.collection) {
        product = await Product.collection.findOne({
          $or: [
            { _id: targetId as any },
            { _id: rawTargetId as any },
            ...(queryId ? [{ _id: queryId as any }] : []),
            { sku: targetId },
            { name: targetId }
          ]
        });
      }
    } catch (e) {
      console.warn("Raw collection search error:", e);
    }

    // 2. Try regex name match if not found by ID
    if (!product) {
      try {
        product = await Product.findOne({ name: { $regex: new RegExp(`^${targetId.replace(/-/g, ' ')}$`, 'i') } });
      } catch (e) {}
    }

    // 3. Fallback search in INITIAL_PRODUCTS
    if (!product) {
      const initial = INITIAL_PRODUCTS.find(p => p._id === targetId || p.name.toLowerCase().replace(/[^a-z0-9]/g, '-') === targetId);
      if (initial) {
        product = initial;
      }
    }

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const pObj = typeof product.toObject === 'function' ? product.toObject() : { ...product };
    const fallbackProd = INITIAL_PRODUCTS.find(ip => ip._id === pObj._id || ip.name?.toLowerCase() === (pObj.name || '').toLowerCase());

    if (pObj.material === undefined || pObj.material === null) pObj.material = fallbackProd?.material || "";
    if (pObj.dimensions === undefined || pObj.dimensions === null) pObj.dimensions = fallbackProd?.dimensions || "";
    if (pObj.weight === undefined || pObj.weight === null) pObj.weight = fallbackProd?.weight || "";
    if (pObj.fabricationDetails === undefined || pObj.fabricationDetails === null) pObj.fabricationDetails = fallbackProd?.fabricationDetails || "";
    if (pObj.surfacePreparation === undefined || pObj.surfacePreparation === null) pObj.surfacePreparation = fallbackProd?.surfacePreparation || "";
    if (pObj.testingCertifications === undefined || pObj.testingCertifications === null) pObj.testingCertifications = fallbackProd?.testingCertifications || "";

    return NextResponse.json({ product: pObj });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/products/[id] - Delete a product (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const resolvedParams = await params;
    const targetId = resolvedParams.id;
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(targetId);
    const queryId = isMongoId ? new mongoose.Types.ObjectId(targetId) : targetId;

    const product = await Product.findOneAndDelete({
      $or: [{ _id: targetId }, { _id: queryId }]
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Automatically purge deleted product images from Uploadcare CDN
    const pObj = typeof product.toObject === 'function' ? product.toObject() : product;
    const imagesToPurge = [
      ...(pObj.images || []),
      pObj.specImage,
      pObj.image
    ].filter(Boolean) as string[];

    if (imagesToPurge.length > 0) {
      console.log("Purging admin deleted product images from Uploadcare:", imagesToPurge);
      deleteMultipleFromUploadcare(imagesToPurge).catch(err => {
        console.error("Error purging admin deleted product images from Uploadcare:", err);
      });
    }

    return NextResponse.json(
      { message: 'Product deleted successfully' }
    );
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}