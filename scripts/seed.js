const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');

// Add the project root to module resolution paths
module.exports = require;

// Import models using absolute paths
const User = require(path.resolve(__dirname, '../lib/models/User'));
const Product = require(path.resolve(__dirname, '../lib/models/Product'));
const connectToDatabase = require(path.resolve(__dirname, '../lib/db/connect'));

async function seedDatabase() {
 try {
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
    
    // Create sample products
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