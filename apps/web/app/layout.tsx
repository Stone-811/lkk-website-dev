import { Noto_Sans_TC, Noto_Serif_TC } from 'next/font/google';
import { Metadata, Viewport } from 'next';
import './globals.css';

const notoSans = Noto_Sans_TC({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans',
});

const notoSerif = Noto_Serif_TC({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-noto-serif',
});

export const metadata: Metadata = {
  title: '練健康',
  description: '專業一對一私人教練，科學化訓練，找回你的健康生活',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '練健康',
  },
  formatDetection: {
    telephone: true,
  },
  icons: {
    icon: [
      { url: '/lkklogo.png', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/lkklogo.png',
    apple: [
      { url: '/lkklogo.png', type: 'image/png' },
      { url: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: '#2A5269',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW" className={`${notoSans.variable} ${notoSerif.variable}`}>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
