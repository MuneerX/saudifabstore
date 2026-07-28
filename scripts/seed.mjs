import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

// Check if MONGODB_URI is loaded
console.log('MONGODB_URI:', process.env.MONGODB_URI);

// Import models using dynamic imports with .js extension
async function seedDatabase() {
  try {
    // Dynamically import models
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
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin'
    });
    
    await adminUser.save();
    console.log('Admin user created');
    
    // Create sample products using images from public/home
    const sampleProducts = [
      {
        name: 'Classic White T-Shirt',
        description: 'A comfortable and stylish white t-shirt made from 100% cotton.',
        price: 19.99,
        category: 'Clothing',
        brand: 'Generic',
        images: ['/home/shirt1.png'],
        stock: 50,
        isFeatured: true
      },
      {
        name: 'Blue Jeans',
        description: 'Classic blue jeans with a perfect fit.',
        price: 49.99,
        category: 'Clothing',
        brand: 'Generic',
        images: ['/home/shirt2.png'],
        stock: 30,
        isFeatured: true
      },
      {
        name: 'Running Shoes',
        description: 'Lightweight running shoes for everyday use.',
        price: 89.99,
        category: 'Footwear',
        brand: 'Generic',
        images: ['/home/shirt3.png'],
        stock: 25,
        isFeatured: true
      },
      {
        name: 'Leather Wallet',
        description: 'Genuine leather wallet with multiple card slots.',
        price: 39.99,
        category: 'Accessories',
        brand: 'Generic',
        images: ['/home/shirt4.png'],
        stock: 40,
        isFeatured: false
      },
      {
        name: 'Calvin Klein Logo T-Shirt',
        description: 'Authentic Calvin Klein logo t-shirt.',
        price: 29.99,
        category: 'Clothing',
        brand: 'Calvin Klein',
        images: ['/home/calvin klein logo.svg'],
        stock: 20,
        isFeatured: true
      },
      {
        name: 'Gucci Logo T-Shirt',
        description: 'Designer Gucci logo t-shirt.',
        price: 99.99,
        category: 'Clothing',
        brand: 'Gucci',
        images: ['/home/gucci-logo-1 1.svg'],
        stock: 15,
        isFeatured: true
      },
      {
        name: 'Prada Logo T-Shirt',
        description: 'Designer Prada logo t-shirt.',
        price: 89.99,
        category: 'Clothing',
        brand: 'Prada',
        images: ['/home/prada-logo-1 1.svg'],
        stock: 10,
        isFeatured: true
      },
      {
        name: 'Versace Logo T-Shirt',
        description: 'Designer Versace logo t-shirt.',
        price: 79.99,
        category: 'Clothing',
        brand: 'Versace',
        images: ['/home/versace-logo.svg'],
        stock: 12,
        isFeatured: true
      },
      {
        name: 'Zara Logo T-Shirt',
        description: 'Designer Zara logo t-shirt.',
        price: 39.99,
        category: 'Clothing',
        brand: 'Zara',
        images: ['/home/zara-logo-1 1.svg'],
        stock: 25,
        isFeatured: false
      }
    ];
    
    for (const productData of sampleProducts) {
      const product = new Product(productData);
      await product.save();
    }
    
    console.log('Sample products created');
    console.log('Database seeding completed successfully');
    
    // Close the database connection
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();