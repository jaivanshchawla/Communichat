import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const allThemes = ['light', 'dark', 'cupcake', 'bumblebee', 'emerald', 'corporate', 'synthwave', 'retro', 'cyberpunk', 'valentine', 'halloween', 'garden', 'forest', 'aqua', 'lofi', 'pastel', 'fantasy', 'wireframe', 'black', 'luxury', 'dracula', 'cmyk', 'autumn', 'business', 'acid', 'lemonade', 'night', 'coffee', 'winter', 'dim', 'nord', 'sunset'];

  const getThemeEmoji = (themeName: string) => {
    const emojiMap: Record<string, string> = {
      'light': '☀️', 'dark': '🌙', 'cupcake': '🧁', 'bumblebee': '🐝', 'emerald': '💚', 'corporate': '💼',
      'synthwave': '🌆', 'retro': '📻', 'cyberpunk': '🤖', 'valentine': '💗', 'halloween': '🎃', 'garden': '🌸',
      'forest': '🌲', 'aqua': '💧', 'lofi': '🎵', 'pastel': '🎨', 'fantasy': '✨', 'wireframe': '📐',
      'black': '⚫', 'luxury': '👑', 'dracula': '🧛', 'cmyk': '🖨️', 'autumn': '🍂', 'business': '📊',
      'acid': '⚗️', 'lemonade': '🍋', 'night': '🌃', 'coffee': '☕', 'winter': '❄️', 'dim': '🌑', 'nord': '🧊', 'sunset': '🌅',
    };
    return emojiMap[themeName] || '🎨';
  };

  const handleThemeClick = (newTheme: string) => {
    console.log('🎨 Setting theme to:', newTheme);
    setTheme(newTheme as any);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-ghost btn-circle btn-sm border border-base-300 hover:border-primary hover:text-primary transition-colors"
        title="Switch theme"
        aria-label="Toggle theme"
        type="button"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-base-100 rounded-xl shadow-lg border border-base-300 p-3 max-h-96 overflow-y-auto z-50">
          <div className="grid grid-cols-4 gap-2">
            {allThemes.map((t) => (
              <button
                key={t}
                onClick={() => handleThemeClick(t)}
                type="button"
                className={`flex flex-col items-center gap-1 p-2 rounded-lg text-xs transition-all ${
                  theme === t
                    ? 'bg-primary text-primary-content font-bold scale-105'
                    : 'bg-base-200 hover:bg-base-300'
                }`}
                title={t}
              >
                <span className="text-base">{getThemeEmoji(t)}</span>
                <span className="capitalize truncate w-full text-center text-[10px]">{t}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
