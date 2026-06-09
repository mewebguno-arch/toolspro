import React from 'react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '../hooks/useIsMobile';
import { ToolConfig } from '../types';
import { 
  ArrowUpRight,
  FileStack,
  FileImage,
  Images,
  QrCode,
  KeyRound,
  FileText,
  Braces,
  Binary,
  Palette,
  Type
} from 'lucide-react';

interface ToolCardProps {
  tool: ToolConfig;
  index: number;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileStack,
  FileImage,
  Images,
  QrCode,
  KeyRound,
  FileText,
  Braces,
  Binary,
  Palette,
  Type
};

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
    backgroundImage: 'linear-gradient(135deg, #111111, #222222)'
  };
};

export const ToolCard: React.FC<ToolCardProps> = ({ tool, index }) => {
  const IconComponent = iconMap[tool.icon] || FileImage;

  return (
    <div className="group glass-card rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div>
        {/* Large Vector Icon Banner */}
        <div 
          style={getGradientStyle(tool.gradient)}
          className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm mb-5 text-white flex-shrink-0"
        >
          <IconComponent className="w-6 h-6 text-white stroke-[2.25]" />
        </div>

        {/* Title */}
        <h3 className="font-poppins font-semibold text-lg text-text-base mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300">
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
        className="inline-flex items-center gap-1.5 text-indigo-600 dark:text-[#7C74FF] font-poppins font-semibold text-sm group-hover:gap-2.5 transition-all text-left underline-offset-4 hover:underline"
        aria-label={`Open the ${tool.name} utility`}
      >
        Open Tool
        <ArrowUpRight className="w-4 h-4" />
      </Link>
    </div>
  );
};

export default ToolCard;
