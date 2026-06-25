import { NextResponse } from 'next/server';
import { db, FaqDoc, docToObject, Timestamp } from '@/lib/firebase';
import { getSession } from '@/lib/auth';

// PATCH - Update FAQ
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

    // Check if FAQ exists
    const faqDoc = await db.collection('faqs').doc(params.id).get();
    if (!faqDoc.exists) {
      return NextResponse.json({ error: '找不到此 FAQ' }, { status: 404 });
    }

    // Update FAQ
    await db.collection('faqs').doc(params.id).update({
      ...body,
      updatedAt: Timestamp.now(),
    });

    const updatedDoc = await db.collection('faqs').doc(params.id).get();
    const updatedFaq = docToObject<FaqDoc>(updatedDoc);

    return NextResponse.json({ success: true, data: updatedFaq });
  } catch (error) {
    console.error('Error updating FAQ:', error);
    return NextResponse.json(
      { error: 'Failed to update FAQ' },
      { status: 500 }
    );
  }
}

// DELETE - Delete FAQ
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || !['admin', 'editor'].includes(session.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if FAQ exists
    const faqDoc = await db.collection('faqs').doc(params.id).get();
    if (!faqDoc.exists) {
      return NextResponse.json({ error: '找不到此 FAQ' }, { status: 404 });
    }

    await db.collection('faqs').doc(params.id).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    return NextResponse.json(
      { error: '刪除 FAQ 失敗' },
      { status: 500 }
    );
  }
}
