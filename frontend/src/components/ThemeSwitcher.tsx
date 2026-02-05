import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme, themes } = useTheme();

  return (
    <div className="dropdown dropdown-end">
      <button 
        tabIndex={0} 
        className="btn btn-ghost btn-circle"
        aria-label="Toggle theme"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      </button>
      
      <ul 
        tabIndex={0} 
        className="dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-52 max-h-96 overflow-y-auto"
      >
        {themes.map((t) => (
          <li key={t}>
            <a
              onClick={() => setTheme(t)}
              className={`capitalize ${theme === t ? 'active' : ''}`}
            >
              {t}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
