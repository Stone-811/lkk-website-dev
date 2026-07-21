import { getDb, LecturerDoc, docsToArray } from '~/server/utils/firebase'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const type = query.type as string | undefined

  try {
    const db = await getDb()

    let lecturersQuery = db
      .collection('lecturers')
      .where('isActive', '==', true)
      .orderBy('sortOrder', 'asc')

    if (type && ['lkk', 'partner', 'overseas'].includes(type)) {
      lecturersQuery = db
        .collection('lecturers')
        .where('type', '==', type)
        .where('isActive', '==', true)
        .orderBy('sortOrder', 'asc')
    }

    const lecturersSnapshot = await lecturersQuery.get()
    const lecturers = docsToArray<LecturerDoc>(lecturersSnapshot)

    const lecturersData = lecturers.map((lecturer) => ({
      id: lecturer.id,
      name: lecturer.name,
      slug: lecturer.slug,
      photo: lecturer.photo,
      title: lecturer.title,
      organization: lecturer.organization,
      region: lecturer.region,
      countries: lecturer.countries || [],
      type: lecturer.type,
      description: lecturer.description,
      specialties: lecturer.specialties || [],
      courses: lecturer.courses || [],
      certifications: lecturer.certifications || [],
    }))

    return {
      success: true,
      data: lecturersData,
    }
  } catch (error) {
    console.error('Error fetching lecturers:', error)
    return {
      success: true,
      data: [],
    }
  }
})
