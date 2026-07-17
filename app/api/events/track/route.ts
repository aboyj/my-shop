import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { eventType, metadata } = body;

    if (!eventType) {
      return NextResponse.json({ error: 'Event type is required' }, { status: 400 });
    }

    // Store event in database
    await prisma.analyticsEvent.create({
      data: {
        eventType,
        userId: session?.user?.id,
        productId: metadata?.productId,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking event:', error);
    return NextResponse.json({ error: 'Failed to track event' }, { status: 500 });
  }
}
