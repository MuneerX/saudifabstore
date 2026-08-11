import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { INITIAL_PRODUCTS } from '../lib/data/initialProducts';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function seedDatabase() {
  try {
    const { default: User } = await import('../lib/models/User.js');
    const { default: Product } = await import('../lib/models/Product.js');
    const { default: connectToDatabase } = await import('../lib/db/connect.js');
    
    await connectToDatabase();
    
    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    
    // Create admin user
    const saltRounds = 10;
    const adminPassword = await bcrypt.hash('admin123', saltRounds);
    
    const adminUser = new User({
      name: 'Brooq Admin',
      email: 'admin@brooqalkhalij.com',
      password: adminPassword,
      role: 'admin'
    });
    
    await adminUser.save();
    console.log('Admin user created');
    
    // Seed BR Products
    for (const productData of INITIAL_PRODUCTS) {
      const { _id, ...rest } = productData;
      const product = new Product(rest);
      await product.save();
    }
    
    console.log(`Successfully seeded ${INITIAL_PRODUCTS.length} Brooq Al Khalij products from BR products.md`);
    console.log('Database seeding completed successfully');
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();