import {
  HeroSection,
  ServicesSection,
  CasesSection,
  FlowSection,
  LKK4Section,
  TeamSection,
  AcademyTeaser,
  LocationsSection,
  FAQSection,
  CTABanner,
} from '@/components/sections';

// Force dynamic rendering for next-intl
export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <CasesSection />
      <FlowSection />
      <LKK4Section />
      <TeamSection />
      <AcademyTeaser />
      <LocationsSection />
      <FAQSection />
      <CTABanner />
    </>
  );
}
