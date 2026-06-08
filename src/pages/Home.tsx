import React from 'react';
import Navbar from '../components/Navbar';
import ToolsGrid from '../components/ToolsGrid';

export const Home: React.FC = () => {
  return (
    <div id="homepage-root" className="min-h-screen bg-background dark:bg-[#0F0F1A] transition-colors duration-300 flex flex-col justify-between">
      {/* Scroll indicator anchor */}
      <Navbar />
      
      <main className="flex-grow">
        <ToolsGrid />
      </main>
    </div>
  );
};

export default Home;
