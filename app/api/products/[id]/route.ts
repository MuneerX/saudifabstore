import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Product from '@/lib/models/Product';
import connectToDatabase from '@/lib/db/connect';
import { INITIAL_PRODUCTS } from '@/lib/data/initialProducts';
import { deleteMultipleFromUploadcare } from '@/lib/utils/uploadcare';

// GET /api/products/:id - Get a single product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let product = null;

    await connectToDatabase();
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);
    const queryId = isMongoId ? new mongoose.Types.ObjectId(id) : id;

    product = await Product.findOne({
      $or: [
        { _id: id },
        { _id: queryId },
        { sku: id },
        { name: { $regex: new RegExp(`^${id.replace(/-/g, ' ')}$`, 'i') } }
      ]
    });

    // Fallback search in INITIAL_PRODUCTS
    if (!product) {
      const initial = INITIAL_PRODUCTS.find(p => p._id === id || p.name.toLowerCase().replace(/[^a-z0-9]/g, '-') === id);
      if (initial) {
        product = await Product.findOne({ name: initial.name }) || initial;
      }
    }
    
    if (!product) {
      product = await Product.findOne({}) || INITIAL_PRODUCTS[0];
    }
    
    const pObj = typeof product.toObject === 'function' ? product.toObject() : { ...product };
    const fallbackProd = INITIAL_PRODUCTS.find(ip => ip._id === pObj._id || ip.name?.toLowerCase() === (pObj.name || '').toLowerCase());
    
    if (!pObj.images || pObj.images.length === 0) {
      pObj.images = (fallbackProd && fallbackProd.images) ? fallbackProd.images : ["/images/home/category_grid/warehouse.jpeg"];
    }

    if (!pObj.specImage) {
      pObj.specImage = "";
    }

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
      { product: INITIAL_PRODUCTS[0] },
      { status: 200 }
    );
  }
}

// PUT /api/products/:id - Update a product by ID (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    await connectToDatabase();

    const { id } = await params;
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);
    const queryId = isMongoId ? new mongoose.Types.ObjectId(id) : id;

    const oldProduct = await Product.findOne({ $or: [{ _id: id }, { _id: queryId }] });

    await Product.collection.updateOne(
      { $or: [{ _id: id as any }, { _id: queryId as any }] },
      { $set: body }
    );

    const product = await Product.findOne({ $or: [{ _id: id }, { _id: queryId }] });
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Automatically purge replaced/removed images from Uploadcare CDN
    if (oldProduct) {
      const oldImages = [...(oldProduct.images || []), oldProduct.specImage].filter(Boolean) as string[];
      const newImages = [...(body.images || []), body.specImage].filter(Boolean) as string[];
      const removedImages = oldImages.filter(img => !newImages.includes(img));

      if (removedImages.length > 0) {
        deleteMultipleFromUploadcare(removedImages).catch(err => {
          console.error("Error purging replaced images from Uploadcare:", err);
        });
      }
    }
    
    const updatedObj = typeof product.toObject === 'function' ? product.toObject() : { ...product };

    return NextResponse.json(
      { 
        message: 'Product updated successfully',
        product: updatedObj
      }
    );
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/:id - Delete a product by ID (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params;
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);
    const queryId = isMongoId ? new mongoose.Types.ObjectId(id) : id;

    const product = await Product.findOneAndDelete({
      $or: [{ _id: id }, { _id: queryId }]
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
      console.log("Purging deleted product images from Uploadcare:", imagesToPurge);
      deleteMultipleFromUploadcare(imagesToPurge).catch(err => {
        console.error("Error purging deleted product images from Uploadcare:", err);
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