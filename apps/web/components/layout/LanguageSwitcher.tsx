'use client';

import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { locales, type Locale } from '@/i18n';

const localeNames: Record<Locale, string> = {
  'zh-TW': '中文',
  en: 'EN',
};

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();

  // Get the path without locale prefix
  const getPathWithoutLocale = () => {
    // For English pages, pathname starts with /en
    if (pathname.startsWith('/en')) {
      const pathWithoutEn = pathname.slice(3); // Remove '/en'
      return pathWithoutEn || '/';
    }
    // For Chinese (default), no prefix
    return pathname;
  };

  // Generate the href for a given locale
  const getLocalizedPath = (targetLocale: Locale) => {
    const basePath = getPathWithoutLocale();
    if (targetLocale === 'zh-TW') {
      // Default locale doesn't need prefix
      return basePath;
    }
    // Add locale prefix for non-default locales
    return `/${targetLocale}${basePath === '/' ? '' : basePath}`;
  };

  return (
    <div className="flex items-center gap-2">
      {locales.map((l) => (
        <Link
          key={l}
          href={getLocalizedPath(l)}
          className={`px-2 py-1 text-sm rounded transition-colors ${
            locale === l
              ? 'bg-orange/20 text-orange font-medium pointer-events-none'
              : 'text-cream-200 hover:text-orange'
          }`}
        >
          {localeNames[l]}
        </Link>
      ))}
    </div>
  );
}
