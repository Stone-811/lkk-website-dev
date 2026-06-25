'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { locales, type Locale } from '@/i18n';

const localeNames: Record<Locale, string> = {
  'zh-TW': '中文',
  en: 'EN',
};

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (newLocale: Locale) => {
    // Remove current locale from pathname
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';

    // Navigate to new locale path
    if (newLocale === 'zh-TW') {
      router.push(pathWithoutLocale);
    } else {
      router.push(`/${newLocale}${pathWithoutLocale}`);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => switchLocale(l)}
          className={`px-2 py-1 text-sm rounded transition-colors ${
            locale === l
              ? 'bg-orange/20 text-orange font-medium'
              : 'text-cream-200 hover:text-orange'
          }`}
        >
          {localeNames[l]}
        </button>
      ))}
    </div>
  );
}
