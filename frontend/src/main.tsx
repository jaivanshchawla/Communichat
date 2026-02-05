import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { ThemeProvider } from './context/ThemeContext'
import { GuestAuthProvider } from './context/GuestAuthContext'
import './index.css'
import App from './App.tsx'

const publishableKey = (import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '').trim();
const guestMode = import.meta.env.VITE_GUEST_MODE === 'true';

console.log('🚀 PLAYTO App Starting:', {
  clerkConfigured: !!publishableKey && publishableKey.length > 10,
  guestMode,
  apiUrl: import.meta.env.VITE_API_URL
});

if (!publishableKey || publishableKey.length < 10) {
  console.warn('⚠️  Clerk not configured - using guest mode');
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

// Render app with appropriate auth provider based on Clerk key
const shouldUseClerk = publishableKey.length > 10 && !guestMode;

createRoot(rootElement).render(
  <StrictMode>
    {shouldUseClerk ? (
      <ClerkProvider 
        publishableKey={publishableKey}
        afterSignOutUrl="/"
      >
        <ThemeProvider>
          <GuestAuthProvider>
            <App />
          </GuestAuthProvider>
        </ThemeProvider>
      </ClerkProvider>
    ) : (
      <ThemeProvider>
        <GuestAuthProvider>
          <App />
        </GuestAuthProvider>
      </ThemeProvider>
    )}
  </StrictMode>
);
