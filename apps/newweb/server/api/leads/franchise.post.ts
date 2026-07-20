import { db, Timestamp } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const {
      name,
      organization,
      email,
      phone,
      region,
      cooperationType,
      message,
      sourcePage,
    } = body

    // Validate required fields
    if (!name || !phone || !email) {
      throw createError({
        statusCode: 400,
        message: '請填寫必要欄位',
      })
    }

    // Validate phone format (Taiwan mobile or landline)
    const phoneRegex = /^(09\d{8}|0\d{1,2}-?\d{3,4}-?\d{4})$/
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      throw createError({
        statusCode: 400,
        message: '電話格式不正確',
      })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw createError({
        statusCode: 400,
        message: '電子郵件格式不正確',
      })
    }

    // Create lead in Firestore
    const now = Timestamp.now()
    const leadRef = db.collection('leads').doc()
    const leadData = {
      type: 'franchise',
      name,
      phone,
      email: email || null,
      storeId: null,
      sourcePage: sourcePage || '/franchise',
      sourceChannel: null,
      message: message || null,
      payload: {
        organization: organization || null,
        region: region || null,
        cooperationType: cooperationType || null,
      },
      status: 'new',
      internalNote: null,
      createdAt: now,
      updatedAt: now,
    }

    await leadRef.set(leadData)

    console.log('New franchise lead:', {
      id: leadRef.id,
      name,
      organization,
      region,
    })

    return {
      success: true,
      message: '表單已送出，我們將盡快與您聯繫',
    }
  } catch (error: any) {
    console.error('Franchise API error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '系統錯誤，請稍後再試',
    })
  }
})
