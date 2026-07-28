import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Order from '@/lib/models/Order';
import Product from '@/lib/models/Product';
import Cart from '@/lib/models/Cart';
import connectToDatabase from '@/lib/db/connect';

// GET /api/orders - Get user's orders or all orders for popular products
export async function GET(request: NextRequest) {
  await connectToDatabase();

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId'); // Filter by user ID
    const limit = parseInt(searchParams.get('limit') || '1000', 10); // Default to a large limit for popular products
    const sort = searchParams.get('sort') || '-createdAt';

    const query: { user?: string } = {};

    if (userId) {
      const session = await getServerSession(authOptions);
      if (!session || !session.user) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }

      // Allow admins to access any user's orders, but regular users can only access their own
      if (session.user.role !== 'admin' && session.user.id !== userId) {
        return NextResponse.json(
          { error: 'Unauthorized to access these orders' },
          { status: 401 }
        );
      }
      query.user = userId;
    }

    const orders = await Order.find(query)
      .populate('orderItems.product')
      .sort(sort)
      .limit(limit);

    // Log shippingStatus for debugging
    console.log('User orders fetched, first order shippingStatus:', orders[0]?.shippingStatus);

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { shippingAddress, paymentMethod } = await request.json();
    
    if (!shippingAddress || !paymentMethod) {
      return NextResponse.json(
        { error: 'Shipping address and payment method are required' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    // Get user's cart
    const cart = await Cart.findOne({ user: session.user.id }).populate('items.product');
    
    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }
    
    // Calculate order items and prices
    const orderItems: { product: string; quantity: number; price: number }[] = cart.items.map((item: { product: { _id: string }; quantity: number; price: number }) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.price
    }));
    
    const itemsPrice = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shippingPrice = itemsPrice > 100 ? 0 : 10; // Free shipping over $100
    const taxPrice = itemsPrice * 0.1; // 10% tax
    const totalPrice = itemsPrice + shippingPrice + taxPrice;
    
    // Create order
    const orderData = {
      user: session.user.id,
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

    // Verify that shippingStatus was saved
    console.log('Order saved with shippingStatus:', savedOrder.shippingStatus);

    // Update product stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(
        item.product._id,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Clear user's cart
    cart.items = [];
    await cart.save();

    // Fetch the saved order with populated fields to ensure shippingStatus is included
    const populatedOrder = await Order.findById(savedOrder._id).populate('orderItems.product');

    return NextResponse.json(
      {
        message: 'Order created successfully',
        order: populatedOrder
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}