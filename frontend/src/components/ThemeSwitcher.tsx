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
    <div className="relative group">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-ghost btn-circle btn-sm transition-all duration-300 hover:bg-base-200"
        title="Switch theme"
        aria-label="Toggle theme"
        type="button"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-56 bg-base-100 rounded-xl shadow-xl border border-base-300 py-2 max-h-[70vh] overflow-y-auto z-50 scrollbar-thin">
            <div className="px-4 py-2 text-xs font-semibold opacity-50 uppercase tracking-wider sticky top-0 bg-base-100/95 backdrop-blur-sm border-b border-base-200 mb-1">
              Select Theme
            </div>
            {allThemes.map((t) => (
              <button
                key={t}
                onClick={() => handleThemeClick(t)}
                type="button"
                className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-all hover:bg-base-200
                  ${theme === t ? 'bg-primary/10 text-primary font-medium' : 'text-base-content/80'}
                `}
                title={t}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg leading-none">{getThemeEmoji(t)}</span>
                  <span className="capitalize">{t}</span>
                </div>
                {theme === t && (
                  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
