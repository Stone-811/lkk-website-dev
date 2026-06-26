// WordPress REST API helper

const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL || 'https://wp-backend.l-kk.tw/wp-json/wp/v2';

export interface WPPost {
  id: number;
  date: string;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  link: string;
  slug: string;
  categories: number[];
  _embedded?: {
    'wp:term'?: Array<Array<{
      id: number;
      name: string;
      slug: string;
    }>>;
  };
}

export interface WPCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
}

// Category slug to display name mapping
export const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  '知識分享': '知識分享',
  '案例分享': '案例分享',
  '新聞報導': '新聞報導',
  '活動資訊': '活動資訊',
  '訓練知識': '訓練知識',
  '服務內容': '服務內容',
  '醫療衛教': '醫療衛教',
  'uncategorized': 'UNCATEGORIZED',
};

// Featured category tabs for homepage
export const FEATURED_CATEGORIES = [
  { slug: 'all', name: '最新消息' },
  { slug: '活動資訊', name: '活動資訊' },
  { slug: '新聞報導', name: '新聞報導' },
  { slug: '知識分享', name: '知識分享' },
];

/**
 * Fetch posts from WordPress
 */
export async function fetchPosts(options: {
  perPage?: number;
  page?: number;
  categorySlug?: string;
  categories?: number[];
} = {}): Promise<{ posts: WPPost[]; totalPages: number; total: number }> {
  const { perPage = 6, page = 1, categorySlug, categories } = options;

  const params = new URLSearchParams({
    per_page: perPage.toString(),
    page: page.toString(),
    _embed: 'wp:term',
    orderby: 'date',
    order: 'desc',
  });

  // If category slug is provided, first get the category ID
  if (categorySlug && categorySlug !== 'all') {
    try {
      const catRes = await fetch(`${WORDPRESS_API_URL}/categories?slug=${encodeURIComponent(categorySlug)}`, {
        next: { revalidate: 300 }, // Cache for 5 minutes
      });
      if (catRes.ok) {
        const cats = await catRes.json();
        if (cats.length > 0) {
          params.set('categories', cats[0].id.toString());
        }
      }
    } catch (error) {
      console.error('Error fetching category:', error);
    }
  }

  // If category IDs are provided directly
  if (categories && categories.length > 0) {
    params.set('categories', categories.join(','));
  }

  try {
    const res = await fetch(`${WORDPRESS_API_URL}/posts?${params.toString()}`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!res.ok) {
      console.error('WordPress API error:', res.status, res.statusText);
      return { posts: [], totalPages: 0, total: 0 };
    }

    const posts: WPPost[] = await res.json();
    const totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '1', 10);
    const total = parseInt(res.headers.get('X-WP-Total') || '0', 10);

    return { posts, totalPages, total };
  } catch (error) {
    console.error('Error fetching WordPress posts:', error);
    return { posts: [], totalPages: 0, total: 0 };
  }
}

/**
 * Get category names from embedded terms
 */
export function getCategoryNames(post: WPPost): string[] {
  if (!post._embedded?.['wp:term']) {
    return [];
  }

  const categories = post._embedded['wp:term'][0] || [];
  return categories.map(cat => cat.name);
}

/**
 * Format WordPress date to display format
 */
export function formatWPDate(dateString: string): string {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month}月${day}, ${year}`;
}

/**
 * Convert WordPress link to internal path
 * e.g., https://l-kk.tw/知識分享/article-slug/ -> /知識分享/article-slug/
 */
export function toInternalPath(wpLink: string): string {
  try {
    const url = new URL(wpLink);
    return url.pathname;
  } catch {
    // If it's already a path, return as-is
    return wpLink;
  }
}

/**
 * Decode HTML entities in title
 */
export function decodeHTMLEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ');
}
