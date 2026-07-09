import { NextRequest, NextResponse } from 'next/server';
import { db, Timestamp, docToObject, StoreDoc } from '@/lib/firebase';
import { sendLeadNotification, sendBookingConfirmation } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      // 學員資料
      name,
      phone,
      email,
      gender,
      birthDate,
      // 填寫者資料
      filledBySelf,
      relationship,
      bookerName,
      contactPhone,
      // 健康狀況
      hasMedicalCondition,
      medicalConditionNote,
      // 預約資訊
      storeId,
      preferredTime,
      sources,
      paymentMethod,
      message,
      sourcePage,
    } = body;

    // Validate required fields
    if (!name || !phone || !storeId || !preferredTime) {
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

    // Validate email if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Email 格式不正確' },
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
      sourceChannel: Array.isArray(sources) ? sources.join(', ') : sources || null,
      message: message || null,
      payload: {
        // 學員資料
        gender,
        birthDate,
        // 填寫者資料
        filledBySelf,
        relationship: relationship || null,
        bookerName: bookerName || null,
        contactPhone: contactPhone || phone,
        // 健康狀況
        hasMedicalCondition,
        medicalConditionNote: medicalConditionNote || null,
        // 預約資訊
        preferredTime,
        paymentMethod,
        sources: sources || [],
      },
      status: 'new',
      internalNote: null,
      createdAt: now,
      updatedAt: now,
    };

    await leadRef.set(leadData);

    // Get store name for notification
    let storeName = '';
    try {
      const storeDoc = await db.collection('stores').doc(storeId).get();
      const storeData = docToObject<StoreDoc>(storeDoc);
      storeName = storeData?.name || '';
    } catch (e) {
      console.warn('Could not fetch store name:', e);
    }

    // Build additional info for email notification
    const additionalInfo: string[] = [];
    if (gender) additionalInfo.push(`性別: ${gender}`);
    if (birthDate) additionalInfo.push(`出生日期: ${birthDate}`);
    if (!filledBySelf && bookerName) {
      additionalInfo.push(`預約者: ${bookerName} (${relationship})`);
      additionalInfo.push(`聯繫電話: ${contactPhone}`);
    }
    if (hasMedicalCondition) {
      additionalInfo.push(`健康狀況: 有疾病或近期手術/住院史`);
      if (medicalConditionNote) additionalInfo.push(`  → ${medicalConditionNote}`);
    }
    additionalInfo.push(`方便時段: ${preferredTime}`);
    additionalInfo.push(`付款方式: ${paymentMethod}`);
    if (sources && sources.length > 0) {
      additionalInfo.push(`得知管道: ${sources.join(', ')}`);
    }

    // Send email notification to admin (non-blocking)
    sendLeadNotification({
      type: 'booking',
      name,
      phone,
      email,
      storeName,
      message: additionalInfo.join('\n') + (message ? `\n\n留言: ${message}` : ''),
      createdAt: now.toDate(),
    }).catch((err) => console.error('Failed to send notification:', err));

    // Send confirmation email to customer (non-blocking)
    if (email) {
      sendBookingConfirmation({
        name,
        email,
        storeName,
        preferredTime: [preferredTime],
        paymentMethod,
      }).catch((err) => console.error('Failed to send confirmation:', err));
    }

    console.log('New booking lead:', {
      id: leadRef.id,
      name,
      phone,
      email,
      storeId,
      paymentMethod,
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
