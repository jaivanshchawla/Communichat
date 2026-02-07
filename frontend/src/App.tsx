import { useEffect, useState } from 'react';
import { SignedIn, SignedOut, UserButton, useAuth, SignInButton } from '@clerk/clerk-react';
import { api, setAuthToken } from './api';
import { PostCard } from './components/PostCard';
import { CreatePost } from './components/CreatePost';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { Leaderboard } from './components/Leaderboard';
import { useTheme } from './context/ThemeContext';
import './App.css';

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
  const { theme } = useTheme();
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
    <div className="min-h-screen bg-base-100 transition-colors duration-300">
      {/* Header */}
      <header className="navbar bg-base-200 shadow-sm sticky top-0 z-40 border-b border-base-300">
        <div className="flex-1">
          <a className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">PLAYTO</span>
          </a>
        </div>
        <nav className="flex-none gap-4 items-center">
          <span className="text-xs font-medium opacity-60 hidden sm:inline">Community Feed</span>
          <ThemeSwitcher />
          <SignedIn>
            <UserButton />
          </SignedIn>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Feed (Main) */}
          <div className="lg:col-span-3">
            {/* Create Post */}
            <SignedIn>
              <div className="mb-8">
                <CreatePost onPostCreated={handlePostCreated} />
              </div>
            </SignedIn>

            {/* Posts Feed */}
            {loading ? (
              <div className="flex justify-center py-16">
                <div className="flex flex-col items-center gap-4">
                  <span className="loading loading-spinner loading-lg text-primary"></span>
                  <p className="text-sm opacity-60">Loading posts...</p>
                </div>
              </div>
            ) : error ? (
              <div className="alert alert-error shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l-2-2m0 0l-2-2m2 2l2-2m-2 2l-2 2m2-2l2 2m4-4l2-2m0 0l2-2m-2 2l2-2m-2 2l-2 2" /></svg>
                <span>{error}</span>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-xl opacity-50 font-light">No posts yet</p>
                <p className="text-sm opacity-40 mt-2">Be the first to share your thoughts 🚀</p>
              </div>
            ) : (
              <div className="space-y-6">
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
          <aside className="lg:col-span-1">
            {/* Leaderboard */}
            <Leaderboard />

            {/* Sign in prompt */}
            <SignedOut>
              <div className="card bg-gradient-to-br from-base-200 to-base-300 shadow-lg p-6 text-center">
                <h3 className="font-bold text-lg mb-2">Join PLAYTO</h3>
                <p className="text-sm mb-6 opacity-70">Sign in to share ideas and engage with the community.</p>
                <SignInButton>
                  <button className="btn btn-primary w-full">Sign In</button>
                </SignInButton>
              </div>
            </SignedOut>
          </aside>
        </div>
      </main>
    </div>
  );
}

// Main App - Clerk authentication ONLY
export default function App() {
  return (
    <>
      <SignedIn>
        <Feed />
      </SignedIn>
      <SignedOut>
        <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
          <div className="card bg-base-200 shadow-2xl w-full max-w-md border border-base-300">
            <div className="card-body">
              <div className="text-center mb-6">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">PLAYTO</h1>
                <p className="text-sm opacity-70 mt-2">A modern community feed</p>
              </div>

              <p className="text-center text-sm opacity-70 mb-8">Share ideas • Discuss topics • Build karma</p>

              <div className="flex items-center justify-center gap-2 mb-6 p-4 bg-base-100 rounded-lg border border-base-300">
                <ThemeSwitcher />
                <span className="text-xs opacity-50">Pick your theme</span>
              </div>

              <SignInButton>
                <button className="btn btn-lg btn-primary w-full font-semibold">
                  Sign In with Clerk
                </button>
              </SignInButton>

              <p className="text-xs text-center opacity-50 mt-6">
                Powered by Clerk Authentication
              </p>
            </div>
          </div>
        </div>
      </SignedOut>
    </>
  );
}


