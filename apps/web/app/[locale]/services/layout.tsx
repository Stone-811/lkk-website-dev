import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '服務介紹 | 練健康',
  description: '練健康提供一對一訓練、團體課程、線上課程等多元服務。50 歲以上首次體驗完全免費，一般首次體驗 $500。',
  openGraph: {
    title: '服務介紹 | 練健康',
    description: '找到最適合你的上課方式：一對一訓練、團體課程、線上課程',
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
