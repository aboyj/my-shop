import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import crypto from 'crypto';
import { sendOrderConfirmationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    // Verify signature
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const generatedSignature = crypto
      .createHmac('sha256', keySecret!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Extract order ID from razorpay_order_id (format: order_${orderId}_${timestamp})
    const orderIdMatch = razorpay_order_id.match(/order_([a-z0-9]+)_/);
    if (!orderIdMatch) {
      return NextResponse.json({ error: 'Invalid order format' }, { status: 400 });
    }

    const orderId = orderIdMatch[1];

    // Update order status
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'paid',
        status: 'confirmed',
        paymentIntentId: razorpay_payment_id,
      },
      include: {
        items: {
          include: { product: true },
        },
        user: true,
      },
    });

    // Send confirmation email
    if (order.user?.email) {
      await sendOrderConfirmationEmail(order.user.email, order);
    }

    return NextResponse.json({ success: true, orderId });
  } catch (error) {
    console.error('Razorpay webhook error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}
