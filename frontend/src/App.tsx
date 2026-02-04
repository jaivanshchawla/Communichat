import { useEffect, useState } from 'react';
import { SignedIn, SignedOut, UserButton, useAuth, SignInButton } from '@clerk/clerk-react';
import { api, setAuthToken } from './api';
import { PostCard } from './components/PostCard';
import { CreatePost } from './components/CreatePost';
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
  const [creating, setCreating] = useState(false);

  // Load posts on mount and when auth changes
  useEffect(() => {
    loadPosts();
  }, [userId]);

  // Set auth token when available
  useEffect(() => {
    const setupAuth = async () => {
      const token = await getToken();
      setAuthToken(token);
    };
    setupAuth();
  }, [getToken]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('🚀 Fetching posts from API...');
      const response = await api.getPosts();
      console.log('✅ Posts response:', response);
      console.log('✅ Posts data:', response.data);
      const postsData = response.data.results || response.data;
      console.log('✅ Extracted posts:', postsData);
      setPosts(postsData);
    } catch (err: any) {
      console.error('❌ Failed to load posts:', err);
      console.error('❌ Error message:', err.message);
      console.error('❌ Error response:', err.response);
      console.error('❌ Error config:', err.config);
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (title: string, content: string) => {
    if (!userId) {
      setError('You must be signed in to create a post');
      return;
    }

    try {
      setCreating(true);
      await api.createPost({ title, content });
      await loadPosts();
    } catch (err) {
      console.error('Failed to create post:', err);
      throw new Error('Failed to create post');
    } finally {
      setCreating(false);
    }
  };

  const handleLike = async (postId: number) => {
    try {
      if (likedPosts.has(postId)) {
        await api.unlikePost(postId);
        setLikedPosts(prev => {
          const next = new Set(prev);
          next.delete(postId);
          return next;
        });
      } else {
        await api.likePost(postId);
        setLikedPosts(prev => new Set(prev).add(postId));
      }
      await loadPosts();
    } catch (err) {
      console.error('Failed to like post:', err);
    }
  };

  const handleComment = (postId: number) => {
    alert(`Comment feature coming soon! (Post ID: ${postId})`);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '16px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '2px solid #4CAF50'
      }}>
        <h1 style={{ margin: 0, color: '#1a1a1a' }}>🎯 PLAYTO Community</h1>
        <UserButton />
      </div>

      {/* Error message */}
      {error && (
        <div style={{
          background: '#ffebee',
          color: '#c62828',
          padding: '12px',
          borderRadius: '4px',
          marginBottom: '16px'
        }}>
          {error}
        </div>
      )}

      {/* Create post form */}
      <SignedIn>
        <CreatePost onSubmit={handleCreatePost} isLoading={creating} />
      </SignedIn>

      {/* Posts feed */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
          Loading posts...
        </div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
          No posts yet. Be the first to share!
        </div>
      ) : (
        <div>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onComment={handleComment}
              isLiked={likedPosts.has(post.id)}
            />
          ))}
        </div>
      )}

      {/* Sign in prompt */}
      <SignedOut>
        <div style={{
          textAlign: 'center',
          padding: '40px',
          background: '#f5f5f5',
          borderRadius: '8px',
          marginTop: '24px'
        }}>
          <h2 style={{ color: '#1a1a1a' }}>Welcome to PLAYTO</h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Sign in to view and create posts
          </p>
          <SignInButton mode="modal">
            <button style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginBottom: '20px'
            }}>
              Sign In
            </button>
          </SignInButton>
          <p style={{ color: '#999', fontSize: '14px' }}>
            Demo users available: demo@playto.app, alice@playto.app, bob@playto.app
          </p>
        </div>
      </SignedOut>
    </div>
  );
}

function App() {
  const [apiStatus, setApiStatus] = useState<'checking' | 'ok' | 'error'>('checking');

  // Check API health on mount
  useEffect(() => {
    const checkAPI = async () => {
      try {
        console.log('🔍 Checking API health...');
        const response = await api.healthCheck();
        console.log('✅ API is healthy:', response.data);
        setApiStatus('ok');
      } catch (err: any) {
        console.error('❌ API health check failed:', err);
        console.error('❌ Error message:', err.message);
        console.error('❌ Error response:', err.response);
        setApiStatus('error');
      }
    };
    checkAPI();
  }, []);

  return (
    <div>
      {apiStatus === 'error' && (
        <div style={{
          background: '#ff9800',
          color: 'white',
          padding: '12px',
          textAlign: 'center',
          fontSize: '14px'
        }}>
          ⚠️ Backend API is not responding. Make sure Django server is running on http://localhost:8000
        </div>
      )}
      <Feed />
    </div>
  );
}

export default App;
