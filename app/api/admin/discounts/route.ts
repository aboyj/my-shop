import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const discounts = await prisma.discountCode.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(discounts);
  } catch (error) {
    console.error('Error fetching discounts:', error);
    return NextResponse.json({ error: 'Failed to fetch discounts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { code, type, value, maxUses, minOrderAmount, expiresAt } = body;

    if (!code || !type || !value) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if code already exists
    const existing = await prisma.discountCode.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'This coupon code already exists' },
        { status: 400 }
      );
    }

    const discount = await prisma.discountCode.create({
      data: {
        code: code.toUpperCase(),
        type,
        value,
        maxUses: maxUses || null,
        minOrderAmount: minOrderAmount || 0,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    return NextResponse.json(discount, { status: 201 });
  } catch (error) {
    console.error('Error creating discount:', error);
    return NextResponse.json({ error: 'Failed to create discount' }, { status: 500 });
  }
}
