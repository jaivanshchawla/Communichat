import { useEffect, useState } from 'react';
import { SignedIn, SignedOut, UserButton, useAuth, SignInButton } from '@clerk/clerk-react';
import { api, setAuthToken } from './api';
import { PostCard } from './components/PostCard';
import { CreatePost } from './components/CreatePost';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { Leaderboard } from './components/Leaderboard';
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
  const { getToken, userId } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

  // Load posts on mount and when auth changes
  useEffect(() => {
    loadPosts();
  }, [userId]);

  // Set auth token when available
  useEffect(() => {
    const setupAuth = async () => {
      const token = await getToken();
      if (token) {
        setAuthToken(token);
      }
    };
    setupAuth();
  }, [getToken]);

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

export default function App() {
  return (
    <SignedIn>
      <Feed />
    </SignedIn>
  );
}
