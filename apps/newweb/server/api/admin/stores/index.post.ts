import { db, Timestamp } from '~/server/utils/firebase';
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

  // Only admin can create stores
  if (session.role !== 'admin') {
    throw createError({
      statusCode: 403,
      statusMessage: '權限不足',
    });
  }

  const body = await readBody(event);

  // Validate required fields
  if (!body.name || !body.slug) {
    throw createError({
      statusCode: 400,
      statusMessage: '請填寫必要欄位',
    });
  }

  try {
    // Check if slug already exists
    const existingSnapshot = await db
      .collection('stores')
      .where('slug', '==', body.slug)
      .limit(1)
      .get();

    if (!existingSnapshot.empty) {
      throw createError({
        statusCode: 400,
        statusMessage: '該網址代碼已存在',
      });
    }

    const now = Timestamp.now();
    const storeRef = db.collection('stores').doc();

    await storeRef.set({
      name: body.name,
      slug: body.slug,
      phone: body.phone || null,
      address: body.address || null,
      city: body.city || null,
      district: body.district || null,
      googleMapUrl: body.googleMapUrl || null,
      businessHours: body.businessHours || null,
      transportation: body.transportation || null,
      images: body.images || [],
      sortOrder: body.sortOrder || 0,
      isActive: body.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    });

    return {
      success: true,
      data: { id: storeRef.id },
    };
  } catch (error: any) {
    if (error.statusCode) throw error;

    console.error('Error creating store:', error);
    throw createError({
      statusCode: 500,
      statusMessage: '建立門店失敗',
    });
  }
});
