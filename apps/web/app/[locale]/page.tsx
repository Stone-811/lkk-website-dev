import {
  HeroSection,
  ServicesSection,
  CasesSection,
  FlowSection,
  TeamSection,
  LocationsSection,
  FAQSection,
} from '@/components/sections';

// ISR: 重新驗證間隔 60 秒（首頁內容變動頻率低）
export const revalidate = 60;

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <TeamSection />
      <LocationsSection />
      <CasesSection />
      <FlowSection />
      <FAQSection />
    </>
  );
}
