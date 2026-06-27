import { NextResponse } from 'next/server';
import { db, LecturerDoc, docsToArray, Timestamp } from '@/lib/firebase';
import { getSession } from '@/lib/auth';

// GET - List all lecturers (admin)
export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'lkk' | 'partner' | 'overseas'

    let query = db.collection('lecturers').orderBy('sortOrder', 'asc');

    if (type) {
      query = db
        .collection('lecturers')
        .where('type', '==', type)
        .orderBy('sortOrder', 'asc');
    }

    const lecturersSnapshot = await query.get();
    const lecturers = docsToArray<LecturerDoc>(lecturersSnapshot);

    return NextResponse.json({ success: true, data: lecturers });
  } catch (error) {
    console.error('Error fetching lecturers:', error);
    return NextResponse.json({ success: true, data: [] });
  }
}

// POST - Create new lecturer
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !['admin', 'editor'].includes(session.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      slug,
      photo,
      title,
      organization,
      region,
      countries,
      type,
      description,
      specialties,
      courses,
      certifications,
      sortOrder,
      isActive,
    } = body;

    if (!name || !slug || !type) {
      return NextResponse.json(
        { error: '請填寫必填欄位（姓名、網址代稱、講師類型）' },
        { status: 400 }
      );
    }

    // Validate type
    if (!['lkk', 'partner', 'overseas'].includes(type)) {
      return NextResponse.json(
        { error: '無效的講師類型' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingSnapshot = await db
      .collection('lecturers')
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
    const lecturerRef = db.collection('lecturers').doc();
    const lecturerData = {
      name,
      slug,
      photo: photo || null,
      title: title || null,
      organization: organization || null,
      region: region || null,
      countries: countries || [],
      type,
      description: description || null,
      specialties: specialties || [],
      courses: courses || [],
      certifications: certifications || [],
      sortOrder: sortOrder ?? 0,
      isActive: isActive ?? true,
      createdAt: now,
      updatedAt: now,
    };

    await lecturerRef.set(lecturerData);

    return NextResponse.json({
      success: true,
      data: { id: lecturerRef.id, ...lecturerData },
    });
  } catch (error) {
    console.error('Error creating lecturer:', error);
    return NextResponse.json(
      { error: 'Failed to create lecturer' },
      { status: 500 }
    );
  }
}
