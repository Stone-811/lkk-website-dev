import { db, docsToArray, LecturerDoc } from '~/server/utils/firebase'
import { getSession } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  try {
    const session = await getSession(event)
    if (!session) {
      throw createError({ statusCode: 401, message: '未授權' })
    }

    const query = getQuery(event)
    const type = query.type as string | undefined

    let lecturersQuery = db.collection('lecturers').orderBy('sortOrder', 'asc')

    if (type) {
      lecturersQuery = db
        .collection('lecturers')
        .where('type', '==', type)
        .orderBy('sortOrder', 'asc')
    }

    const lecturersSnapshot = await lecturersQuery.get()
    const lecturers = docsToArray<LecturerDoc>(lecturersSnapshot)

    return { success: true, data: lecturers }
  } catch (error: any) {
    console.error('Error fetching lecturers:', error)

    // Return fallback empty array
    return { success: true, data: [] }
  }
})
