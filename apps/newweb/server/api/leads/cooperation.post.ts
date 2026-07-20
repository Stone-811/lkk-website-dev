export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const {
      cooperationType,
      organization,
      name,
      phone,
      lineId,
      email,
      companySize,
      budgetRange,
      message,
      sourcePage,
    } = body

    // Validate required fields (lineId is optional)
    if (!organization || !name || !phone || !email || !message || !cooperationType) {
      setResponseStatus(event, 400)
      return { success: false, error: '請填寫必要欄位' }
    }

    // Validate phone format (Taiwan mobile or landline)
    const phoneRegex = /^(09\d{8}|0\d{1,2}-?\d{3,4}-?\d{4})$/
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      setResponseStatus(event, 400)
      return { success: false, error: '電話格式不正確' }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setResponseStatus(event, 400)
      return { success: false, error: '電子郵件格式不正確' }
    }

    // Dynamic import to avoid bundling issues
    const { getDb, getTimestamp } = await import('~/server/utils/firebase')
    const db = await getDb()
    const Timestamp = await getTimestamp()

    // Create lead in Firestore
    const now = Timestamp.now()
    const leadRef = db.collection('leads').doc()
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
        companySize: companySize || null,
        budgetRange: budgetRange || null,
      },
      status: 'new',
      internalNote: null,
      createdAt: now,
      updatedAt: now,
    }

    await leadRef.set(leadData)

    console.log('New cooperation lead:', {
      id: leadRef.id,
      name,
      organization,
      cooperationType,
    })

    return {
      success: true,
      message: '表單已送出，我們將於 3-5 個工作天內與您聯繫',
    }
  } catch (error: any) {
    console.error('Cooperation API error:', error)
    setResponseStatus(event, 500)
    return { success: false, error: '系統錯誤，請稍後再試' }
  }
})
