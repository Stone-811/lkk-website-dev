import { NextResponse } from 'next/server';
import { db, LeadDoc, StoreDoc, docsToArray, docToObject } from '@/lib/firebase';
import { getSession } from '@/lib/auth';

// GET - List all leads (admin)
export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const storeId = searchParams.get('storeId');

    // Build query - start with ordering
    let query: FirebaseFirestore.Query = db
      .collection('leads')
      .orderBy('createdAt', 'desc');

    // Get all leads first, then filter in memory
    // (Firestore has limitations on compound queries)
    const leadsSnapshot = await query.get();
    let leads = docsToArray<LeadDoc>(leadsSnapshot);

    // Filter by type
    if (type) {
      leads = leads.filter((lead) => lead.type === type);
    }

    // Filter by status
    if (status) {
      leads = leads.filter((lead) => lead.status === status);
    }

    // Filter by store (for store staff, they can only see their store's leads)
    const filterStoreId = session.role === 'store_staff' ? session.storeId : storeId;
    if (filterStoreId) {
      leads = leads.filter((lead) => lead.storeId === filterStoreId);
    }

    // Get store info for each lead and convert timestamps
    const leadsWithStore = await Promise.all(
      leads.map(async (lead) => {
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
        // Convert Firestore Timestamps to ISO strings
        const createdAt = lead.createdAt?.toDate?.()
          ? lead.createdAt.toDate().toISOString()
          : lead.createdAt;
        const updatedAt = lead.updatedAt?.toDate?.()
          ? lead.updatedAt.toDate().toISOString()
          : lead.updatedAt;

        return { ...lead, store, createdAt, updatedAt };
      })
    );

    return NextResponse.json({ success: true, data: leadsWithStore });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}
