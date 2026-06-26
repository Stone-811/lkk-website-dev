import { NextResponse } from 'next/server';
import { db, Timestamp } from '@/lib/firebase';
import { getSession } from '@/lib/auth';

// Store data from static homepage
const stores = [
  {
    slug: 'nanjing',
    name: '南京店',
    city: '台北市',
    district: '中山區',
    address: '台北市中山區南京東路三段 29 號 B1',
    phone: '(02) 2507-4196',
    googleMapUrl: 'https://maps.google.com/?q=台北市中山區南京東路三段29號B1',
    businessHours: '週一至週六 09:00-21:00',
    transportation: '捷運南京復興站 步行3分鐘',
    images: [],
    sortOrder: 1,
    isActive: true,
  },
  {
    slug: 'songjiang',
    name: '松江店',
    city: '台北市',
    district: '中山區',
    address: '台北市中山區松江路 122 號 B1',
    phone: '(02) 2562-6788',
    googleMapUrl: 'https://maps.google.com/?q=台北市中山區松江路122號B1',
    businessHours: '週一至週六 09:00-21:00',
    transportation: '捷運松江南京站 步行2分鐘',
    images: [],
    sortOrder: 2,
    isActive: true,
  },
  {
    slug: 'ximending',
    name: '西門店',
    city: '台北市',
    district: '中正區',
    address: '台北市中正區寶慶路 39 號',
    phone: '(02) 2370-3245',
    googleMapUrl: 'https://maps.google.com/?q=台北市中正區寶慶路39號',
    businessHours: '週一至週六 09:00-21:00',
    transportation: '捷運西門站 步行5分鐘',
    images: [],
    sortOrder: 3,
    isActive: true,
  },
  {
    slug: 'xindian',
    name: '新店七張店',
    city: '新北市',
    district: '新店區',
    address: '新北市新店區北新路二段 252 號 B1-2',
    phone: '(02) 8914-6428',
    googleMapUrl: 'https://maps.google.com/?q=新北市新店區北新路二段252號B1-2',
    businessHours: '週一至週六 09:00-21:00',
    transportation: '捷運七張站 步行1分鐘',
    images: [],
    sortOrder: 4,
    isActive: true,
  },
];

// GET: Seed stores if collection is empty (for initial setup)
export async function GET() {
  try {
    // Check if stores already exist
    const existingStores = await db.collection('stores').limit(1).get();

    if (!existingStores.empty) {
      return NextResponse.json({
        success: true,
        message: 'Stores already exist, skipping seed',
        count: (await db.collection('stores').get()).size,
      });
    }

    // Seed stores
    const results: { slug: string; status: string; id?: string }[] = [];
    const now = Timestamp.now();

    for (const store of stores) {
      const docRef = await db.collection('stores').add({
        ...store,
        createdAt: now,
        updatedAt: now,
      });
      results.push({ slug: store.slug, status: 'created', id: docRef.id });
    }

    return NextResponse.json({
      success: true,
      message: 'Stores seeded successfully',
      results,
    });
  } catch (error) {
    console.error('Error seeding stores:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed stores' },
      { status: 500 }
    );
  }
}

// POST: Seed stores with admin auth (for manual re-seeding)
export async function POST() {
  try {
    // Verify admin authentication
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const results: { slug: string; status: string; id?: string }[] = [];
    const now = Timestamp.now();

    for (const store of stores) {
      // Check if store already exists by slug
      const existingQuery = await db
        .collection('stores')
        .where('slug', '==', store.slug)
        .limit(1)
        .get();

      if (!existingQuery.empty) {
        results.push({ slug: store.slug, status: 'skipped (already exists)' });
        continue;
      }

      // Create new store
      const docRef = await db.collection('stores').add({
        ...store,
        createdAt: now,
        updatedAt: now,
      });

      results.push({ slug: store.slug, status: 'created', id: docRef.id });
    }

    return NextResponse.json({
      success: true,
      message: 'Stores seeded successfully',
      results,
    });
  } catch (error) {
    console.error('Error seeding stores:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed stores' },
      { status: 500 }
    );
  }
}
