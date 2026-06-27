import { NextRequest, NextResponse } from 'next/server';
import { db, Timestamp } from '@/lib/firebase';
import { sendLeadNotification } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      cooperationType,
      organization,
      name,
      phone,
      lineId,
      email,
      message,
      sourcePage,
    } = body;

    // Validate required fields (lineId is optional)
    if (!organization || !name || !phone || !email || !message || !cooperationType) {
      return NextResponse.json(
        { error: '請填寫必要欄位' },
        { status: 400 }
      );
    }

    // Validate phone format (Taiwan mobile or landline)
    const phoneRegex = /^(09\d{8}|0\d{1,2}-?\d{3,4}-?\d{4})$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return NextResponse.json(
        { error: '電話格式不正確' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '電子郵件格式不正確' },
        { status: 400 }
      );
    }

    // TODO: Add reCAPTCHA / Turnstile verification

    // Create lead in Firestore
    const now = Timestamp.now();
    const leadRef = db.collection('leads').doc();
    const leadData = {
      type: 'cooperation',
      name,
      phone,
      email: email || null,
      storeId: null,
      sourcePage: sourcePage || '/cooperation',
      sourceChannel: null,
      message,
      payload: {
        cooperationType,
        organization,
        lineId: lineId || null,
      },
      status: 'new',
      internalNote: null,
      createdAt: now,
      updatedAt: now,
    };

    await leadRef.set(leadData);

    console.log('New cooperation lead:', {
      id: leadRef.id,
      name,
      organization,
      cooperationType,
    });

    // Send email notification (non-blocking)
    sendLeadNotification({
      type: 'cooperation',
      name,
      phone,
      email,
      organization,
      cooperationType,
      message,
      createdAt: now.toDate(),
    }).catch((err) => console.error('Failed to send notification:', err));

    return NextResponse.json({
      success: true,
      message: '表單已送出，我們將於 2 個工作天內與您聯繫',
    });
  } catch (error) {
    console.error('Cooperation API error:', error);
    return NextResponse.json(
      { error: '系統錯誤，請稍後再試' },
      { status: 500 }
    );
  }
}
