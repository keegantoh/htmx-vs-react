import React, { useEffect } from 'react';
import { BlueprintBuilder } from './components/BlueprintBuilder';
import { ComparisonLedger } from './components/ComparisonLedger';
import { ComponentCrucible } from './components/ComponentCrucible';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { Navbar } from './components/Navbar';
import { StressTestLab } from './components/StressTestLab';
import { TriadArchitecture } from './components/TriadArchitecture';
import { initHypermediaRuntime } from './lib/hypermediaRuntime';

export default function App() {
  useEffect(() => {
    void initHypermediaRuntime();
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F7F5] text-[#111214]">
      <Navbar />
      <main>
        <HeroSection />
        <TriadArchitecture />
        <ComponentCrucible />
        <StressTestLab />
        <ComparisonLedger />
        <BlueprintBuilder />
      </main>
      <Footer />
    </div>
  );
}
