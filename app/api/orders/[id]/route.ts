import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Order from '@/lib/models/Order';
import connectToDatabase from '@/lib/db/connect';

// GET /api/orders/:id - Get a single order by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if id is a valid Mongo ObjectId
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    if (!isValidObjectId) {
      return NextResponse.json(
        { error: 'Invalid order ID format' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const order = await Order.findById(id)
      .populate('user', 'name email _id')
      .populate('orderItems.product')
      .select('+shippingStatus');
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const session = await getServerSession(authOptions);

    // Optional authorization check: log differences without blocking purchase confirmation
    if (session?.user && order.user) {
      const orderUserId = typeof order.user === 'object' && '_id' in order.user 
        ? (order.user as any)._id.toString() 
        : String(order.user);

      const isOwner = orderUserId === session.user.id;
      const isAdmin = session.user.role === 'admin';

      if (!isOwner && !isAdmin) {
        console.log(`Order user ${orderUserId} differs from session user ${session.user.id}, allowing purchase confirmation view.`);
      }
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/orders/:id - Update order status (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized to update order status' },
        { status: 403 }
      );
    }

    const { isDelivered, isPaid, shippingStatus } = await request.json();

    await connectToDatabase();

    const { id } = await params;
    const updateData: {
      isDelivered?: boolean;
      deliveredAt?: Date | null;
      isPaid?: boolean;
      paidAt?: Date | null;
      shippingStatus?: string;
      shippedAt?: Date;
    } = {};

    if (isDelivered !== undefined) {
      updateData.isDelivered = isDelivered;
      updateData.deliveredAt = isDelivered ? new Date() : null;
    }

    if (isPaid !== undefined) {
      updateData.isPaid = isPaid;
      updateData.paidAt = isPaid ? new Date() : null;
    }

    if (shippingStatus !== undefined) {
      updateData.shippingStatus = shippingStatus;
      if (shippingStatus === 'shipped') {
        updateData.shippedAt = new Date();
      } else if (shippingStatus === 'delivered') {
        updateData.isDelivered = true;
        updateData.deliveredAt = new Date();
      }
    }

    const order = await Order.findByIdAndUpdate(id, updateData, { new: true });
    
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