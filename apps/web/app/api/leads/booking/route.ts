import { NextRequest, NextResponse } from 'next/server';
import { db, Timestamp } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      phone,
      email,
      gender,
      age,
      goal,
      storeId,
      preferredTime,
      source,
      message,
      sourcePage,
    } = body;

    // Validate required fields
    if (!name || !phone || !storeId || !preferredTime?.length) {
      return NextResponse.json(
        { error: '請填寫必要欄位' },
        { status: 400 }
      );
    }

    // Validate phone format
    if (!/^09\d{8}$/.test(phone)) {
      return NextResponse.json(
        { error: '手機號碼格式不正確' },
        { status: 400 }
      );
    }

    // TODO: Add reCAPTCHA / Turnstile verification

    // Create lead in Firestore
    const now = Timestamp.now();
    const leadRef = db.collection('leads').doc();
    const leadData = {
      type: 'booking',
      name,
      phone,
      email: email || null,
      storeId,
      sourcePage: sourcePage || '/booking',
      sourceChannel: source || null,
      message: message || null,
      payload: {
        gender,
        age,
        goal,
        preferredTime,
      },
      status: 'new',
      internalNote: null,
      createdAt: now,
      updatedAt: now,
    };

    await leadRef.set(leadData);

    // TODO: Send notification email
    // await sendNotificationEmail(leadData);

    console.log('New booking lead:', {
      id: leadRef.id,
      name,
      phone,
      email,
      storeId,
    });

    return NextResponse.json({
      success: true,
      message: '預約成功，我們將盡快與您聯繫',
    });
  } catch (error) {
    console.error('Booking API error:', error);
    return NextResponse.json(
      { error: '系統錯誤，請稍後再試' },
      { status: 500 }
    );
  }
}
