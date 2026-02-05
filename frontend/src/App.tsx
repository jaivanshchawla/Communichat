import { useEffect, useState } from 'react';
import { SignedIn, SignedOut, UserButton, useAuth, SignInButton } from '@clerk/clerk-react';
import { api, setAuthToken } from './api';
import { PostCard } from './components/PostCard';
import { CreatePost } from './components/CreatePost';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { Leaderboard } from './components/Leaderboard';
import { useGuestAuth } from './context/GuestAuthContext';
import './App.css';

const useClerkAvailable = () => {
  try {
    const clerk = useAuth();
    return !!clerk;
  } catch {
    return false;
  }
};

interface Post {
  id: number;
  title: string;
  content: string;
  author: { id: number; email: string; first_name: string; last_name: string };
  comments_count: number;
  likes_count: number;
  created_at: string;
}

function Feed() {
  const { getToken, userId, isLoaded } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

  // Load posts on mount and when auth changes
  useEffect(() => {
    if (isLoaded) {
      loadPosts();
    }
  }, [userId, isLoaded]);

  // Set auth token when available
  useEffect(() => {
    const setupAuth = async () => {
      try {
        const token = await getToken();
        if (token) {
          setAuthToken(token);
        }
      } catch (error) {
        console.warn('Auth setup failed (continuing anyway):', error);
      }
    };
    if (isLoaded) {
      setupAuth();
    }
  }, [getToken, isLoaded]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.getPosts();
      const postsData = response.data.results || response.data;
      setPosts(postsData);
    } catch (err) {
      console.error('Error loading posts:', err);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = () => {
    loadPosts();
  };

  const handleLike = async (postId: number) => {
    try {
      await api.likePost(postId);
      setLikedPosts(prev => new Set(prev).add(postId));
      // Reload posts to get updated like counts
      loadPosts();
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <header className="navbar bg-base-200 shadow-sm sticky top-0 z-40">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl font-bold">🔥 PLAYTO</a>
        </div>
        <div className="flex-none gap-2">
          <ThemeSwitcher />
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Feed (Main) */}
          <div className="lg:col-span-3">
            {/* Create Post */}
            <SignedIn>
              <div className="mb-6">
                <CreatePost onPostCreated={handlePostCreated} />
              </div>
            </SignedIn>

            {/* Posts Feed */}
            {loading ? (
              <div className="flex justify-center py-12">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : error ? (
              <div className="alert alert-error">
                <span>{error}</span>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg opacity-60">No posts yet. Be the first to post! 🚀</p>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map(post => (
                  <PostCard 
                    key={post.id} 
                    post={post}
                    onLike={handleLike}
                    isLiked={likedPosts.has(post.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Leaderboard */}
            <Leaderboard />

            {/* Sign in prompt */}
            <SignedOut>
              <div className="card bg-base-200 shadow-md p-6 text-center">
                <h3 className="font-bold text-lg mb-4">Join the Community</h3>
                <p className="text-sm mb-4 opacity-70">Sign in to post and engage with the community.</p>
                <SignInButton>
                  <button className="btn btn-primary w-full">Sign In</button>
                </SignInButton>
              </div>
            </SignedOut>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main App component - handles Clerk vs Guest mode
export default function App() {
  const guestMode = import.meta.env.VITE_GUEST_MODE === 'true';
  const clerkAvailable = useClerkAvailable();
  
  // If Clerk is available, use normal flow
  if (!guestMode && clerkAvailable) {
    return (
      <>
        <SignedIn>
          <Feed />
        </SignedIn>
        <SignedOut>
          {/* Fallback when not signed in */}
          <LandingPage showSignIn={true} />
        </SignedOut>
      </>
    );
  }
  
  // Guest mode - render feed directly
  if (guestMode) {
    return <GuestModeFeed />;
  }
  
  // Fallback UI
  return <LandingPage showSignIn={false} />;
}

function LandingPage({ showSignIn }: { showSignIn: boolean }) {
  const { isLoaded } = useAuth();
  
  return (
    <div className="min-h-screen bg-base-100">
      <div className="navbar bg-base-200 shadow-md">
        <div className="flex-1 px-4">
          <h1 className="text-2xl font-bold">🎮 PLAYTO</h1>
        </div>
        <div className="flex-none gap-4 pr-4">
          <ThemeSwitcher />
          {showSignIn && (
            <SignInButton>
              <button className="btn btn-primary">Sign In</button>
            </SignInButton>
          )}
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto p-4 pt-8">
        <div className="card bg-base-200 shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Welcome to PLAYTO</h2>
          <p className="text-lg mb-6 opacity-75">A modern community where ideas matter.</p>
          {showSignIn && !isLoaded && (
            <div className="loading loading-spinner loading-lg mb-4"></div>
          )}
          {showSignIn && (
            <SignInButton>
              <button className="btn btn-lg btn-primary">Get Started</button>
            </SignInButton>
          )}
          {!showSignIn && (
            <p className="text-sm opacity-60 mt-4">Guest mode - read-only access</p>
          )}
        </div>
      </div>
    </div>
  );
}

function GuestModeFeed() {
  const guestAuth = useGuestAuth();
  const [showGuestForm, setShowGuestForm] = useState(!guestAuth.isSignedIn);

  if (showGuestForm && !guestAuth.isSignedIn) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
        <div className="card bg-base-200 shadow-2xl w-full max-w-md">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">Welcome to PLAYTO</h2>
            <p className="text-sm opacity-70 mb-4">Browse the community feed. Enter your name to participate.</p>
            
            <input
              type="email"
              placeholder="your@email.com"
              className="input input-bordered w-full mb-3"
              id="guest-email"
            />
            <input
              type="text"
              placeholder="Your username"
              className="input input-bordered w-full mb-4"
              id="guest-username"
            />
            
            <button
              onClick={() => {
                const email = (document.getElementById('guest-email') as HTMLInputElement)?.value || 'guest@playto.app';
                const username = (document.getElementById('guest-username') as HTMLInputElement)?.value || 'Guest User';
                if (username.trim()) {
                  guestAuth.signIn(email, username);
                  setShowGuestForm(false);
                }
              }}
              className="btn btn-primary w-full"
            >
              Continue as Guest
            </button>

            <div className="divider text-xs">or</div>

            <button
              onClick={() => {
                guestAuth.signIn('guest@playto.app', 'Guest User');
                setShowGuestForm(false);
              }}
              className="btn btn-outline w-full"
            >
              Browse Anonymously
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <Feed />;
}


