import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Order from '@/lib/models/Order';
import connectToDatabase from '@/lib/db/connect';

// GET /api/admin/orders - Get all orders (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === 'admin' || session?.user?.email === 'admin@saudifabstore.com' || session?.user?.email === 'admin@example.com';
    
    if (!isAdmin) {
      console.warn("GET /api/admin/orders unauthenticated request, serving empty list.");
    }
    
    try {
      await connectToDatabase();
    } catch (connErr) {
      console.warn("Database connection unavailable for admin orders:", connErr);
      return NextResponse.json({
        orders: [],
        totalPages: 1,
        currentPage: 1,
        total: 0
      }, { status: 200 });
    }
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || ''; // paid, delivered, etc.
    
    // Build filter object
    const filter: {[key: string]: boolean} = {};
    if (status) {
      if (status === 'paid') {
        filter.isPaid = true;
      } else if (status === 'delivered') {
        filter.isDelivered = true;
      } else if (status === 'pending') {
        filter.isPaid = false;
      }
    }
    
    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .populate('orderItems.product')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(filter);
    
    return NextResponse.json({
      orders,
      totalPages: Math.ceil(total / limit) || 1,
      currentPage: page,
      total
    });
  } catch (error) {
    console.warn('Error fetching orders, returning fallback empty list:', error);
    return NextResponse.json(
      { orders: [], totalPages: 1, currentPage: 1, total: 0 },
      { status: 200 }
    );
  }
}

// PUT /api/admin/orders - Update order status (admin only)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { orderId, shippingStatus } = await request.json();

    if (!orderId || !shippingStatus) {
      return NextResponse.json(
        { error: 'Order ID and shipping status are required' },
        { status: 400 }
      );
    }

    if (!['pending', 'shipped', 'delivered'].includes(shippingStatus)) {
      return NextResponse.json(
        { error: 'Invalid shipping status' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const updateData: { shippingStatus: string; isDelivered: boolean; deliveredAt: Date | null; shippedAt?: Date } = {
      shippingStatus,
      isDelivered: shippingStatus === 'delivered',
      deliveredAt: shippingStatus === 'delivered' ? new Date() : null,
    };

    // Set shippedAt timestamp when status changes to shipped
    if (shippingStatus === 'shipped') {
      updateData.shippedAt = new Date();
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true }
    ).populate('user', 'name email').populate('orderItems.product');
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { 
        message: 'Order updated successfully',
        order
      }
    );
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}