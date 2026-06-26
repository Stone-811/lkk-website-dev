import {
  HeroSection,
  ServicesSection,
  CasesSection,
  FlowSection,
  TeamSection,
  LocationsSection,
  FAQSection,
} from '@/components/sections';

// Force dynamic rendering for next-intl
export const dynamic = 'force-dynamic';

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
