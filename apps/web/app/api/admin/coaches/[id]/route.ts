import { NextResponse } from 'next/server';
import { db, CoachDoc, StoreDoc, docToObject, Timestamp } from '@/lib/firebase';
import { getSession } from '@/lib/auth';

// GET - Get single coach
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const coachDoc = await db.collection('coaches').doc(params.id).get();
    const coach = docToObject<CoachDoc>(coachDoc);

    if (!coach) {
      return NextResponse.json({ error: 'Coach not found' }, { status: 404 });
    }

    // Get store info
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

    return NextResponse.json({
      success: true,
      data: { ...coach, store },
    });
  } catch (error) {
    console.error('Error fetching coach:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coach' },
      { status: 500 }
    );
  }
}

// PATCH - Update coach
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || !['admin', 'editor'].includes(session.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Check if coach exists
    const coachDoc = await db.collection('coaches').doc(params.id).get();
    if (!coachDoc.exists) {
      return NextResponse.json({ error: '找不到此教練' }, { status: 404 });
    }

    // If slug is being changed, check for duplicates
    if (body.slug) {
      const existingSnapshot = await db
        .collection('coaches')
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

    // Update coach
    await db.collection('coaches').doc(params.id).update({
      ...body,
      updatedAt: Timestamp.now(),
    });

    const updatedDoc = await db.collection('coaches').doc(params.id).get();
    const updatedCoach = docToObject<CoachDoc>(updatedDoc);

    return NextResponse.json({ success: true, data: updatedCoach });
  } catch (error) {
    console.error('Error updating coach:', error);
    return NextResponse.json(
      { error: 'Failed to update coach' },
      { status: 500 }
    );
  }
}

// DELETE - Delete coach
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if coach exists
    const coachDoc = await db.collection('coaches').doc(params.id).get();
    if (!coachDoc.exists) {
      return NextResponse.json({ error: '找不到此教練' }, { status: 404 });
    }

    await db.collection('coaches').doc(params.id).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting coach:', error);
    return NextResponse.json(
      { error: '刪除教練失敗' },
      { status: 500 }
    );
  }
}
