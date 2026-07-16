import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const review = await prisma.review.update({
      where: { id },
      data: { status: 'approved' },
      include: {
        user: { select: { name: true, email: true } },
        product: { select: { title: true } },
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error('Error approving review:', error);
    return NextResponse.json({ error: 'Failed to approve review' }, { status: 500 });
  }
}
