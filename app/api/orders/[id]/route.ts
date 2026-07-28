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
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const { id } = await params;
    const order = await Order.findById(id)
      .populate('user', 'name email _id')
      .populate('orderItems.product')
      .select('+shippingStatus'); // Explicitly include shippingStatus field
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    // Check if user is authorized to view this order
    if ((order.user as unknown as { _id: string })._id.toString() !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized to view this order' },
        { status: 403 }
      );
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