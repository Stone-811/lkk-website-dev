import { getDb, CoachDoc, StoreDoc, docsToArray } from '~/server/utils/firebase';
import { getSession } from '~/server/utils/auth';
import { fallbackStores, fallbackCoaches } from '~/server/utils/fallback-data';

function getAllFallbackCoaches() {
  const allCoaches: any[] = [];
  for (const [storeSlug, coaches] of Object.entries(fallbackCoaches)) {
    const store = fallbackStores.find(s => s.slug === storeSlug);
    for (const coach of coaches) {
      allCoaches.push({
        ...coach,
        isActive: true,
        sortOrder: 0,
        storeId: storeSlug,
        store: store ? { id: store.id, name: store.name, slug: store.slug } : null,
      });
    }
  }
  return allCoaches;
}

export default defineEventHandler(async (event) => {
  // Check authentication
  const session = await getSession(event);
  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: '未登入',
    });
  }

  try {
    const db = await getDb();
    const coachesSnapshot = await db
      .collection('coaches')
      .orderBy('sortOrder', 'asc')
      .get();

    const coaches = docsToArray<CoachDoc>(coachesSnapshot);

    // If no coaches in Firestore, use fallback
    if (coaches.length === 0) {
      console.log('No coaches in Firestore, using fallback data for admin');
      return {
        success: true,
        data: getAllFallbackCoaches(),
      };
    }

    // Get store info for each coach
    const storeIds = [...new Set(coaches.map(c => c.storeId).filter(Boolean))];
    const storesMap: Record<string, { id: string; name: string; slug: string }> = {};

    for (const storeId of storeIds) {
      if (storeId) {
        const storeDoc = await db.collection('stores').doc(storeId).get();
        if (storeDoc.exists) {
          const data = storeDoc.data() as StoreDoc;
          storesMap[storeId] = { id: storeDoc.id, name: data.name, slug: data.slug };
        }
      }
    }

    const coachesWithStore = coaches.map((coach) => ({
      ...coach,
      store: coach.storeId ? storesMap[coach.storeId] || null : null,
    }));

    return {
      success: true,
      data: coachesWithStore,
    };
  } catch (error) {
    console.error('Error fetching coaches for admin:', error);
    return {
      success: true,
      data: getAllFallbackCoaches(),
    };
  }
});
