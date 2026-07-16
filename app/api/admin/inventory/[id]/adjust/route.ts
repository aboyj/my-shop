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

    const body = await request.json();
    const { quantity, reason } = body;

    if (quantity === undefined) {
      return NextResponse.json(
        { error: 'Quantity adjustment is required' },
        { status: 400 }
      );
    }

    // Get current inventory
    const current = await prisma.inventory.findUnique({
      where: { id },
    });

    if (!current) {
      return NextResponse.json({ error: 'Inventory not found' }, { status: 404 });
    }

    const newQuantity = Math.max(0, current.quantity + quantity);

    // Update inventory
    const updated = await prisma.inventory.update({
      where: { id },
      data: { quantity: newQuantity },
      include: {
        product: { select: { title: true } },
      },
    });

    // Log the change
    await prisma.inventoryLog.create({
      data: {
        inventoryId: id,
        changeType: quantity > 0 ? 'added' : 'removed',
        quantity: Math.abs(quantity),
        reason: reason || 'Manual adjustment',
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error adjusting inventory:', error);
    return NextResponse.json({ error: 'Failed to adjust inventory' }, { status: 500 });
  }
}
