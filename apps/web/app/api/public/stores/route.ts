import { NextResponse } from 'next/server';
import { db, StoreDoc, docsToArray } from '@/lib/firebase';

export async function GET() {
  try {
    // Get active stores ordered by sortOrder
    const storesSnapshot = await db
      .collection('stores')
      .where('isActive', '==', true)
      .orderBy('sortOrder', 'asc')
      .get();

    const stores = docsToArray<StoreDoc>(storesSnapshot);

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
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stores' },
      { status: 500 }
    );
  }
}
