import { NextResponse } from 'next/server';
import { db, CoachDoc, StoreDoc, docsToArray, docToObject, Timestamp } from '@/lib/firebase';
import { getSession } from '@/lib/auth';

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
    return NextResponse.json(
      { error: 'Failed to fetch coaches' },
      { status: 500 }
    );
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
