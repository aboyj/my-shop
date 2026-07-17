import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { subject, htmlContent } = body;

    const template = await prisma.emailTemplate.update({
      where: { id },
      data: {
        subject,
        htmlContent,
      },
    });

    return NextResponse.json(template);
  } catch (error) {
    console.error('Error updating email template:', error);
    return NextResponse.json({ error: 'Failed to update template' }, { status: 500 });
  }
}
