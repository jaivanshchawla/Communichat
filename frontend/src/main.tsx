import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { ThemeProvider } from './context/ThemeContext'
import { GuestAuthProvider } from './context/GuestAuthContext'
import './index.css'
import App from './App.tsx'

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.trim() || '';
const guestMode = import.meta.env.VITE_GUEST_MODE === 'true';

console.log('🔧 App Config:', {
  clerkEnabled: !!publishableKey && !guestMode,
  guestMode,
  apiUrl: import.meta.env.VITE_API_URL
});

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

// Render with Clerk only if valid key exists and guest mode is off
const render = () => {
  if (publishableKey && !guestMode) {
    createRoot(rootElement).render(
      <StrictMode>
        <ClerkProvider 
          publishableKey={publishableKey}
          afterSignOutUrl="/"
          signInUrl="/sign-in"
          signUpUrl="/sign-up"
        >
          <ThemeProvider>
            <GuestAuthProvider>
              <App />
            </GuestAuthProvider>
          </ThemeProvider>
        </ClerkProvider>
      </StrictMode>
    );
  } else {
    // Guest mode or no Clerk key - skip auth
    createRoot(rootElement).render(
      <StrictMode>
        <ThemeProvider>
          <GuestAuthProvider>
            <App />
          </GuestAuthProvider>
        </ThemeProvider>
      </StrictMode>
    );
  }
};

render();
