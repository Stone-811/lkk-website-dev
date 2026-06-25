import { NextResponse } from 'next/server';
import { db, CoachDoc, StoreDoc, docsToArray, docToObject } from '@/lib/firebase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const storeSlug = searchParams.get('store');

    let storeId: string | null = null;

    // If store slug is provided, find the store ID
    if (storeSlug) {
      const storeSnapshot = await db
        .collection('stores')
        .where('slug', '==', storeSlug)
        .limit(1)
        .get();

      if (!storeSnapshot.empty) {
        storeId = storeSnapshot.docs[0].id;
      }
    }

    // Build query
    let query = db
      .collection('coaches')
      .where('isActive', '==', true)
      .orderBy('sortOrder', 'asc');

    if (storeId) {
      query = db
        .collection('coaches')
        .where('isActive', '==', true)
        .where('storeId', '==', storeId)
        .orderBy('sortOrder', 'asc');
    }

    const coachesSnapshot = await query.get();
    const coaches = docsToArray<CoachDoc>(coachesSnapshot);

    // Get store info for each coach
    const coachesWithStore = await Promise.all(
      coaches.map(async (coach) => {
        let store = null;
        if (coach.storeId) {
          const storeDoc = await db.collection('stores').doc(coach.storeId).get();
          const storeData = docToObject<StoreDoc>(storeDoc);
          if (storeData) {
            store = {
              id: storeData.id,
              name: storeData.name,
              slug: storeData.slug,
            };
          }
        }

        return {
          id: coach.id,
          name: coach.name,
          slug: coach.slug,
          photo: coach.photo,
          roleTitle: coach.roleTitle,
          specialties: coach.specialties || [],
          certifications: coach.certifications || [],
          experiences: coach.experiences || [],
          education: coach.education || [],
          description: coach.description,
          store,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: coachesWithStore,
    });
  } catch (error) {
    console.error('Error fetching coaches:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch coaches' },
      { status: 500 }
    );
  }
}
