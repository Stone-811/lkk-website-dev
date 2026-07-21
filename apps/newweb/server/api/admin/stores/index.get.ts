import { getDb, StoreDoc, docsToArray } from '~/server/utils/firebase';
import { getSession } from '~/server/utils/auth';
import { fallbackStores, fallbackCoaches } from '~/server/utils/fallback-data';

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
    const storesSnapshot = await db
      .collection('stores')
      .orderBy('sortOrder', 'asc')
      .get();

    const stores = docsToArray<StoreDoc>(storesSnapshot);

    // If no stores in Firestore, use fallback
    if (stores.length === 0) {
      console.log('No stores in Firestore, using fallback data for admin');
      return {
        success: true,
        data: fallbackStores.map(store => ({
          ...store,
          isActive: true,
          sortOrder: 0,
          googleMapUrl: null,
          businessHours: null,
          transportation: null,
          images: [],
          coachCount: fallbackCoaches[store.slug]?.length || 0,
        })),
      };
    }

    // Get coach counts
    const storesWithCounts = await Promise.all(
      stores.map(async (store) => {
        const coachesSnapshot = await db
          .collection('coaches')
          .where('storeId', '==', store.id)
          .count()
          .get();

        return {
          ...store,
          coachCount: coachesSnapshot.data().count,
        };
      })
    );

    return {
      success: true,
      data: storesWithCounts,
    };
  } catch (error) {
    console.error('Error fetching stores for admin:', error);
    // Use fallback on error
    return {
      success: true,
      data: fallbackStores.map(store => ({
        ...store,
        isActive: true,
        sortOrder: 0,
        googleMapUrl: null,
        businessHours: null,
        transportation: null,
        images: [],
        coachCount: fallbackCoaches[store.slug]?.length || 0,
      })),
    };
  }
});
