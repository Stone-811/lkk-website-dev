import { NextResponse } from 'next/server';
import { db, StoreDoc, docsToArray, Timestamp } from '@/lib/firebase';
import { getSession } from '@/lib/auth';

// Fallback stores data for development
const fallbackStores = [
  {
    id: 'xindian',
    slug: 'xindian',
    name: '新店七張店',
    city: '新北市',
    district: '新店區',
    address: '北新路二段 252 號 B1-2',
    phone: '(02) 8914-6428',
    sortOrder: 1,
    isActive: true,
  },
  {
    id: 'nanjing',
    slug: 'nanjing',
    name: '南京店',
    city: '台北市',
    district: '中山區',
    address: '南京東路三段 29 號 B1',
    phone: '(02) 2507-4196',
    sortOrder: 2,
    isActive: true,
  },
  {
    id: 'songjiang',
    slug: 'songjiang',
    name: '松江店',
    city: '台北市',
    district: '中山區',
    address: '松江路 122 號 B1',
    phone: '(02) 2537-1055',
    sortOrder: 3,
    isActive: true,
  },
  {
    id: 'ximending',
    slug: 'ximending',
    name: '西門店',
    city: '台北市',
    district: '中正區',
    address: '寶慶路 39 號',
    phone: '(02) 2370-3245',
    sortOrder: 4,
    isActive: true,
  },
];

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

    // If no stores in Firestore, use fallback
    if (stores.length === 0) {
      console.log('No stores in Firestore, using fallback data for admin');
      return NextResponse.json({
        success: true,
        data: fallbackStores,
      });
    }

    return NextResponse.json({
      success: true,
      data: stores,
    });
  } catch (error) {
    console.error('Error fetching stores:', error);
    // Use fallback on error
    return NextResponse.json({
      success: true,
      data: fallbackStores,
    });
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
