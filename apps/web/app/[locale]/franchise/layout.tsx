import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '練健康加盟說明會 | LKK Wellness Franchise',
  description: '亞洲正在老去，而這個市場幾乎還沒有人在認真做。練健康花了七年建立這套體系，現在我們正在選擇合適的夥伴，一起把它帶出去。',
};

export default function FranchiseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
