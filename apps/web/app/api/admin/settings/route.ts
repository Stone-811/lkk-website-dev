import { NextResponse } from 'next/server';
import { db, Timestamp } from '@/lib/firebase';
import { getSession } from '@/lib/auth';
import { sendTestNotification } from '@/lib/email';

// GET - Get all settings
export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get notification settings
    const notificationsDoc = await db.collection('settings').doc('notifications').get();
    const notifications = notificationsDoc.exists
      ? notificationsDoc.data()
      : { emailOnNewLead: true, emailRecipients: '' };

    // Get general settings
    const generalDoc = await db.collection('settings').doc('general').get();
    const general = generalDoc.exists
      ? generalDoc.data()
      : {
          siteName: '練健康',
          siteDescription: '專業一對一私人教練，科學化訓練，找回你的健康生活。',
          contactEmail: 'service@l-kk.tw',
          contactPhone: '02-2712-3456',
        };

    // Get social links
    const socialDoc = await db.collection('settings').doc('social').get();
    const socialLinks = socialDoc.exists
      ? socialDoc.data()
      : {
          facebook: '',
          instagram: '',
          youtube: '',
          line: '',
        };

    return NextResponse.json({
      success: true,
      data: {
        ...general,
        socialLinks,
        notifications,
      },
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// PATCH - Update settings
export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { section, data } = body;

    if (!section || !data) {
      return NextResponse.json({ error: 'Missing section or data' }, { status: 400 });
    }

    const now = Timestamp.now();
    const docRef = db.collection('settings').doc(section);

    await docRef.set(
      {
        ...data,
        updatedAt: now,
      },
      { merge: true }
    );

    return NextResponse.json({
      success: true,
      message: '設定已更新',
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}

// POST - Send test notification
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, recipients } = body;

    if (action === 'test-notification') {
      if (!recipients || recipients.length === 0) {
        return NextResponse.json({ error: '請輸入收件人信箱' }, { status: 400 });
      }

      await sendTestNotification(recipients);

      return NextResponse.json({
        success: true,
        message: '測試通知已發送',
      });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    console.error('Error sending test notification:', error);
    return NextResponse.json(
      { error: error.message || '發送失敗' },
      { status: 500 }
    );
  }
}
