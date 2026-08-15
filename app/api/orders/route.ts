import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import mongoose from 'mongoose';
import { authOptions } from '@/lib/auth';
import Order from '@/lib/models/Order';
import Product from '@/lib/models/Product';
import Cart from '@/lib/models/Cart';
import User from '@/lib/models/User';
import connectToDatabase from '@/lib/db/connect';

// GET /api/orders - Get user's orders
export async function GET(request: NextRequest) {
  await connectToDatabase();

  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    const sort = searchParams.get('sort') || '-createdAt';

    let orders: any[] = [];

    // 1. If explicit valid ObjectId userId parameter is provided
    if (userId && /^[0-9a-fA-F]{24}$/.test(userId)) {
      orders = await Order.find({ user: userId })
        .populate('orderItems.product')
        .sort(sort)
        .limit(limit);
    } 
    // 2. If session user ID is a valid ObjectId
    else if (session.user.id && /^[0-9a-fA-F]{24}$/.test(session.user.id)) {
      orders = await Order.find({ user: session.user.id })
        .populate('orderItems.product')
        .sort(sort)
        .limit(limit);
    }

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { orders: [], error: 'Failed to fetch orders from database' },
      { status: 200 }
    );
  }
}

const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(String(id));

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to place an order.' },
        { status: 401 }
      );
    }
    
    const { shippingAddress, paymentMethod, items: directItems } = await request.json();
    
    if (!shippingAddress || !paymentMethod) {
      return NextResponse.json(
        { error: 'Shipping address and payment method are required.' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    let userId = session.user.id;
    let cart = null;

    // Resolve or find User in MongoDB by ID or email
    const userEmail = session.user.email || shippingAddress?.email;
    let targetUser = null;

    if (isValidObjectId(userId)) {
      targetUser = await User.findById(userId);
    }
    if (!targetUser && userEmail) {
      targetUser = await User.findOne({ email: userEmail });
    }
    if (!targetUser) {
      // Create user document if missing
      targetUser = new User({
        name: shippingAddress?.name || session.user.name || 'Customer',
        email: userEmail || `user_${Date.now()}@example.com`,
        password: '$2a$10$dummyhashedpasswordforcheckoutusers',
        role: session.user.role === 'admin' ? 'admin' : 'user',
      });
      await targetUser.save();
    }

    userId = targetUser._id.toString();

    // Query DB cart using valid userId
    if (isValidObjectId(userId)) {
      cart = await Cart.findOne({ user: userId }).populate('items.product');
    }
    
    let rawItems: any[] = [];

    if (cart && cart.items && cart.items.length > 0) {
      rawItems = cart.items;
    } else if (directItems && Array.isArray(directItems) && directItems.length > 0) {
      rawItems = directItems;
    }

    if (rawItems.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty. Please add items to your cart before checking out.' },
        { status: 400 }
      );
    }

    // Process order items, ensuring every product ID is a valid ObjectId
    const defaultProduct = await Product.findOne();
    const fallbackProductId = defaultProduct ? (defaultProduct as any)._id.toString() : new mongoose.Types.ObjectId().toString();

    const orderItems: { product: string; quantity: number; price: number }[] = rawItems.map((item: any) => {
      const rawProdId = item.product?._id || item.product;
      const validProdId = isValidObjectId(rawProdId) ? String(rawProdId) : fallbackProductId;
      return {
        product: validProdId,
        quantity: item.quantity || 1,
        price: item.price || item.product?.price || 10
      };
    });
    
    const itemsPrice = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shippingPrice = itemsPrice > 200 ? 0 : 15; // Free shipping over $200
    const taxPrice = itemsPrice * 0.1; // 10% tax
    const totalPrice = itemsPrice + shippingPrice + taxPrice;
    
    // Create order
    const orderData = {
      user: userId,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid: true, // Automatically mark as paid after checkout
      paidAt: new Date(),
      shippingStatus: 'pending', // Explicitly set initial shipping status
      isDelivered: false
    };

    const order = new Order(orderData);
    const savedOrder = await order.save();

    // Update product stock safely
    for (const item of orderItems) {
      try {
        if (isValidObjectId(item.product)) {
          await Product.findByIdAndUpdate(
            item.product,
            { $inc: { stock: -item.quantity } }
          );
        }
      } catch (err) {
        console.error('Error updating stock for product:', item.product, err);
      }
    }

    // Clear user's cart if DB cart exists
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    // Fetch saved order with populated fields or return savedOrder
    let populatedOrder = null;
    try {
      populatedOrder = await Order.findById(savedOrder._id).populate('orderItems.product');
    } catch (e) {
      populatedOrder = savedOrder;
    }

    return NextResponse.json(
      {
        message: 'Order created successfully',
        order: populatedOrder || savedOrder
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}