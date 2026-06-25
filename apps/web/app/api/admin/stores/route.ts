import { NextResponse } from 'next/server';
import { db, StoreDoc, docsToArray, Timestamp } from '@/lib/firebase';
import { getSession } from '@/lib/auth';

// GET - List all stores (admin)
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const storesSnapshot = await db
      .collection('stores')
      .orderBy('sortOrder', 'asc')
      .get();

    const stores = docsToArray<StoreDoc>(storesSnapshot);

    // Get coach counts for each store
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

// POST - Create new store
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      slug,
      city,
      district,
      address,
      phone,
      googleMapUrl,
      businessHours,
      transportation,
      images,
      sortOrder,
      isActive,
    } = body;

    if (!name || !slug || !city || !district || !address) {
      return NextResponse.json(
        { error: '請填寫必填欄位' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingSnapshot = await db
      .collection('stores')
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
    const storeRef = db.collection('stores').doc();
    const storeData = {
      name,
      slug,
      city,
      district,
      address,
      phone: phone || null,
      googleMapUrl: googleMapUrl || null,
      businessHours: businessHours || null,
      transportation: transportation || null,
      images: images || [],
      sortOrder: sortOrder || 0,
      isActive: isActive ?? true,
      createdAt: now,
      updatedAt: now,
    };

    await storeRef.set(storeData);

    return NextResponse.json({
      success: true,
      data: { id: storeRef.id, ...storeData },
    });
  } catch (error) {
    console.error('Error creating store:', error);
    return NextResponse.json(
      { error: 'Failed to create store' },
      { status: 500 }
    );
  }
}
