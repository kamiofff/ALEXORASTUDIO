import { Hero } from '@/components/sections/Hero';
import { Services } from '@/components/sections/Services';
import { WhyUs } from '@/components/sections/WhyUs';
import { Portfolio } from '@/components/sections/Portfolio';
import { Reviews } from '@/components/sections/Reviews';
import { Faq } from '@/components/sections/Faq';
import { Support } from '@/components/sections/Support';
import { Cta } from '@/components/sections/Cta';
import { Contacts } from '@/components/sections/Contacts';

export function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <WhyUs />
      <Portfolio />
      <Reviews />
      <Faq />
      <Support />
      <Cta />
      <Contacts />
    </>
  );
}
