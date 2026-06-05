import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ToolsGrid from '../components/ToolsGrid';
import Footer from '../components/Footer';

export const Home: React.FC = () => {
  return (
    <div id="homepage-root" className="min-h-screen bg-background dark:bg-[#0F0F1A] transition-colors duration-300 flex flex-col justify-between">
      {/* Scroll indicator anchor */}
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        <ToolsGrid />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
