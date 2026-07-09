import { NextRequest, NextResponse } from 'next/server';
import { db, Timestamp } from '@/lib/firebase';
import { sendLeadNotification, sendFranchiseConfirmation } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      organization,
      email,
      phone,
      region,
      cooperationType,
      message,
      sourcePage,
    } = body;

    // Validate required fields
    if (!name || !email || !region || !cooperationType) {
      return NextResponse.json(
        { error: '請填寫必要欄位' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email 格式不正確' },
        { status: 400 }
      );
    }

    // Validate phone format if provided
    if (phone && !/^09\d{8}$/.test(phone)) {
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
      type: 'franchise',
      name,
      phone: phone || null,
      email,
      organization: organization || null,
      sourcePage: sourcePage || '/franchise',
      sourceChannel: null,
      message: message || null,
      payload: {
        region,
        cooperationType,
      },
      status: 'new',
      internalNote: null,
      createdAt: now,
      updatedAt: now,
    };

    await leadRef.set(leadData);

    // Send email notification to admin (non-blocking)
    sendLeadNotification({
      type: 'franchise',
      name,
      phone: phone || '',
      email,
      organization,
      cooperationType,
      message,
      createdAt: now.toDate(),
    }).catch((err) => console.error('Failed to send notification:', err));

    // Send confirmation email to customer (non-blocking)
    sendFranchiseConfirmation({
      name,
      email,
      region,
      investmentBudget: cooperationType, // Using cooperationType as category info
    }).catch((err) => console.error('Failed to send confirmation:', err));

    console.log('New franchise lead:', {
      id: leadRef.id,
      name,
      email,
      region,
      cooperationType,
    });

    return NextResponse.json({
      success: true,
      message: '感謝您的洽詢，我們將盡快與您聯繫',
    });
  } catch (error) {
    console.error('Franchise API error:', error);
    return NextResponse.json(
      { error: '系統錯誤，請稍後再試' },
      { status: 500 }
    );
  }
}
