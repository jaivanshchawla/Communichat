import React, { useEffect, useState } from 'react';

type Theme = 
  | 'light' | 'dark' | 'cupcake' | 'bumblebee' | 'emerald' | 'corporate'
  | 'synthwave' | 'retro' | 'cyberpunk' | 'valentine' | 'halloween' | 'garden'
  | 'forest' | 'aqua' | 'lofi' | 'pastel' | 'fantasy' | 'wireframe' | 'black'
  | 'luxury' | 'dracula' | 'cmyk' | 'autumn' | 'business' | 'acid' | 'lemonade'
  | 'night' | 'coffee' | 'winter' | 'dim' | 'nord' | 'sunset';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themes: Theme[];
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('dark');

  const themes: Theme[] = [
    'light', 'dark', 'cupcake', 'bumblebee', 'emerald', 'corporate',
    'synthwave', 'retro', 'cyberpunk', 'valentine', 'halloween', 'garden',
    'forest', 'aqua', 'lofi', 'pastel', 'fantasy', 'wireframe', 'black',
    'luxury', 'dracula', 'cmyk', 'autumn', 'business', 'acid', 'lemonade',
    'night', 'coffee', 'winter', 'dim', 'nord', 'sunset',
  ];

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme && themes.includes(savedTheme)) {
      setThemeState(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    console.log('🎨 [setTheme] Called with:', newTheme);
    console.log('📍 [setTheme] Current DOM data-theme before change:', document.documentElement.getAttribute('data-theme'));
    
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Force synchronous DOM update
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Verify it was set
    const currentTheme = document.documentElement.getAttribute('data-theme');
    console.log('✅ [setTheme] Theme applied:', {
      state: newTheme,
      localStorage: localStorage.getItem('theme'),
      domAttribute: currentTheme,
      match: currentTheme === newTheme
    });
    
    // Check if DaisyUI CSS is loaded
    const styles = window.getComputedStyle(document.documentElement);
    console.log('🎨 [setTheme] Root element CSS var --p:', styles.getPropertyValue('--p'));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
