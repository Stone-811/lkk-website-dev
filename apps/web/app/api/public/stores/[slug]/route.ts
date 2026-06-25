import { NextResponse } from 'next/server';
import { db, StoreDoc, CoachDoc, docsToArray } from '@/lib/firebase';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    // Find store by slug
    const storeSnapshot = await db
      .collection('stores')
      .where('slug', '==', params.slug)
      .where('isActive', '==', true)
      .limit(1)
      .get();

    if (storeSnapshot.empty) {
      return NextResponse.json(
        { success: false, error: 'Store not found' },
        { status: 404 }
      );
    }

    const storeDoc = storeSnapshot.docs[0];
    const storeData = storeDoc.data() as StoreDoc;

    // Get coaches for this store
    const coachesSnapshot = await db
      .collection('coaches')
      .where('storeId', '==', storeDoc.id)
      .where('isActive', '==', true)
      .orderBy('sortOrder', 'asc')
      .get();

    const coaches = docsToArray<CoachDoc>(coachesSnapshot).map((coach) => ({
      id: coach.id,
      name: coach.name,
      slug: coach.slug,
      photo: coach.photo,
      roleTitle: coach.roleTitle,
      specialties: coach.specialties || [],
      certifications: coach.certifications || [],
      description: coach.description,
    }));

    return NextResponse.json({
      success: true,
      data: {
        id: storeDoc.id,
        name: storeData.name,
        slug: storeData.slug,
        city: storeData.city,
        district: storeData.district,
        address: storeData.address,
        phone: storeData.phone,
        googleMapUrl: storeData.googleMapUrl,
        businessHours: storeData.businessHours,
        transportation: storeData.transportation,
        heroImage: storeData.images?.[0] || null,
        galleryImages: storeData.images || [],
        coaches,
      },
    });
  } catch (error) {
    console.error('Error fetching store:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch store' },
      { status: 500 }
    );
  }
}
