import { NextResponse } from 'next/server';
import { db, FaqDoc, docsToArray, Timestamp } from '@/lib/firebase';
import { getSession } from '@/lib/auth';

// GET - List all FAQs (admin)
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const faqsSnapshot = await db
      .collection('faqs')
      .orderBy('sortOrder', 'asc')
      .get();

    const faqs = docsToArray<FaqDoc>(faqsSnapshot);

    return NextResponse.json({ success: true, data: faqs });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch FAQs' },
      { status: 500 }
    );
  }
}

// POST - Create new FAQ
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !['admin', 'editor'].includes(session.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { category, question, answer, sortOrder, isActive } = body;

    if (!question || !answer) {
      return NextResponse.json(
        { error: '請填寫問題和答案' },
        { status: 400 }
      );
    }

    const now = Timestamp.now();
    const faqRef = db.collection('faqs').doc();
    const faqData = {
      category: category || null,
      question,
      answer,
      sortOrder: sortOrder || 0,
      isActive: isActive ?? true,
      createdAt: now,
      updatedAt: now,
    };

    await faqRef.set(faqData);

    return NextResponse.json({
      success: true,
      data: { id: faqRef.id, ...faqData },
    });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    return NextResponse.json(
      { error: 'Failed to create FAQ' },
      { status: 500 }
    );
  }
}
