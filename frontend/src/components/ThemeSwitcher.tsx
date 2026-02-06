import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();

  // Group themes by category for better organization
  const lightThemes = ['light', 'cupcake', 'bumblebee', 'emerald', 'garden', 'forest', 'aqua', 'pastel', 'lemonade'];
  const darkThemes = ['dark', 'synthwave', 'retro', 'cyberpunk', 'halloween', 'fantasy', 'wireframe', 'black', 'luxury', 'dracula', 'cmyk', 'autumn', 'business', 'acid', 'night', 'coffee', 'winter', 'dim', 'nord', 'sunset', 'corporate', 'lofi', 'valentine'];

  const getThemeEmoji = (themeName: string) => {
    const emojiMap: Record<string, string> = {
      'light': '☀️',
      'dark': '🌙',
      'cupcake': '🧁',
      'bumblebee': '🐝',
      'emerald': '💚',
      'corporate': '💼',
      'synthwave': '🌆',
      'retro': '📻',
      'cyberpunk': '🤖',
      'valentine': '💗',
      'halloween': '🎃',
      'garden': '🌸',
      'forest': '🌲',
      'aqua': '💧',
      'lofi': '🎵',
      'pastel': '🎨',
      'fantasy': '✨',
      'wireframe': '📐',
      'black': '⚫',
      'luxury': '👑',
      'dracula': '🧛',
      'cmyk': '🖨️',
      'autumn': '🍂',
      'business': '📊',
      'acid': '⚗️',
      'lemonade': '🍋',
      'night': '🌃',
      'coffee': '☕',
      'winter': '❄️',
      'dim': '🌑',
      'nord': '🧊',
      'sunset': '🌅',
    };
    return emojiMap[themeName] || '🎨';
  };

  return (
    <div className="dropdown dropdown-end">
      <button 
        tabIndex={0} 
        className="btn btn-ghost btn-circle btn-sm border border-base-300 hover:border-primary hover:text-primary transition-colors"
        title="Switch theme"
        aria-label="Toggle theme"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      </button>
      
      <div 
        tabIndex={0} 
        className="dropdown-content z-[1] p-2 shadow-lg bg-base-100 rounded-xl w-56 max-h-96 overflow-y-auto border border-base-300"
      >
        <div className="px-2 py-2">
          <p className="text-xs font-semibold opacity-70 mb-3">Light Themes</p>
          <div className="space-y-1 mb-4">
            {lightThemes.map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t as any)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm capitalize font-medium transition-all ${
                  theme === t
                    ? 'bg-primary text-primary-content font-bold'
                    : 'hover:bg-base-200'
                }`}
              >
                <span className="mr-2">{getThemeEmoji(t)}</span>
                {t}
                {theme === t && <span className="float-right">✓</span>}
              </button>
            ))}
          </div>

          <p className="text-xs font-semibold opacity-70 mb-3">Dark Themes</p>
          <div className="space-y-1">
            {darkThemes.map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t as any)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm capitalize font-medium transition-all ${
                  theme === t
                    ? 'bg-primary text-primary-content font-bold'
                    : 'hover:bg-base-200'
                }`}
              >
                <span className="mr-2">{getThemeEmoji(t)}</span>
                {t}
                {theme === t && <span className="float-right">✓</span>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
