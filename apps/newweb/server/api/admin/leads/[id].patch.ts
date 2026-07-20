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

  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: '請提供名單 ID',
    });
  }

  const body = await readBody(event);

  try {
    const leadRef = db.collection('leads').doc(id);
    const leadDoc = await leadRef.get();

    if (!leadDoc.exists) {
      throw createError({
        statusCode: 404,
        statusMessage: '名單不存在',
      });
    }

    const updateData: Record<string, any> = {
      updatedAt: Timestamp.now(),
    };

    // Only allow updating status and internalNote
    if (body.status !== undefined) {
      const validStatuses = ['new', 'contacted', 'scheduled', 'completed', 'cancelled'];
      if (!validStatuses.includes(body.status)) {
        throw createError({
          statusCode: 400,
          statusMessage: '無效的狀態',
        });
      }
      updateData.status = body.status;
    }

    if (body.internalNote !== undefined) {
      updateData.internalNote = body.internalNote;
    }

    await leadRef.update(updateData);

    return {
      success: true,
    };
  } catch (error: any) {
    if (error.statusCode) throw error;

    console.error('Error updating lead:', error);
    throw createError({
      statusCode: 500,
      statusMessage: '更新名單失敗',
    });
  }
});
