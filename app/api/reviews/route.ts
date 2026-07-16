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
    const { productId, rating, title, content } = body;

    if (!productId || !rating || !title || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    // Check if user already reviewed this product
    const existingReview = await prisma.review.findUnique({
      where: {
        productId_userId: {
          productId,
          userId: session.user.id,
        },
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 400 }
      );
    }

    // Check if user purchased this product (for verified purchase badge)
    const purchasedOrder = await prisma.order.findFirst({
      where: {
        userId: session.user.id,
        items: {
          some: { productId },
        },
        paymentStatus: 'completed',
      },
    });

    const review = await prisma.review.create({
      data: {
        productId,
        userId: session.user.id,
        rating: parseInt(rating),
        title,
        content,
        status: 'pending',
        verifiedPurchase: !!purchasedOrder,
      },
      include: {
        user: { select: { name: true, image: true } },
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 10;
    const skip = (page - 1) * limit;

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: {
          productId,
          status: 'approved',
        },
        include: {
          user: { select: { name: true, image: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.review.count({
        where: { productId, status: 'approved' },
      }),
    ]);

    // Calculate average rating
    const allReviews = await prisma.review.findMany({
      where: { productId, status: 'approved' },
      select: { rating: true },
    });

    const avgRating =
      allReviews.length > 0
        ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1)
        : 0;

    return NextResponse.json({
      reviews,
      avgRating,
      totalReviews: allReviews.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}
