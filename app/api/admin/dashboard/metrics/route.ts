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

    // Fetch metrics in parallel
    const [totalOrders, totalProducts, totalUsers, totalRevenue, recentOrders] = await Promise.all([
      prisma.order.count(),
      prisma.product.count(),
      prisma.user.count(),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { paymentStatus: 'completed' },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } },
          items: true,
        },
      }),
    ]);

    return NextResponse.json({
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      totalOrders,
      totalProducts,
      totalUsers,
      recentOrders,
    });
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 });
  }
}
