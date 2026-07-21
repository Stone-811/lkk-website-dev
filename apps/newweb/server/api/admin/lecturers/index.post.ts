import { getDb, getTimestamp } from '~/server/utils/firebase'
import { getSession } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  try {
    const session = await getSession(event)
    if (!session || !['admin', 'editor'].includes(session.role)) {
      throw createError({ statusCode: 401, message: '未授權' })
    }

    const db = await getDb()
    const Timestamp = await getTimestamp()

    const body = await readBody(event)
    const {
      name,
      slug,
      photo,
      title,
      organization,
      region,
      countries,
      type,
      description,
      specialties,
      courses,
      certifications,
      sortOrder,
      isActive,
    } = body

    if (!name || !slug || !type) {
      throw createError({ statusCode: 400, message: '請填寫必填欄位（姓名、網址代稱、講師類型）' })
    }

    if (!['lkk', 'partner', 'overseas'].includes(type)) {
      throw createError({ statusCode: 400, message: '無效的講師類型' })
    }

    // Check if slug already exists
    const existingSnapshot = await db
      .collection('lecturers')
      .where('slug', '==', slug)
      .limit(1)
      .get()

    if (!existingSnapshot.empty) {
      throw createError({ statusCode: 400, message: '此網址代稱已存在' })
    }

    const now = Timestamp.now()
    const lecturerRef = db.collection('lecturers').doc()
    const lecturerData = {
      name,
      slug,
      photo: photo || null,
      title: title || null,
      organization: organization || null,
      region: region || null,
      countries: countries || [],
      type,
      description: description || null,
      specialties: specialties || [],
      courses: courses || [],
      certifications: certifications || [],
      sortOrder: sortOrder ?? 0,
      isActive: isActive ?? true,
      createdAt: now,
      updatedAt: now,
    }

    await lecturerRef.set(lecturerData)

    return {
      success: true,
      data: { id: lecturerRef.id, ...lecturerData },
    }
  } catch (error: any) {
    console.error('Error creating lecturer:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to create lecturer',
    })
  }
})
