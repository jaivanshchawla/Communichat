import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { ThemeProvider } from './context/ThemeContext'
import './index.css'
import App from './App.tsx'

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.trim();

if (!publishableKey) {
  throw new Error('❌ VITE_CLERK_PUBLISHABLE_KEY is required - Clerk is mandatory');
}

if (publishableKey.length < 20) {
  throw new Error('❌ VITE_CLERK_PUBLISHABLE_KEY is invalid - must be a real Clerk key');
}

console.log('✅ PLAYTO initializing with Clerk authentication');
console.log('📍 API:', import.meta.env.VITE_API_URL);
// Deployment trigger - workflow updated to use npm build instead of vercel build

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
  <StrictMode>
    <ClerkProvider 
      publishableKey={publishableKey}
      afterSignOutUrl="/"
    >
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ClerkProvider>
  </StrictMode>
);
