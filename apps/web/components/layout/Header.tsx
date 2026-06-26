'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const t = useTranslations('nav');
  const tCta = useTranslations('cta');
  const locale = useLocale();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: t('home'), href: '/' },
    { name: t('services'), href: '/services' },
    { name: t('team'), href: '/team' },
    { name: t('locations'), href: '/locations' },
    { name: t('articles'), href: '/category/knowledge', external: true },
    { name: 'LKK4', href: '/lkk4' },
    { name: '異業結盟', href: '/cooperation' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === `/${locale}` || pathname === '/';
    }
    return pathname.startsWith(`/${locale}${href}`) || pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-navy-700 shadow-lg">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white font-serif">練健康</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) =>
              item.external ? (
                <a
                  key={item.name}
                  href={`https://l-kk.tw${item.href}`}
                  className="text-cream-100 hover:text-orange transition-colors"
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`transition-colors ${
                    isActive(item.href)
                      ? 'text-orange font-medium'
                      : 'text-cream-100 hover:text-orange'
                  }`}
                >
                  {item.name}
                </Link>
              )
            )}
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />
            <Link href="/booking" className="btn btn-primary">
              {tCta('booking')}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 text-cream-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-navy-600">
            <div className="flex flex-col gap-4">
              {navigation.map((item) =>
                item.external ? (
                  <a
                    key={item.name}
                    href={`https://l-kk.tw${item.href}`}
                    className="text-cream-100 hover:text-orange py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`py-2 ${
                      isActive(item.href)
                        ? 'text-orange font-medium'
                        : 'text-cream-100'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )
              )}
              <div className="pt-4 border-t border-navy-600 flex items-center justify-between">
                <LanguageSwitcher />
                <Link
                  href="/booking"
                  className="btn btn-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {tCta('booking')}
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
