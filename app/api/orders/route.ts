import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import mongoose from 'mongoose';
import { authOptions } from '@/lib/auth';
import Order from '@/lib/models/Order';
import Product from '@/lib/models/Product';
import Cart from '@/lib/models/Cart';
import User from '@/lib/models/User';
import connectToDatabase from '@/lib/db/connect';

import { INITIAL_PRODUCTS } from '@/lib/data/initialProducts';

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
      const finalCategory = catalogMatch?.category || dbProduct?.category || 'Steel Fabrication';

      const rawItemObj = typeof item?.toObject === 'function' ? item.toObject() : item;
      return {
        ...rawItemObj,
        size: rawItemObj?.size || rawItemObj?.optionName || 'Standard Spec',
        color: rawItemObj?.color || 'SASO Industrial Finish',
        product: {
          _id: pId,
          name: finalName,
          price: finalPrice,
          images: finalImages,
          category: finalCategory
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

// GET /api/orders - Get user's orders
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    let orders: any[] = [];

    try {
      await connectToDatabase();
      const { searchParams } = new URL(request.url);
      const paramUserId = searchParams.get('userId');
      const limit = parseInt(searchParams.get('limit') || '100', 10);
      const sort = searchParams.get('sort') || '-createdAt';

      const userEmail = session?.user?.email;
      let targetUser = null;

      if (paramUserId && /^[0-9a-fA-F]{24}$/.test(paramUserId)) {
        targetUser = await User.findById(paramUserId);
      }
      if (!targetUser && session?.user?.id && /^[0-9a-fA-F]{24}$/.test(session.user.id)) {
        targetUser = await User.findById(session.user.id);
      }
      if (!targetUser && userEmail) {
        targetUser = await User.findOne({ email: userEmail });
      }

      const possibleUserIdentifiers = Array.from(new Set([
        paramUserId,
        session?.user?.id,
        session?.user?.email,
        targetUser?._id?.toString(),
        targetUser?.email
      ].filter(Boolean)));

      let rawOrders: any[] = [];
      if (possibleUserIdentifiers.length > 0) {
        rawOrders = await Order.find({
          $or: possibleUserIdentifiers.map(uId => ({ user: uId }))
        }).sort(sort).limit(limit);
      }

      // Fallback: If no user-filtered orders found, retrieve all system orders
      if (rawOrders.length === 0) {
        rawOrders = await Order.find({}).sort(sort).limit(limit);
      }

      // Format every order asynchronously
      const formattedOrders = await Promise.all(
        rawOrders.map((ord: any) => formatOrder(ord))
      );

      orders = formattedOrders.filter(Boolean);
    } catch (dbErr) {
      console.warn("DB orders fetch warning:", dbErr);
    }

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { orders: [], error: 'Failed to fetch orders' },
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
    const isDirectOrder = directItems && Array.isArray(directItems) && directItems.length > 0;

    if (isDirectOrder) {
      rawItems = directItems;
    } else if (cart && cart.items && cart.items.length > 0) {
      rawItems = cart.items;
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

    const orderItems: { product: any; quantity: number; price: number; size?: string; color?: string }[] = rawItems.map((item: any) => {
      const rawProdId = item.product?._id || item.product;
      const prodId = rawProdId ? String(rawProdId) : fallbackProductId;
      return {
        product: prodId,
        quantity: item.quantity || 1,
        price: item.price || item.product?.price || 150,
        size: item.size || "Standard Spec",
        color: item.color || "SASO Industrial Finish"
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

    // Update product stock and orderCount safely
    for (const item of orderItems) {
      try {
        await Product.updateOne(
          { $or: [{ _id: item.product }, { name: item.product }] },
          { $inc: { stock: -item.quantity, orderCount: item.quantity } }
        );
      } catch (err) {
        console.error('Error updating stock/orderCount for product:', item.product, err);
      }
    }

    // Clear user's DB cart ONLY if order was placed from full cart
    if (cart && !isDirectOrder) {
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