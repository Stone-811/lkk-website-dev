import { db, CoachDoc, StoreDoc, docsToArray } from '~/server/utils/firebase';
import { fallbackStores, fallbackCoaches } from '~/server/utils/fallback-data';

function getAllFallbackCoaches() {
  const allCoaches: any[] = [];
  for (const [storeSlug, coaches] of Object.entries(fallbackCoaches)) {
    const store = fallbackStores.find(s => s.slug === storeSlug);
    for (const coach of coaches) {
      allCoaches.push({
        ...coach,
        storeId: storeSlug,
        store: store ? { id: store.id, name: store.name, slug: store.slug } : null,
      });
    }
  }
  return allCoaches;
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const storeSlug = query.store as string | undefined;

  try {
    let coachesQuery = db.collection('coaches').where('isActive', '==', true);

    // If filtering by store, find store first
    let storeId: string | undefined;
    if (storeSlug) {
      const storeSnapshot = await db
        .collection('stores')
        .where('slug', '==', storeSlug)
        .limit(1)
        .get();

      if (!storeSnapshot.empty) {
        storeId = storeSnapshot.docs[0].id;
        coachesQuery = coachesQuery.where('storeId', '==', storeId);
      } else {
        // Use fallback data for this store
        const coaches = fallbackCoaches[storeSlug] || [];
        const store = fallbackStores.find(s => s.slug === storeSlug);
        return {
          success: true,
          data: coaches.map(c => ({
            ...c,
            storeId: storeSlug,
            store: store ? { id: store.id, name: store.name, slug: store.slug } : null,
          })),
        };
      }
    }

    const coachesSnapshot = await coachesQuery.orderBy('sortOrder', 'asc').get();
    const coaches = docsToArray<CoachDoc>(coachesSnapshot);

    // If no coaches in Firestore, use fallback
    if (coaches.length === 0) {
      console.log('No coaches in Firestore, using fallback data');
      if (storeSlug) {
        const coachesForStore = fallbackCoaches[storeSlug] || [];
        const store = fallbackStores.find(s => s.slug === storeSlug);
        return {
          success: true,
          data: coachesForStore.map(c => ({
            ...c,
            storeId: storeSlug,
            store: store ? { id: store.id, name: store.name, slug: store.slug } : null,
          })),
        };
      }
      return {
        success: true,
        data: getAllFallbackCoaches(),
      };
    }

    // Get store info for each coach
    const storeIds = [...new Set(coaches.map(c => c.storeId).filter(Boolean))];
    const storesMap: Record<string, { id: string; name: string; slug: string }> = {};

    if (storeIds.length > 0) {
      for (const sid of storeIds) {
        if (sid) {
          const storeDoc = await db.collection('stores').doc(sid).get();
          if (storeDoc.exists) {
            const data = storeDoc.data() as StoreDoc;
            storesMap[sid] = { id: storeDoc.id, name: data.name, slug: data.slug };
          }
        }
      }
    }

    const coachesWithStore = coaches.map((coach) => ({
      id: coach.id,
      name: coach.name,
      slug: coach.slug,
      photo: coach.photo,
      roleTitle: coach.roleTitle,
      specialties: coach.specialties || [],
      certifications: coach.certifications || [],
      education: coach.education || [],
      experiences: coach.experiences || [],
      description: coach.description,
      storeId: coach.storeId,
      store: coach.storeId ? storesMap[coach.storeId] || null : null,
    }));

    return {
      success: true,
      data: coachesWithStore,
    };
  } catch (error) {
    console.error('Error fetching coaches:', error);
    // Use fallback on error
    if (storeSlug) {
      const coaches = fallbackCoaches[storeSlug] || [];
      const store = fallbackStores.find(s => s.slug === storeSlug);
      return {
        success: true,
        data: coaches.map(c => ({
          ...c,
          storeId: storeSlug,
          store: store ? { id: store.id, name: store.name, slug: store.slug } : null,
        })),
      };
    }
    return {
      success: true,
      data: getAllFallbackCoaches(),
    };
  }
});
