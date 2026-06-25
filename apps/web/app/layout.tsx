import { Noto_Sans_TC } from 'next/font/google';
import './globals.css';

const notoSans = Noto_Sans_TC({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans',
});

export const metadata = {
  title: '練健康',
  description: '專業一對一私人教練，科學化訓練，找回你的健康生活',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW" className={notoSans.variable}>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
