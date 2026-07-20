import { db, Timestamp, docToObject, StoreDoc } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const {
      // 學員資料
      name,
      phone,
      email,
      gender,
      birthDate,
      line,
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
    } = body

    // Validate required fields
    const hasPreferredTime = Array.isArray(preferredTime) ? preferredTime.length > 0 : !!preferredTime
    if (!name || !phone || !storeId || !hasPreferredTime) {
      throw createError({
        statusCode: 400,
        message: '請填寫必要欄位',
      })
    }

    // Validate phone format
    if (!/^09\d{8}$/.test(phone)) {
      throw createError({
        statusCode: 400,
        message: '手機號碼格式不正確',
      })
    }

    // Validate email if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw createError({
        statusCode: 400,
        message: 'Email 格式不正確',
      })
    }

    // Normalize preferredTime to array
    const preferredTimeArray = Array.isArray(preferredTime) ? preferredTime : [preferredTime]

    // Create lead in Firestore
    const now = Timestamp.now()
    const leadRef = db.collection('leads').doc()
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
        line: line || null,
        // 填寫者資料
        filledBySelf,
        relationship: relationship || null,
        bookerName: bookerName || null,
        contactPhone: contactPhone || phone,
        // 健康狀況
        hasMedicalCondition,
        medicalConditionNote: medicalConditionNote || null,
        // 預約資訊
        preferredTime: preferredTimeArray,
        paymentMethod,
        sources: sources || [],
      },
      status: 'new',
      internalNote: null,
      createdAt: now,
      updatedAt: now,
    }

    await leadRef.set(leadData)

    // Get store name for logging
    let storeName = ''
    try {
      const storeDoc = await db.collection('stores').doc(storeId).get()
      const storeData = docToObject<StoreDoc>(storeDoc)
      storeName = storeData?.name || ''
    } catch (e) {
      console.warn('Could not fetch store name:', e)
    }

    console.log('New booking lead:', {
      id: leadRef.id,
      name,
      phone,
      email,
      storeId,
      storeName,
      line,
      paymentMethod,
    })

    return {
      success: true,
      message: '預約成功，我們將盡快與您聯繫',
    }
  } catch (error: any) {
    console.error('Booking API error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '系統錯誤，請稍後再試',
    })
  }
})
