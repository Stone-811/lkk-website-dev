import { NextResponse } from 'next/server';
import { db, CoachDoc, StoreDoc, docsToArray, docToObject, Timestamp } from '@/lib/firebase';
import { getSession } from '@/lib/auth';
import { fallbackCoaches } from '@/lib/fallback-coaches';

// Store info for fallback
const storeInfo: Record<string, { id: string; name: string; slug: string }> = {
  xindian: { id: 'xindian', name: '新店七張店', slug: 'xindian' },
  nanjing: { id: 'nanjing', name: '南京店', slug: 'nanjing' },
  songjiang: { id: 'songjiang', name: '松江店', slug: 'songjiang' },
  ximending: { id: 'ximending', name: '西門店', slug: 'ximending' },
};

// Get all fallback coaches with store info
function getFallbackCoachesForAdmin() {
  const allCoaches: any[] = [];
  Object.entries(fallbackCoaches).forEach(([storeSlug, coaches]) => {
    coaches.forEach((coach, index) => {
      allCoaches.push({
        id: coach.id,
        name: coach.name,
        slug: coach.id,
        photo: coach.photo,
        roleTitle: coach.roleTitle,
        storeId: storeSlug,
        specialties: coach.specialties,
        certifications: coach.certifications,
        experiences: coach.experiences,
        education: coach.education,
        sortOrder: index,
        isActive: true,
        store: storeInfo[storeSlug],
      });
    });
  });
  return allCoaches;
}

// GET - List all coaches (admin)
export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get('storeId');

    let query = db.collection('coaches').orderBy('sortOrder', 'asc');

    if (storeId) {
      query = db
        .collection('coaches')
        .where('storeId', '==', storeId)
        .orderBy('sortOrder', 'asc');
    }

    const coachesSnapshot = await query.get();
    const coaches = docsToArray<CoachDoc>(coachesSnapshot);

    // If no coaches in Firestore, use fallback
    if (coaches.length === 0) {
      console.log('No coaches in Firestore, using fallback data for admin');
      let fallbackData = getFallbackCoachesForAdmin();
      if (storeId) {
        fallbackData = fallbackData.filter((c) => c.storeId === storeId);
      }
      return NextResponse.json({ success: true, data: fallbackData });
    }

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
        return { ...coach, store };
      })
    );

    return NextResponse.json({ success: true, data: coachesWithStore });
  } catch (error) {
    console.error('Error fetching coaches:', error);
    // Use fallback on error
    return NextResponse.json({ success: true, data: getFallbackCoachesForAdmin() });
  }
}

// POST - Create new coach
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !['admin', 'editor'].includes(session.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      slug,
      photo,
      roleTitle,
      storeId,
      specialties,
      certifications,
      experiences,
      education,
      description,
      sortOrder,
      isActive,
    } = body;

    if (!name || !slug || !storeId) {
      return NextResponse.json(
        { error: '請填寫必填欄位' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingSnapshot = await db
      .collection('coaches')
      .where('slug', '==', slug)
      .limit(1)
      .get();

    if (!existingSnapshot.empty) {
      return NextResponse.json(
        { error: '此網址代稱已存在' },
        { status: 400 }
      );
    }

    const now = Timestamp.now();
    const coachRef = db.collection('coaches').doc();
    const coachData = {
      name,
      slug,
      photo: photo || null,
      roleTitle: roleTitle || null,
      storeId,
      specialties: specialties || [],
      certifications: certifications || [],
      experiences: experiences || [],
      education: education || [],
      description: description || null,
      sortOrder: sortOrder || 0,
      isActive: isActive ?? true,
      createdAt: now,
      updatedAt: now,
    };

    await coachRef.set(coachData);

    return NextResponse.json({
      success: true,
      data: { id: coachRef.id, ...coachData },
    });
  } catch (error) {
    console.error('Error creating coach:', error);
    return NextResponse.json(
      { error: 'Failed to create coach' },
      { status: 500 }
    );
  }
}
