'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import LanguageSwitcher from './LanguageSwitcher';

// 門店資料
const stores = [
  { id: 'nanjing', name: '南京店' },
  { id: 'songjiang', name: '松江店' },
  { id: 'ximending', name: '西門店' },
  { id: 'xindian', name: '新店七張店' },
];

// 團隊介紹子選單
const teamSubMenu = [
  { name: '經營團隊', href: '/team-intro' },
  { name: '教練團隊', href: '/team-intro/coaches' },
  { name: '練健康講師', href: '/lkk-lecturer' },
  { name: '合作講師', href: '/co-lecturer' },
  { name: '海外授權講師', href: '/oversea-lecturer' },
];

export default function Header() {
  const t = useTranslations('nav');
  const tCta = useTranslations('cta');
  const locale = useLocale();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 點擊外部關閉下拉選單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === `/${locale}` || pathname === '/';
    }
    return pathname.startsWith(`/${locale}${href}`) || pathname.startsWith(href);
  };

  const toggleDropdown = (key: string) => {
    setOpenDropdown(openDropdown === key ? null : key);
  };

  const toggleMobileDropdown = (key: string) => {
    setMobileOpenDropdown(mobileOpenDropdown === key ? null : key);
  };

  return (
    <header className="sticky top-0 z-50 bg-navy-700 shadow-lg">
      <nav className="container mx-auto px-4" ref={dropdownRef}>
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-bold text-white font-serif">練健康</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {/* 首頁 */}
            <Link
              href="/"
              className={`text-sm xl:text-base transition-colors ${
                isActive('/') ? 'text-orange font-medium' : 'text-cream-100 hover:text-orange'
              }`}
            >
              {t('home')}
            </Link>

            {/* 服務方案 */}
            <Link
              href="/services"
              className={`text-sm xl:text-base transition-colors ${
                isActive('/services') ? 'text-orange font-medium' : 'text-cream-100 hover:text-orange'
              }`}
            >
              {t('services')}
            </Link>

            {/* 團隊介紹 - 下拉選單 (hover) */}
            <div
              className="relative group"
              onMouseEnter={() => setOpenDropdown('team')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                className={`flex items-center gap-1 text-sm xl:text-base transition-colors ${
                  isActive('/team') ? 'text-orange font-medium' : 'text-cream-100 hover:text-orange'
                }`}
              >
                團隊介紹
                <svg
                  className={`w-4 h-4 transition-transform ${openDropdown === 'team' ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openDropdown === 'team' && (
                <div className="absolute top-full left-0 pt-2 z-50">
                  <div className="w-48 bg-white rounded-lg shadow-lg py-2">
                    {teamSubMenu.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-4 py-2 text-sm text-navy-700 hover:bg-cream-100 hover:text-orange transition-colors"
                        onClick={() => setOpenDropdown(null)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 門店資訊 - 下拉選單 (hover) */}
            <div
              className="relative group"
              onMouseEnter={() => setOpenDropdown('locations')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                className={`flex items-center gap-1 text-sm xl:text-base transition-colors ${
                  isActive('/locations') ? 'text-orange font-medium' : 'text-cream-100 hover:text-orange'
                }`}
              >
                {t('locations')}
                <svg
                  className={`w-4 h-4 transition-transform ${openDropdown === 'locations' ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openDropdown === 'locations' && (
                <div className="absolute top-full left-0 pt-2 z-50">
                  <div className="w-40 bg-white rounded-lg shadow-lg py-2">
                    <Link
                      href="/locations"
                      className="block px-4 py-2 text-sm text-navy-700 hover:bg-cream-100 hover:text-orange transition-colors font-medium"
                      onClick={() => setOpenDropdown(null)}
                    >
                      全部門店
                    </Link>
                    <div className="border-t border-cream-200 my-1" />
                    {stores.map((store) => (
                      <Link
                        key={store.id}
                        href={`/locations/${store.id}`}
                        className="block px-4 py-2 text-sm text-navy-700 hover:bg-cream-100 hover:text-orange transition-colors"
                        onClick={() => setOpenDropdown(null)}
                      >
                        {store.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 知識分享 */}
            <a
              href="https://l-kk.tw/category/knowledge"
              className="text-sm xl:text-base text-cream-100 hover:text-orange transition-colors"
            >
              {t('articles')}
            </a>

            {/* LKK4 */}
            <Link
              href="/lkk4"
              className={`text-sm xl:text-base transition-colors ${
                isActive('/lkk4') ? 'text-orange font-medium' : 'text-cream-100 hover:text-orange'
              }`}
            >
              LKK4
            </Link>

            {/* 異業結盟 */}
            <Link
              href="/cooperation"
              className={`text-sm xl:text-base transition-colors ${
                isActive('/cooperation') ? 'text-orange font-medium' : 'text-cream-100 hover:text-orange'
              }`}
            >
              異業結盟
            </Link>
          </div>

          {/* Right Section - Desktop */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-4">
            <LanguageSwitcher />
            <Link href="/booking" className="btn btn-primary text-sm xl:text-base px-4 xl:px-6">
              {tCta('booking')}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden p-2 text-cream-100"
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
          <div className="lg:hidden py-4 border-t border-navy-600 max-h-[70vh] overflow-y-auto">
            <div className="flex flex-col gap-1">
              {/* 首頁 */}
              <Link
                href="/"
                className={`py-3 px-2 rounded ${isActive('/') ? 'text-orange font-medium bg-navy-600/50' : 'text-cream-100'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('home')}
              </Link>

              {/* 服務方案 */}
              <Link
                href="/services"
                className={`py-3 px-2 rounded ${isActive('/services') ? 'text-orange font-medium bg-navy-600/50' : 'text-cream-100'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('services')}
              </Link>

              {/* 團隊介紹 - 手機版下拉 */}
              <div>
                <button
                  onClick={() => toggleMobileDropdown('team')}
                  className={`w-full flex items-center justify-between py-3 px-2 rounded ${
                    isActive('/team') ? 'text-orange font-medium bg-navy-600/50' : 'text-cream-100'
                  }`}
                >
                  團隊介紹
                  <svg
                    className={`w-4 h-4 transition-transform ${mobileOpenDropdown === 'team' ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {mobileOpenDropdown === 'team' && (
                  <div className="ml-4 mt-1 space-y-1">
                    {teamSubMenu.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block py-2 px-3 text-sm text-cream-200 hover:text-orange rounded"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* 門店資訊 - 手機版下拉 */}
              <div>
                <button
                  onClick={() => toggleMobileDropdown('locations')}
                  className={`w-full flex items-center justify-between py-3 px-2 rounded ${
                    isActive('/locations') ? 'text-orange font-medium bg-navy-600/50' : 'text-cream-100'
                  }`}
                >
                  {t('locations')}
                  <svg
                    className={`w-4 h-4 transition-transform ${mobileOpenDropdown === 'locations' ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {mobileOpenDropdown === 'locations' && (
                  <div className="ml-4 mt-1 space-y-1">
                    <Link
                      href="/locations"
                      className="block py-2 px-3 text-sm text-cream-200 hover:text-orange rounded font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      全部門店
                    </Link>
                    {stores.map((store) => (
                      <Link
                        key={store.id}
                        href={`/locations/${store.id}`}
                        className="block py-2 px-3 text-sm text-cream-200 hover:text-orange rounded"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {store.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* 知識分享 */}
              <a
                href="https://l-kk.tw/category/knowledge"
                className="py-3 px-2 text-cream-100 rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('articles')}
              </a>

              {/* LKK4 */}
              <Link
                href="/lkk4"
                className={`py-3 px-2 rounded ${isActive('/lkk4') ? 'text-orange font-medium bg-navy-600/50' : 'text-cream-100'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                LKK4
              </Link>

              {/* 異業結盟 */}
              <Link
                href="/cooperation"
                className={`py-3 px-2 rounded ${isActive('/cooperation') ? 'text-orange font-medium bg-navy-600/50' : 'text-cream-100'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                異業結盟
              </Link>

              {/* 底部區塊 */}
              <div className="pt-4 mt-2 border-t border-navy-600 flex items-center justify-between">
                <LanguageSwitcher />
                <Link
                  href="/booking"
                  className="btn btn-primary text-sm px-4"
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
