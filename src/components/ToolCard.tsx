import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ToolConfig } from '../types';
import { ArrowUpRight } from 'lucide-react';

interface ToolCardProps {
  tool: ToolConfig;
  index: number;
}

// Parses string like "from-[#FF5E62] to-[#FF9966]" into standard background image CSS rule
const getGradientStyle = (gradientStr: string) => {
  const fromMatch = gradientStr.match(/from-\[#?([0-9a-fA-F]+)\]/);
  const toMatch = gradientStr.match(/to-\[#?([0-9a-fA-F]+)\]/);
  
  if (fromMatch && toMatch) {
    const fromColor = `#${fromMatch[1]}`;
    const toColor = `#${toMatch[1]}`;
    return {
      backgroundImage: `linear-gradient(135deg, ${fromColor}, ${toColor})`
    };
  }
  return {
    backgroundImage: 'linear-gradient(135deg, #6C63FF, #FF6584)'
  };
};

export const ToolCard: React.FC<ToolCardProps> = ({ tool, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ 
        type: 'spring', 
        stiffness: 100, 
        damping: 15,
        delay: index * 0.05 
      }}
      whileHover={{ 
        y: -6, 
        boxShadow: '0 20px 30px -10px rgba(108, 99, 255, 0.12)'
      }}
      whileTap={{ scale: 0.98 }}
      className="group glass-card rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden"
    >
      {/* Decorative accent background on hover */}
      <div 
        style={getGradientStyle(tool.gradient)}
        className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300 rounded-bl-full pointer-events-none" 
      />

      <div>
        {/* Large Emoji Banner */}
        <div 
          style={getGradientStyle(tool.gradient)}
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-md mb-5 text-white flex-shrink-0"
        >
          {tool.icon}
        </div>

        {/* Title */}
        <h3 className="font-poppins font-semibold text-lg text-text-base mb-2 group-hover:text-primary transition-colors duration-300">
          {tool.name}
        </h3>

        {/* Description */}
        <p className="font-inter text-sm text-muted dark:text-gray-400 mb-6 leading-relaxed">
          {tool.description}
        </p>
      </div>

      {/* Footer Link */}
      <Link
        id={`open-tool-${tool.id}`}
        to={tool.route}
        className="inline-flex items-center gap-1.5 text-primary dark:text-[#7C74FF] font-poppins font-semibold text-sm group-hover:gap-2.5 transition-all text-left underline-offset-4 hover:underline"
        aria-label={`Open the ${tool.name} utility`}
      >
        Open Tool
        <ArrowUpRight className="w-4 h-4" />
      </Link>
    </motion.div>
  );
};

export default ToolCard;
