import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import Product from '@/lib/models/Product';
import User from '@/lib/models/User';
import connectToDatabase from '@/lib/db/connect';
import { INITIAL_PRODUCTS } from '@/lib/data/initialProducts';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({ message: "Database connection not configured, using INITIAL_PRODUCTS fallback." });
    }
    
    // Clear old product documents
    await Product.deleteMany({});
    
    // Seed clean admin user if missing
    const existingAdmin = await User.findOne({ email: 'admin@brooqalkhalij.com' });
    if (!existingAdmin) {
      const adminPassword = await bcrypt.hash('admin123', 10);
      const adminUser = new User({
        name: 'Brooq Admin',
        email: 'admin@brooqalkhalij.com',
        password: adminPassword,
        role: 'admin'
      });
      await adminUser.save();
    }

    // Seed 15 clean products
    for (const prodData of INITIAL_PRODUCTS) {
      const { _id, ...rest } = prodData;
      const product = new Product(rest);
      await product.save();
    }

    return NextResponse.json({
      success: true,
      message: `Successfully re-seeded database with ${INITIAL_PRODUCTS.length} clean products.`,
      count: INITIAL_PRODUCTS.length
    });
  } catch (error: any) {
    console.error("Error re-seeding database:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
