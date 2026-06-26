import { NextRequest, NextResponse } from 'next/server';
import { fetchPosts } from '@/lib/wordpress';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const perPage = parseInt(searchParams.get('per_page') || '6', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const category = searchParams.get('category') || undefined;

    const { posts, totalPages, total } = await fetchPosts({
      perPage,
      page,
      categorySlug: category,
    });

    return NextResponse.json({
      success: true,
      posts,
      totalPages,
      total,
      page,
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch articles', posts: [] },
      { status: 500 }
    );
  }
}
