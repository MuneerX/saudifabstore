import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Order from '@/lib/models/Order';
import connectToDatabase from '@/lib/db/connect';

import { INITIAL_PRODUCTS } from '@/lib/data/initialProducts';
import Product from '@/lib/models/Product';

async function formatOrder(rawOrder: any) {
  if (!rawOrder) return null;
  const orderObj = typeof rawOrder.toObject === 'function' ? rawOrder.toObject() : { ...rawOrder };

  const formattedItems = await Promise.all(
    (orderObj.orderItems || []).map(async (item: any) => {
      let pObj = typeof item.product === 'object' && item.product !== null ? { ...item.product } : null;
      const pId = pObj?._id?.toString() || (typeof item.product === 'string' ? item.product : '') || 'prod-1';

      let catalogMatch = INITIAL_PRODUCTS.find(
        p => p._id === pId || p.name === pId || p.name.toLowerCase().replace(/[^a-z0-9]/g, '-') === pId
      );

      let dbProduct: any = null;
      if (!pObj?.name && !catalogMatch) {
        try {
          dbProduct = await Product.findOne({
            $or: [{ _id: pId }, { name: pId }]
          });
        } catch (e) {
          console.warn("formatOrder DB product lookup notice:", e);
        }
      }

      const finalName = pObj?.name || catalogMatch?.name || dbProduct?.name || 'Structural Steel Component';
      const finalPrice = typeof pObj?.price === 'number' ? pObj.price : (catalogMatch?.price || dbProduct?.price || item.price || 150);
      const finalImages = pObj?.images?.length ? pObj.images : (catalogMatch?.images || dbProduct?.images || ["/images/home/category_grid/warehouse.jpeg"]);

      const rawItemObj = typeof item?.toObject === 'function' ? item.toObject() : item;
      return {
        ...rawItemObj,
        size: rawItemObj?.size || rawItemObj?.optionName || 'Standard Spec',
        color: rawItemObj?.color || 'SASO Industrial Finish',
        product: {
          _id: pId,
          name: finalName,
          price: finalPrice,
          images: finalImages
        },
        price: rawItemObj?.price || finalPrice
      };
    })
  );

  return {
    ...orderObj,
    orderItems: formattedItems
  };
}

// GET /api/orders/:id - Get a single order by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    let order = null;
    try {
      if (/^[0-9a-fA-F]{24}$/.test(id)) {
        order = await Order.findById(id).select('+shippingStatus');
      } else {
        order = await Order.findOne({ _id: id }).select('+shippingStatus');
      }
    } catch (e) {
      console.warn("Order findById error:", e);
    }
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const formattedOrder = await formatOrder(order);

    return NextResponse.json({ order: formattedOrder }, { status: 200 });
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