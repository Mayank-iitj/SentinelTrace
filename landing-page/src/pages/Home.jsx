import React from 'react';
import Hero from '../components/Hero';
import Statement from '../components/Statement';
import ThreatTaxonomy from '../components/ThreatTaxonomy';
import ArchitectureFlow from '../components/ArchitectureFlow';
import FeaturesGrid from '../components/FeaturesGrid';
import IntegrationSnippet from '../components/IntegrationSnippet';
import HowItWorks from '../components/HowItWorks';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';

const Home = () => {
  return (
    <>
      <Hero />
      <Statement />
      <ThreatTaxonomy />
      <ArchitectureFlow />
      <FeaturesGrid />
      <IntegrationSnippet />
      <HowItWorks />
      <Testimonials />
      <CTA />
    </>
  );
};

export default Home;
