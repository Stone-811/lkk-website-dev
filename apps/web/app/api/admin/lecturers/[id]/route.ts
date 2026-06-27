import { NextResponse } from 'next/server';
import { db, LecturerDoc, docToObject, Timestamp } from '@/lib/firebase';
import { getSession } from '@/lib/auth';

// GET - Get single lecturer
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const lecturerDoc = await db.collection('lecturers').doc(params.id).get();
    const lecturer = docToObject<LecturerDoc>(lecturerDoc);

    if (!lecturer) {
      return NextResponse.json({ error: 'Lecturer not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: lecturer });
  } catch (error) {
    console.error('Error fetching lecturer:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lecturer' },
      { status: 500 }
    );
  }
}

// PATCH - Update lecturer
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
    const lecturerRef = db.collection('lecturers').doc(params.id);
    const lecturerDoc = await lecturerRef.get();

    if (!lecturerDoc.exists) {
      return NextResponse.json({ error: 'Lecturer not found' }, { status: 404 });
    }

    // If slug is being changed, check for duplicates
    if (body.slug) {
      const existingSnapshot = await db
        .collection('lecturers')
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

    // Validate type if provided
    if (body.type && !['lkk', 'partner', 'overseas'].includes(body.type)) {
      return NextResponse.json(
        { error: '無效的講師類型' },
        { status: 400 }
      );
    }

    const updateData = {
      ...body,
      updatedAt: Timestamp.now(),
    };

    await lecturerRef.update(updateData);

    const updatedDoc = await lecturerRef.get();
    const updatedLecturer = docToObject<LecturerDoc>(updatedDoc);

    return NextResponse.json({ success: true, data: updatedLecturer });
  } catch (error) {
    console.error('Error updating lecturer:', error);
    return NextResponse.json(
      { error: 'Failed to update lecturer' },
      { status: 500 }
    );
  }
}

// DELETE - Delete lecturer
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const lecturerRef = db.collection('lecturers').doc(params.id);
    const lecturerDoc = await lecturerRef.get();

    if (!lecturerDoc.exists) {
      return NextResponse.json({ error: 'Lecturer not found' }, { status: 404 });
    }

    await lecturerRef.delete();

    return NextResponse.json({ success: true, message: 'Lecturer deleted' });
  } catch (error) {
    console.error('Error deleting lecturer:', error);
    return NextResponse.json(
      { error: 'Failed to delete lecturer' },
      { status: 500 }
    );
  }
}
