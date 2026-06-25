import { NextResponse } from 'next/server';
import { db, StoreDoc, CoachDoc, docToObject, docsToArray, Timestamp } from '@/lib/firebase';
import { getSession } from '@/lib/auth';

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
    const store = docToObject<StoreDoc>(storeDoc);

    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    // Get coaches for this store
    const coachesSnapshot = await db
      .collection('coaches')
      .where('storeId', '==', params.id)
      .orderBy('sortOrder', 'asc')
      .get();

    const coaches = docsToArray<CoachDoc>(coachesSnapshot);

    return NextResponse.json({
      success: true,
      data: { ...store, coaches },
    });
  } catch (error) {
    console.error('Error fetching store:', error);
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
