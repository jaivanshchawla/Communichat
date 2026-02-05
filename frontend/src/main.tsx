import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { ThemeProvider } from './context/ThemeContext'
import './index.css'
import App from './App.tsx'

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.trim();
const clerkInstanceUrl = import.meta.env.VITE_CLERK_INSTANCE_URL?.trim() || 'https://epic-marlin-86.clerk.accounts.dev';

if (!publishableKey) {
  throw new Error('❌ VITE_CLERK_PUBLISHABLE_KEY is required - Clerk is mandatory');
}

if (publishableKey.length < 20) {
  throw new Error('❌ VITE_CLERK_PUBLISHABLE_KEY is invalid - must be a real Clerk key');
}

console.log('✅ PLAYTO initializing with Clerk authentication');
console.log('📍 Clerk Instance:', clerkInstanceUrl);
console.log('📍 API:', import.meta.env.VITE_API_URL);

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
