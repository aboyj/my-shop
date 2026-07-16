import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { code, subtotal } = body;

    if (!code) {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });
    }

    const coupon = await prisma.discountCode.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      return NextResponse.json(
        { error: 'Invalid coupon code' },
        { status: 400 }
      );
    }

    // Check expiration
    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      return NextResponse.json(
        { error: 'This coupon has expired' },
        { status: 400 }
      );
    }

    // Check usage limit
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json(
        { error: 'This coupon has reached its usage limit' },
        { status: 400 }
      );
    }

    // Check minimum order amount
    if (subtotal < coupon.minOrderAmount) {
      return NextResponse.json(
        {
          error: `Minimum order amount of $${coupon.minOrderAmount} required for this coupon`,
        },
        { status: 400 }
      );
    }

    // Calculate discount
    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = (subtotal * coupon.value) / 100;
    } else {
      discount = coupon.value;
    }

    // Don't let discount exceed subtotal
    discount = Math.min(discount, subtotal);

    return NextResponse.json({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      discount: parseFloat(discount.toFixed(2)),
    });
  } catch (error) {
    console.error('Error validating coupon:', error);
    return NextResponse.json({ error: 'Failed to validate coupon' }, { status: 500 });
  }
}
