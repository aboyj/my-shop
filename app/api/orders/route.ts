import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: {
          include: { product: { include: { images: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { items, subtotal, shippingAddress } = await request.json();

    if (!items || !items.length) {
      return NextResponse.json({ error: 'Empty cart' }, { status: 400 });
    }

    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const totalAmount = subtotal + tax;

    // Create order in database
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        status: 'pending',
        paymentStatus: 'unpaid',
        subtotal,
        tax,
        totalAmount,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
        shippingAddress: shippingAddress.street,
        shippingCity: shippingAddress.city,
        shippingState: shippingAddress.state,
        shippingZip: shippingAddress.zip,
        shippingCountry: shippingAddress.country,
        paymentIntentId: order.id,
      },
      include: {
        items: {
          include: { product: { include: { images: true } } },
        },
      },
    });

    // Create Razorpay order
    const razorpayOrderId = `order_${order.id}_${Date.now()}`;

    // Clear user's cart
    await prisma.cartItem.deleteMany({
      where: { userId: session.user.id },
    });

    return NextResponse.json({
      orderId: order.id,
      razorpayOrderId,
      amount: Math.round(totalAmount * 100),
      currency: 'INR',
      order,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
