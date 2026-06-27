import { NextResponse } from 'next/server';
import { db, StoreDoc, CoachDoc, docToObject, docsToArray, Timestamp } from '@/lib/firebase';
import { getSession } from '@/lib/auth';

// Fallback stores data for when Firestore is empty
const fallbackStores: Record<string, any> = {
  xindian: {
    id: 'xindian',
    slug: 'xindian',
    name: '新店七張店',
    city: '新北市',
    district: '新店區',
    address: '北新路二段 252 號 B1-2',
    phone: '(02) 8914-6428',
    googleMapUrl: 'https://maps.google.com/?q=新北市新店區北新路二段252號',
    businessHours: { weekday: '09:00 – 21:00', weekend: '09:00 – 18:00' },
    transport: {
      mrt: { station: '新店七張站 1 號出口', desc: '出站後沿北新路方向直行，約步行 3 分鐘，大樓入口在便利商店旁，下樓梯至 B1-2。' },
      bus: { stop: '七張站', desc: '849、綠12、綠14、橘12 等路線均可抵達，下車後步行 2 分鐘。' },
      car: { desc: '沿北新路往新店方向，過七張路口後即可見到，大樓地下室入口在右側。' },
      parking: { desc: '七張捷運站旁有公共停車場（收費），或北新路沿線路邊停車格。地下室停車空間有限，請提前確認。' },
    },
    images: { env1: '', env2: '', env3: '', env4: '', env5: '' },
    sortOrder: 1,
    isActive: true,
  },
  nanjing: {
    id: 'nanjing',
    slug: 'nanjing',
    name: '南京店',
    city: '台北市',
    district: '中山區',
    address: '南京東路三段 29 號 B1',
    phone: '(02) 2507-4196',
    googleMapUrl: 'https://maps.google.com/?q=台北市中山區南京東路三段29號',
    businessHours: { weekday: '09:00 – 21:00', weekend: '09:00 – 18:00' },
    transport: {
      mrt: { station: '南京復興站 2 號出口', desc: '出站後沿南京東路三段方向步行約 3 分鐘。' },
      bus: { stop: '南京復興站', desc: '多條公車路線可達。' },
      car: { desc: '南京東路三段，近南京復興捷運站。' },
      parking: { desc: '附近有公共停車場，或路邊停車格。' },
    },
    images: { env1: '', env2: '', env3: '', env4: '', env5: '' },
    sortOrder: 2,
    isActive: true,
  },
  songjiang: {
    id: 'songjiang',
    slug: 'songjiang',
    name: '松江店',
    city: '台北市',
    district: '中山區',
    address: '松江路 122 號 B1',
    phone: '(02) 2537-1055',
    googleMapUrl: 'https://maps.google.com/?q=台北市中山區松江路122號',
    businessHours: { weekday: '09:00 – 21:00', weekend: '09:00 – 18:00' },
    transport: {
      mrt: { station: '松江南京站 4 號出口', desc: '出站後沿松江路方向步行約 5 分鐘。' },
      bus: { stop: '松江南京站', desc: '多條公車路線可達。' },
      car: { desc: '松江路，近松江南京捷運站。' },
      parking: { desc: '附近有公共停車場。' },
    },
    images: { env1: '', env2: '', env3: '', env4: '', env5: '' },
    sortOrder: 3,
    isActive: true,
  },
  ximending: {
    id: 'ximending',
    slug: 'ximending',
    name: '西門店',
    city: '台北市',
    district: '中正區',
    address: '寶慶路 39 號',
    phone: '(02) 2370-3245',
    googleMapUrl: 'https://maps.google.com/?q=台北市中正區寶慶路39號',
    businessHours: { weekday: '09:00 – 21:00', weekend: '09:00 – 18:00' },
    transport: {
      mrt: { station: '西門站 6 號出口', desc: '出站後沿寶慶路方向步行約 3 分鐘。' },
      bus: { stop: '西門站', desc: '多條公車路線可達。' },
      car: { desc: '寶慶路，近西門捷運站。' },
      parking: { desc: '附近有多處公共停車場。' },
    },
    images: { env1: '', env2: '', env3: '', env4: '', env5: '' },
    sortOrder: 4,
    isActive: true,
  },
};

// GET - Get single store
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const storeDoc = await db.collection('stores').doc(params.id).get();
    let store = docToObject<StoreDoc>(storeDoc);

    // If not found in Firestore, try fallback data
    if (!store && fallbackStores[params.id]) {
      store = fallbackStores[params.id];
    }

    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: store,
    });
  } catch (error) {
    console.error('Error fetching store:', error);
    // Try fallback on error
    if (fallbackStores[params.id]) {
      return NextResponse.json({
        success: true,
        data: fallbackStores[params.id],
      });
    }
    return NextResponse.json(
      { error: 'Failed to fetch store' },
      { status: 500 }
    );
  }
}

// PATCH - Update store
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Check if store exists
    const storeDoc = await db.collection('stores').doc(params.id).get();
    if (!storeDoc.exists) {
      return NextResponse.json({ error: '找不到此門店' }, { status: 404 });
    }

    // If slug is being changed, check for duplicates
    if (body.slug) {
      const existingSnapshot = await db
        .collection('stores')
        .where('slug', '==', body.slug)
        .limit(1)
        .get();

      if (!existingSnapshot.empty && existingSnapshot.docs[0].id !== params.id) {
        return NextResponse.json(
          { error: '此網址代稱已存在' },
          { status: 400 }
        );
      }
    }

    // Update store
    await db.collection('stores').doc(params.id).update({
      ...body,
      updatedAt: Timestamp.now(),
    });

    const updatedDoc = await db.collection('stores').doc(params.id).get();
    const updatedStore = docToObject<StoreDoc>(updatedDoc);

    return NextResponse.json({ success: true, data: updatedStore });
  } catch (error) {
    console.error('Error updating store:', error);
    return NextResponse.json(
      { error: 'Failed to update store' },
      { status: 500 }
    );
  }
}

// DELETE - Delete store
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if store exists
    const storeDoc = await db.collection('stores').doc(params.id).get();
    if (!storeDoc.exists) {
      return NextResponse.json({ error: '找不到此門店' }, { status: 404 });
    }

    // Check if store has coaches
    const coachesSnapshot = await db
      .collection('coaches')
      .where('storeId', '==', params.id)
      .count()
      .get();

    const coachCount = coachesSnapshot.data().count;
    if (coachCount > 0) {
      return NextResponse.json(
        { error: `此門店還有 ${coachCount} 位教練，請先移除教練後再刪除門店` },
        { status: 400 }
      );
    }

    await db.collection('stores').doc(params.id).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting store:', error);
    return NextResponse.json(
      { error: '刪除門店失敗' },
      { status: 500 }
    );
  }
}
