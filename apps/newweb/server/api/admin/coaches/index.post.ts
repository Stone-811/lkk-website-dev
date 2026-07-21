import { getDb, getTimestamp } from '~/server/utils/firebase';
import { getSession } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
  // Check authentication
  const session = await getSession(event);
  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: '未登入',
    });
  }

  const body = await readBody(event);

  // Validate required fields
  if (!body.name) {
    throw createError({
      statusCode: 400,
      statusMessage: '請填寫教練姓名',
    });
  }

  try {
    const db = await getDb();
    const Timestamp = await getTimestamp();

    const now = Timestamp.now();
    const coachRef = db.collection('coaches').doc();

    // Generate slug from name if not provided
    const slug = body.slug || body.name.toLowerCase().replace(/\s+/g, '-');

    await coachRef.set({
      name: body.name,
      slug,
      photo: body.photo || null,
      roleTitle: body.roleTitle || null,
      storeId: body.storeId || null,
      specialties: body.specialties || [],
      certifications: body.certifications || [],
      experiences: body.experiences || [],
      education: body.education || [],
      description: body.description || null,
      sortOrder: body.sortOrder || 0,
      isActive: body.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    });

    return {
      success: true,
      data: { id: coachRef.id },
    };
  } catch (error: any) {
    if (error.statusCode) throw error;

    console.error('Error creating coach:', error);
    throw createError({
      statusCode: 500,
      statusMessage: '建立教練失敗',
    });
  }
});
