'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  WPPost,
  FEATURED_CATEGORIES,
  getCategoryNames,
  formatWPDate,
  toInternalPath,
  decodeHTMLEntities,
} from '@/lib/wordpress';

interface ArticlesSectionProps {
  initialPosts?: WPPost[];
}

export default function ArticlesSection({ initialPosts = [] }: ArticlesSectionProps) {
  const [activeTab, setActiveTab] = useState('all');
  const [posts, setPosts] = useState<WPPost[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch posts when tab changes
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const categoryParam = activeTab !== 'all' ? `&category=${encodeURIComponent(activeTab)}` : '';
        const res = await fetch(`/api/public/articles?per_page=6&page=1${categoryParam}`);
        if (res.ok) {
          const data = await res.json();
          setPosts(data.posts || []);
          setHasMore(data.totalPages > 1);
          setPage(1);
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [activeTab]);

  const handleNextPage = async () => {
    const nextPage = page + 1;
    setLoading(true);
    try {
      const categoryParam = activeTab !== 'all' ? `&category=${encodeURIComponent(activeTab)}` : '';
      const res = await fetch(`/api/public/articles?per_page=6&page=${nextPage}${categoryParam}`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
        setHasMore(data.totalPages > nextPage);
        setPage(nextPage);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevPage = async () => {
    if (page <= 1) return;
    const prevPage = page - 1;
    setLoading(true);
    try {
      const categoryParam = activeTab !== 'all' ? `&category=${encodeURIComponent(activeTab)}` : '';
      const res = await fetch(`/api/public/articles?per_page=6&page=${prevPage}${categoryParam}`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
        setHasMore(data.totalPages > prevPage);
        setPage(prevPage);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="container mx-auto px-4">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-0 mb-8">
          {FEATURED_CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveTab(cat.slug)}
              className={`px-6 py-3 text-sm font-bold transition-colors ${
                activeTab === cat.slug
                  ? 'bg-orange text-white'
                  : 'bg-navy-700 text-white hover:bg-navy-600'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Articles List */}
        <div className="divide-y divide-gray-200">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="py-6 animate-pulse">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-24" />
                </div>
              </div>
            ))
          ) : posts.length === 0 ? (
            <div className="py-12 text-center text-ink/50">
              目前沒有文章
            </div>
          ) : (
            posts.map((post) => {
              const categories = getCategoryNames(post);
              const categoryDisplay = categories.length > 0
                ? categories.join(', ')
                : 'UNCATEGORIZED';

              return (
                <article key={post.id} className="py-6 group">
                  <Link
                    href={toInternalPath(post.link)}
                    className="flex items-start justify-between gap-4 hover:opacity-80 transition-opacity"
                  >
                    <div className="flex-1">
                      {/* Category */}
                      <div className="flex items-center gap-1.5 text-sm text-ink/50 mb-2">
                        <span className="text-orange">*</span>
                        <span className="uppercase tracking-wide">{categoryDisplay}</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-navy-700 group-hover:text-orange transition-colors">
                        {decodeHTMLEntities(post.title.rendered)}
                      </h3>
                    </div>

                    {/* Date */}
                    <time className="text-sm text-ink/40 whitespace-nowrap flex-shrink-0">
                      {formatWPDate(post.date)}
                    </time>
                  </Link>
                </article>
              );
            })
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-8 pt-4">
          {page > 1 ? (
            <button
              onClick={handlePrevPage}
              disabled={loading}
              className="text-orange font-bold text-sm hover:opacity-80 transition-opacity disabled:opacity-50"
            >
              &larr; PREV
            </button>
          ) : (
            <div />
          )}

          {hasMore && (
            <button
              onClick={handleNextPage}
              disabled={loading}
              className="text-orange font-bold text-sm hover:opacity-80 transition-opacity disabled:opacity-50"
            >
              NEXT &rarr;
            </button>
          )}
        </div>

        {/* View All Link */}
        <div className="text-center mt-8">
          <Link
            href="/知識分享/"
            className="inline-flex items-center gap-2 text-navy-700 hover:text-orange transition-colors font-medium"
          >
            查看所有文章
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
