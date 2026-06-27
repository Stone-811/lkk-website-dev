import { NextResponse } from 'next/server';
import { db, LecturerDoc, docsToArray } from '@/lib/firebase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'lkk' | 'partner' | 'overseas'

    // Build query
    let query = db
      .collection('lecturers')
      .where('isActive', '==', true)
      .orderBy('sortOrder', 'asc');

    // Filter by type if provided
    if (type && ['lkk', 'partner', 'overseas'].includes(type)) {
      query = db
        .collection('lecturers')
        .where('isActive', '==', true)
        .where('type', '==', type)
        .orderBy('sortOrder', 'asc');
    }

    const lecturersSnapshot = await query.get();
    const lecturers = docsToArray<LecturerDoc>(lecturersSnapshot);

    // Transform data for response
    const lecturersData = lecturers.map((lecturer) => ({
      id: lecturer.id,
      name: lecturer.name,
      slug: lecturer.slug,
      photo: lecturer.photo,
      title: lecturer.title,
      organization: lecturer.organization,
      region: lecturer.region,
      countries: lecturer.countries || [],
      type: lecturer.type,
      description: lecturer.description,
      specialties: lecturer.specialties || [],
      courses: lecturer.courses || [],
      certifications: lecturer.certifications || [],
    }));

    return NextResponse.json({
      success: true,
      data: lecturersData,
    });
  } catch (error) {
    console.error('Error fetching lecturers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch lecturers' },
      { status: 500 }
    );
  }
}
