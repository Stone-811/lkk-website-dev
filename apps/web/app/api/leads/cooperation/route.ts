import { NextRequest, NextResponse } from 'next/server';
import { db, Timestamp } from '@/lib/firebase';

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

    // Validate required fields
    if (!organization || !name || !phone || !lineId || !message || !cooperationType) {
      return NextResponse.json(
        { error: '請填寫必要欄位' },
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
        lineId,
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
