import { db, LeadDoc, docsToArray } from '~/server/utils/firebase';
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

  const query = getQuery(event);
  const type = query.type as string | undefined;
  const status = query.status as string | undefined;

  try {
    let leadsQuery = db.collection('leads').orderBy('createdAt', 'desc');

    // Build query based on filters
    // Note: Firestore doesn't support multiple inequality filters
    // So we fetch all and filter in memory for now
    const leadsSnapshot = await leadsQuery.limit(100).get();
    let leads = docsToArray<LeadDoc>(leadsSnapshot);

    // Apply filters
    if (type) {
      leads = leads.filter(lead => lead.type === type);
    }
    if (status) {
      leads = leads.filter(lead => lead.status === status);
    }

    // Store staff can only see leads for their store
    if (session.role === 'store_staff' && session.storeId) {
      leads = leads.filter(lead => lead.storeId === session.storeId);
    }

    return {
      success: true,
      data: leads.map(lead => ({
        ...lead,
        // Convert Timestamp to ISO string for JSON
        createdAt: lead.createdAt?.toDate?.()?.toISOString() || null,
        updatedAt: lead.updatedAt?.toDate?.()?.toISOString() || null,
      })),
    };
  } catch (error) {
    console.error('Error fetching leads:', error);
    throw createError({
      statusCode: 500,
      statusMessage: '取得名單失敗',
    });
  }
});
