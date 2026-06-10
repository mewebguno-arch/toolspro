import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ToolConfig } from '../types';
import { 
  ArrowUpRight,
  Heart,
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

const MotionLink = motion(Link);

export const ToolCard: React.FC<ToolCardProps> = ({ tool, index }) => {
  const IconComponent = iconMap[tool.icon] || FileImage;
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    try {
      const favs = JSON.parse(localStorage.getItem('webguno_favorites') || '[]');
      setIsFav(favs.includes(tool.id));
    } catch (e) {
      // Safe fallback
    }
  }, [tool.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const favs = JSON.parse(localStorage.getItem('webguno_favorites') || '[]');
      let updated;
      if (favs.includes(tool.id)) {
        updated = favs.filter((id: string) => id !== tool.id);
        setIsFav(false);
      } else {
        updated = [...favs, tool.id];
        setIsFav(true);
      }
      localStorage.setItem('webguno_favorites', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('favorites-updated'));
    } catch (err) {
      console.error('Failed to update favorites', err);
    }
  };

  return (
    <MotionLink
      id={`open-tool-${tool.id}`}
      to={tool.route}
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
        y: -4, 
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)'
      }}
      whileTap={{ scale: 0.98 }}
      className="group relative flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 hover:border-indigo-500/50 dark:hover:border-indigo-400/50 shadow-sm hover:shadow-xl transition-all duration-300 ease-out cursor-pointer"
    >
      <div>
        {/* Header Zone */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-600 dark:group-hover:bg-indigo-950/50 dark:group-hover:text-indigo-400 transition-colors duration-200 shrink-0">
            <IconComponent className="w-6 h-6 stroke-[2.25]" />
          </div>

          <button
            onClick={toggleFavorite}
            className={`p-2 rounded-lg transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500/50 ${
              isFav 
                ? 'opacity-100 text-rose-500 bg-rose-50 dark:bg-rose-950/30' 
                : 'opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
            aria-label={isFav ? "Remove from Favorites" : "Add to Favorites"}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Content Zone */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
            {tool.name}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
            {tool.description}
          </p>
        </div>
      </div>

      {/* Footer Action Zone */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-sm font-semibold text-indigo-600 dark:text-indigo-400">
        <span>Launch Tool</span>
        <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </MotionLink>
  );
};

export default ToolCard;
