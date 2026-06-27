'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import CoachCard from './CoachCard';
import { Coach } from '@/lib/fallback-coaches';

interface CoachCarouselProps {
  coaches: Coach[];
}

export default function CoachCarousel({ coaches }: CoachCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const totalItems = coaches.length + 1; // +1 for "view all" card

  // Calculate how many items fit in the viewport (approximate)
  const itemsPerPage = 3; // On mobile ~1, on desktop ~3-4, using 3 as middle ground
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const maxDots = 7; // Maximum dots to show
  const showPageDots = totalPages > maxDots;

  // Update active index on scroll
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const itemWidth = container.firstElementChild?.clientWidth || 240;
      const gap = 16; // gap-4 = 16px
      const index = Math.round(scrollLeft / (itemWidth + gap));
      setActiveIndex(Math.min(index, totalItems - 1));
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [totalItems]);

  // Scroll to specific index or page
  const scrollToIndex = (index: number) => {
    const container = scrollRef.current;
    if (!container) return;

    const itemWidth = container.firstElementChild?.clientWidth || 240;
    const gap = 16;
    container.scrollTo({
      left: index * (itemWidth + gap),
      behavior: 'smooth',
    });
  };

  // For page-based navigation (when many items)
  const scrollToPage = (page: number) => {
    scrollToIndex(page * itemsPerPage);
  };

  // Calculate active page for page-based dots
  const activePage = Math.floor(activeIndex / itemsPerPage);

  // Calculate which dots to show (sliding window for many pages)
  const getVisibleDotRange = () => {
    if (totalPages <= maxDots) {
      return { start: 0, end: totalPages };
    }

    // Sliding window centered on active page
    const halfWindow = Math.floor(maxDots / 2);
    let start = Math.max(0, activePage - halfWindow);
    let end = Math.min(totalPages, start + maxDots);

    // Adjust start if we're near the end
    if (end === totalPages) {
      start = Math.max(0, end - maxDots);
    }

    return { start, end };
  };

  const { start: dotStart, end: dotEnd } = getVisibleDotRange();

  return (
    <div className="relative -mx-4 px-4">
      {/* Carousel container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {coaches.map((coach: Coach) => (
          <CoachCard key={coach.id} coach={coach} />
        ))}

        {/* View all coaches card */}
        <Link
          href="/team-intro/coaches"
          className="flex-shrink-0 w-[200px] sm:w-[240px] bg-white/50 border-2 border-dashed border-navy-700/20 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-orange/50 hover:bg-orange/5 transition-colors snap-start"
        >
          <div className="w-12 h-12 rounded-full bg-orange/15 flex items-center justify-center">
            <svg className="w-6 h-6 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-navy-700">查看全體教練</span>
        </Link>
      </div>

      {/* Interactive scroll indicators */}
      <div className="flex justify-center items-center gap-1.5 mt-4">
        {/* Left ellipsis for many pages */}
        {showPageDots && dotStart > 0 && (
          <button
            onClick={() => scrollToPage(0)}
            className="w-2 h-2 rounded-full bg-navy-700/20 hover:bg-navy-700/40 transition-all"
            aria-label="前往第一頁"
          />
        )}
        {showPageDots && dotStart > 1 && (
          <span className="text-xs text-ink/30">...</span>
        )}

        {/* Page-based dots or item-based dots */}
        {showPageDots ? (
          // Page-based navigation for many coaches
          Array.from({ length: dotEnd - dotStart }).map((_, idx) => {
            const pageIdx = dotStart + idx;
            return (
              <button
                key={pageIdx}
                onClick={() => scrollToPage(pageIdx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  pageIdx === activePage
                    ? 'bg-orange w-4'
                    : 'bg-navy-700/20 hover:bg-navy-700/40'
                }`}
                aria-label={`前往第 ${pageIdx + 1} 頁`}
              />
            );
          })
        ) : (
          // Item-based navigation for fewer coaches
          Array.from({ length: totalItems }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === activeIndex
                  ? 'bg-orange w-4'
                  : 'bg-navy-700/20 hover:bg-navy-700/40'
              }`}
              aria-label={`前往第 ${idx + 1} 項`}
            />
          ))
        )}

        {/* Right ellipsis for many pages */}
        {showPageDots && dotEnd < totalPages - 1 && (
          <span className="text-xs text-ink/30">...</span>
        )}
        {showPageDots && dotEnd < totalPages && (
          <button
            onClick={() => scrollToPage(totalPages - 1)}
            className="w-2 h-2 rounded-full bg-navy-700/20 hover:bg-navy-700/40 transition-all"
            aria-label="前往最後一頁"
          />
        )}

        {/* Page indicator text for many coaches */}
        {showPageDots && (
          <span className="text-xs text-ink/40 ml-2">
            {activePage + 1}/{totalPages}
          </span>
        )}
      </div>
    </div>
  );
}
