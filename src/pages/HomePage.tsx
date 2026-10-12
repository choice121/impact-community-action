import React from 'react';
import { SEO } from '../components/common/SEO';
import { Hero } from '../components/home/Hero';
import { ImpactCounters } from '../components/home/ImpactCounters';
import { LiveDonationTicker } from '../components/home/LiveDonationTicker';
import { PillarCards } from '../components/home/PillarCards';
import { HowItWorks } from '../components/home/HowItWorks';
import { WhereDollarGoes } from '../components/home/WhereDollarGoes';
import { ProjectMap } from '../components/home/ProjectMap';
import { StoriesPreview } from '../components/home/StoriesPreview';
import { Testimonials } from '../components/home/Testimonials';
import { NewsletterSection } from '../components/home/NewsletterSection';

export const HomePage: React.FC = () => {
  return (
    <>
      <SEO
        title="Home"
        description="Impact Community Action (ICA) is a transparent 501(c)(3) nonprofit providing rapid emergency relief, hunger eradication, and housing stability across 7 vital cause pillars."
      />
      <div className="space-y-0">
        <Hero />
        <ImpactCounters />
        <LiveDonationTicker />
        <PillarCards />
        <HowItWorks />
        <WhereDollarGoes />
        <ProjectMap />
        <StoriesPreview />
        <Testimonials />
        <NewsletterSection />
      </div>
    </>
  );
};
