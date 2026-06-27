import { NextResponse } from 'next/server';
import { db, StoreDoc, docsToArray } from '@/lib/firebase';
import { fallbackCoaches } from '@/lib/fallback-coaches';

// Fallback stores data
const fallbackStores = [
  {
    id: 'xindian',
    slug: 'xindian',
    name: '新店七張店',
    city: '新北市',
    district: '新店區',
    address: '北新路二段 252 號 B1-2',
    phone: '(02) 8914-6428',
  },
  {
    id: 'nanjing',
    slug: 'nanjing',
    name: '南京店',
    city: '台北市',
    district: '中山區',
    address: '南京東路三段 29 號 B1',
    phone: '(02) 2507-4196',
  },
  {
    id: 'songjiang',
    slug: 'songjiang',
    name: '松江店',
    city: '台北市',
    district: '中山區',
    address: '松江路 122 號 B1',
    phone: '(02) 2537-1055',
  },
  {
    id: 'ximending',
    slug: 'ximending',
    name: '西門店',
    city: '台北市',
    district: '中正區',
    address: '寶慶路 39 號',
    phone: '(02) 2370-3245',
  },
];

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

export async function GET() {
  try {
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
      return NextResponse.json({
        success: true,
        data: getFallbackStoresWithCounts(),
      });
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

    return NextResponse.json({
      success: true,
      data: storesWithCounts,
    });
  } catch (error) {
    console.error('Error fetching stores:', error);
    // Use fallback on error
    return NextResponse.json({
      success: true,
      data: getFallbackStoresWithCounts(),
    });
  }
}
