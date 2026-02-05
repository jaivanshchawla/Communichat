import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { ThemeProvider } from './context/ThemeContext'
import './index.css'
import App from './App.tsx'

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.trim();

console.log('🔑 Clerk Key Check:', {
  exists: !!publishableKey,
  length: publishableKey?.length,
  prefix: publishableKey?.substring(0, 10)
});

// Render with or without Clerk (fallback mode)
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

const render = () => {
  const content = publishableKey ? (
    <StrictMode>
      <ClerkProvider 
        publishableKey={publishableKey}
        afterSignOutUrl="/"
        signInUrl="/sign-in"
        signUpUrl="/sign-up"
      >
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </ClerkProvider>
    </StrictMode>
  ) : (
    <StrictMode>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </StrictMode>
  );

  createRoot(rootElement).render(content);
};

// Render immediately (don't wait for Clerk)
render();
