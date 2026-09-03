import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/connect';
import Category from '@/lib/models/Category';
import Product from '@/lib/models/Product';
import { DEFAULT_PRODUCT_CATEGORIES, addCategoryInMemory, removeCategoryFromMemory } from '@/lib/data/categories';

export async function GET() {
  try {
    let dbCategories: string[] = [];
    try {
      await connectToDatabase();
      const catDocs = await Category.find({}).sort({ name: 1 });
      dbCategories = catDocs.map(c => c.name);
    } catch (e) {
      console.warn('[Categories API] DB fetch warning, using in-memory list:', (e as Error).message);
    }

    // Combine default categories, memory store, and DB categories
    const combinedSet = new Set([
      ...DEFAULT_PRODUCT_CATEGORIES,
      ...(global.dynamicCategoriesStore || []),
      ...dbCategories
    ]);

    const categoriesList = Array.from(combinedSet);
    return NextResponse.json({ categories: categoriesList }, { status: 200 });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ categories: DEFAULT_PRODUCT_CATEGORIES }, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description } = await request.json();
    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Category name is required.' }, { status: 400 });
    }

    const trimmedName = name.trim();
    const slug = trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    addCategoryInMemory(trimmedName);

    try {
      await connectToDatabase();
      const existing = await Category.findOne({
        $or: [{ name: trimmedName }, { slug }]
      });

      if (!existing) {
        const newCat = new Category({
          name: trimmedName,
          slug,
          description: description || ''
        });
        await newCat.save();
      }
    } catch (e) {
      console.warn('[Categories API] DB save warning, added in-memory:', (e as Error).message);
    }

    return NextResponse.json({ message: 'Category added successfully', name: trimmedName }, { status: 201 });
  } catch (error) {
    console.error('Error adding category:', error);
    return NextResponse.json({ error: 'Failed to add category' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryName = searchParams.get('name');

    if (!categoryName || !categoryName.trim()) {
      return NextResponse.json({ error: 'Category name is required.' }, { status: 400 });
    }

    const trimmedName = categoryName.trim();

    // Check if any product is using this category
    try {
      await connectToDatabase();
      const productCount = await Product.countDocuments({ category: trimmedName });
      if (productCount > 0) {
        return NextResponse.json(
          { error: `Cannot delete category "${trimmedName}" because ${productCount} product(s) are currently assigned to it.` },
          { status: 400 }
        );
      }

      await Category.deleteOne({ name: trimmedName });
    } catch (e) {
      console.warn('[Categories API] DB delete warning:', (e as Error).message);
    }

    removeCategoryFromMemory(trimmedName);

    return NextResponse.json({ message: `Category "${trimmedName}" removed successfully.` }, { status: 200 });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
