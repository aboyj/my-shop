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

    // Fetch orders data
    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: startDate },
      },
      select: {
        id: true,
        createdAt: true,
        totalAmount: true,
        status: true,
        paymentStatus: true,
        user: { select: { email: true } },
        items: { select: { quantity: true, price: true } },
      },
    });

    // Generate CSV
    const csv = generateCSV(orders);

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="analytics-${dateRange}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error exporting analytics:', error);
    return NextResponse.json({ error: 'Failed to export analytics' }, { status: 500 });
  }
}

function generateCSV(orders: any[]): string {
  const headers = ['Order ID', 'Date', 'Customer Email', 'Total Amount', 'Status', 'Payment Status'];
  const rows = orders.map((order) => [
    order.id,
    new Date(order.createdAt).toISOString(),
    order.user.email,
    order.totalAmount.toFixed(2),
    order.status,
    order.paymentStatus,
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  return csvContent;
}
