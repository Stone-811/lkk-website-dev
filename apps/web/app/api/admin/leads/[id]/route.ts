import { NextResponse } from 'next/server';
import { db, LeadDoc, StoreDoc, docToObject, Timestamp } from '@/lib/firebase';
import { getSession } from '@/lib/auth';

// GET - Get single lead
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const leadDoc = await db.collection('leads').doc(params.id).get();
    const lead = docToObject<LeadDoc>(leadDoc);

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Get store info
    let store = null;
    if (lead.storeId) {
      const storeDoc = await db.collection('stores').doc(lead.storeId).get();
      const storeData = docToObject<StoreDoc>(storeDoc);
      if (storeData) {
        store = {
          id: storeData.id,
          name: storeData.name,
        };
      }
    }

    // Get activity logs (subcollection)
    const activitiesSnapshot = await db
      .collection('leads')
      .doc(params.id)
      .collection('activities')
      .orderBy('createdAt', 'desc')
      .get();

    const activities = activitiesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({
      success: true,
      data: { ...lead, store, activities },
    });
  } catch (error) {
    console.error('Error fetching lead:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lead' },
      { status: 500 }
    );
  }
}

// PATCH - Update lead (status, note)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { status, internalNote, addNote } = body;

    // Check if lead exists
    const leadDoc = await db.collection('leads').doc(params.id).get();
    if (!leadDoc.exists) {
      return NextResponse.json({ error: '找不到此名單' }, { status: 404 });
    }

    // Build update data
    const updateData: Record<string, unknown> = {
      updatedAt: Timestamp.now(),
    };
    if (status) updateData.status = status;
    if (internalNote !== undefined) updateData.internalNote = internalNote;

    // Update lead
    await db.collection('leads').doc(params.id).update(updateData);

    // Add activity log
    if (status || addNote) {
      await db
        .collection('leads')
        .doc(params.id)
        .collection('activities')
        .add({
          action: status ? 'status_changed' : 'note_added',
          note: addNote || (status ? `狀態變更為 ${status}` : null),
          createdBy: session.id,
          createdByName: session.name,
          createdAt: Timestamp.now(),
        });
    }

    const updatedDoc = await db.collection('leads').doc(params.id).get();
    const updatedLead = docToObject<LeadDoc>(updatedDoc);

    return NextResponse.json({ success: true, data: updatedLead });
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json(
      { error: 'Failed to update lead' },
      { status: 500 }
    );
  }
}
