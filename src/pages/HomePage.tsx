import { Hero } from '@/components/sections/Hero';
import { Services } from '@/components/sections/Services';
import { Portfolio } from '@/components/sections/Portfolio';
import { Reviews } from '@/components/sections/Reviews';
import { Faq } from '@/components/sections/Faq';
import { Cta } from '@/components/sections/Cta';
import { Contacts } from '@/components/sections/Contacts';

export function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <Portfolio />
      <Reviews />
      <Faq />
      <Cta />
      <Contacts />
    </>
  );
}