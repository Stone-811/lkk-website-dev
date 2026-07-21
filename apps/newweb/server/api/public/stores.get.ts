import { getDb, StoreDoc, docsToArray } from '~/server/utils/firebase';
import { fallbackStores, fallbackCoaches } from '~/server/utils/fallback-data';

function getFallbackStoresWithCounts() {
  return fallbackStores.map((store) => ({
    ...store,
    googleMapUrl: null,
    businessHours: null,
    transportation: null,
    heroImage: null,
    galleryImages: [],
    coachCount: fallbackCoaches[store.slug]?.length || 0,
  }));
}

export default defineEventHandler(async () => {
  try {
    const db = await getDb();

    // Get active stores ordered by sortOrder
    const storesSnapshot = await db
      .collection('stores')
      .where('isActive', '==', true)
      .orderBy('sortOrder', 'asc')
      .get();

    const stores = docsToArray<StoreDoc>(storesSnapshot);

    // If no stores in Firestore, use fallback
    if (stores.length === 0) {
      console.log('No stores in Firestore, using fallback data for public API');
      return {
        success: true,
        data: getFallbackStoresWithCounts(),
      };
    }

    // Get coach counts for each store
    const storesWithCounts = await Promise.all(
      stores.map(async (store) => {
        const coachesSnapshot = await db
          .collection('coaches')
          .where('storeId', '==', store.id)
          .where('isActive', '==', true)
          .count()
          .get();

        return {
          id: store.id,
          name: store.name,
          slug: store.slug,
          city: store.city,
          district: store.district,
          address: store.address,
          phone: store.phone,
          googleMapUrl: store.googleMapUrl,
          businessHours: store.businessHours,
          transportation: store.transportation,
          heroImage: store.images?.[0] || null,
          galleryImages: store.images || [],
          coachCount: coachesSnapshot.data().count,
        };
      })
    );

    return {
      success: true,
      data: storesWithCounts,
    };
  } catch (error) {
    console.error('Error fetching stores:', error);
    // Use fallback on error
    return {
      success: true,
      data: getFallbackStoresWithCounts(),
    };
  }
});
