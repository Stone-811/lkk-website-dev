import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const year = searchParams.get('year');
    const name = searchParams.get('name');

    if (!year || !name) {
      return NextResponse.json(
        { error: '請提供年度和姓名' },
        { status: 400 }
      );
    }

    // Query Firestore for matching records
    const recordsRef = db.collection('lkk4_records');
    const snapshot = await recordsRef
      .where('year', '==', parseInt(year))
      .where('name', '==', name.trim())
      .get();

    if (snapshot.empty) {
      return NextResponse.json({ data: [] });
    }

    const records = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        year: data.year,
        name: data.name,
        competitionGroup: data.competitionGroup,
        rank: data.rank || null,
        finalScore: data.finalScore,
        teamName: data.teamName || null,
        gender: data.gender,
      };
    });

    // Sort by year descending
    records.sort((a, b) => b.year - a.year);

    return NextResponse.json({ data: records });
  } catch (error) {
    console.error('Error fetching LKK4 records:', error);
    return NextResponse.json(
      { error: '查詢失敗，請稍後再試' },
      { status: 500 }
    );
  }
}
