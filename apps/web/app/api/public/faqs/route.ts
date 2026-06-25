import { NextResponse } from 'next/server';
import { db, FaqDoc, docsToArray } from '@/lib/firebase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    // Build query
    let query = db
      .collection('faqs')
      .where('isActive', '==', true)
      .orderBy('sortOrder', 'asc');

    // Note: Firestore requires composite index for multiple where clauses
    // For category filtering, we'll filter in memory for simplicity
    const faqsSnapshot = await query.get();
    let faqs = docsToArray<FaqDoc>(faqsSnapshot);

    // Filter by category if provided
    if (category) {
      faqs = faqs.filter((faq) => faq.category === category);
    }

    return NextResponse.json({
      success: true,
      data: faqs.map((faq) => ({
        id: faq.id,
        category: faq.category,
        question: faq.question,
        answer: faq.answer,
      })),
    });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch FAQs' },
      { status: 500 }
    );
  }
}
