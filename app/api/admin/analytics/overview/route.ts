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

    const { searchParams } = new URL(request.url);
    const dateRange = searchParams.get('dateRange') || '30d';

    // Calculate date range
    const now = new Date();
    const daysMap: Record<string, number> = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365,
    };
    const days = daysMap[dateRange] || 30;
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    // Fetch analytics data in parallel
    const [orders, products, events, conversionData] = await Promise.all([
      // Total revenue and orders
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        _count: true,
        where: {
          createdAt: { gte: startDate },
          paymentStatus: 'completed',
        },
      }),

      // Top selling products
      prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        _count: true,
        where: {
          order: {
            createdAt: { gte: startDate },
            paymentStatus: 'completed',
          },
        },
        orderBy: { _count: { quantity: 'desc' } },
        take: 5,
      }),

      // Event counts
      prisma.analyticsEvent.groupBy({
        by: ['eventType'],
        _count: true,
        where: {
          timestamp: { gte: startDate },
        },
      }),

      // Conversion rate calculation
      prisma.analyticsEvent.findMany({
        where: {
          eventType: { in: ['page_view', 'add_to_cart', 'complete_purchase'] },
          timestamp: { gte: startDate },
        },
        select: { eventType: true, userId: true },
      }),
    ]);

    // Fetch product details for top products
    const topProductIds = products.map((p) => p.productId);
    const topProductDetails = await prisma.product.findMany({
      where: { id: { in: topProductIds } },
      select: { id: true, title: true },
    });

    const topProductsMap = new Map(topProductDetails.map((p) => [p.id, p.title]));

    const topProducts = products
      .map((p) => ({
        title: topProductsMap.get(p.productId) || 'Unknown Product',
        sales: p._sum.quantity || 0,
      }))
      .sort((a, b) => b.sales - a.sales);

    // Calculate conversion rate
    const uniqueVisitors = new Set(
      conversionData.filter((e) => e.eventType === 'page_view').map((e) => e.userId)
    ).size;
    const uniquePurchasers = new Set(
      conversionData.filter((e) => e.eventType === 'complete_purchase').map((e) => e.userId)
    ).size;
    const conversionRate = uniqueVisitors > 0 ? (uniquePurchasers / uniqueVisitors) * 100 : 0;

    // Event counts object
    const eventCounts: Record<string, number> = {};
    events.forEach((e) => {
      eventCounts[e.eventType] = e._count;
    });

    // Calculate average order value
    const totalRevenue = orders._sum.totalAmount || 0;
    const orderCount = orders._count || 0;
    const avgOrderValue = orderCount > 0 ? totalRevenue / orderCount : 0;

    return NextResponse.json({
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalOrders: orderCount,
      conversionRate: Math.round(conversionRate * 100) / 100,
      avgOrderValue,
      topProducts,
      eventCounts,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
