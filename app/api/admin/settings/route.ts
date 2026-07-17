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

    const settings = await prisma.adminSetting.findMany();

    const settingsMap: Record<string, any> = {
      siteName: 'My Shop',
      siteUrl: 'http://localhost:3000',
      emailFrom: 'noreply@myshop.com',
      emailHost: 'localhost',
      emailPort: 587,
      taxRate: 8,
      shippingCost: 10,
    };

    settings.forEach((setting) => {
      if (setting.type === 'number') {
        settingsMap[setting.key] = parseFloat(setting.value);
      } else {
        settingsMap[setting.key] = setting.value;
      }
    });

    return NextResponse.json(settingsMap);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    for (const [key, value] of Object.entries(body)) {
      const type = typeof value === 'number' ? 'number' : 'string';

      await prisma.adminSetting.upsert({
        where: { key },
        create: {
          key,
          value: String(value),
          type,
          updatedBy: session.user.id,
        },
        update: {
          value: String(value),
          type,
          updatedBy: session.user.id,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
