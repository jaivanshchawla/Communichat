import React, { useState } from 'react';
import { api } from '../api';

interface CreatePostProps {
  onPostCreated?: () => void;
}

export const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !content.trim()) {
      setError('Please fill in both title and content');
      return;
    }

    try {
      setLoading(true);
      await api.createPost({ title, content });
      setTitle('');
      setContent('');
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (err) {
      console.error('Failed to create post:', err);
      setError(err instanceof Error ? err.message : 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card bg-base-100 shadow-md p-6">
      <h3 className="text-lg font-bold mb-4">✨ Share Your Thoughts</h3>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      <input
        type="text"
        placeholder="Post title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={loading}
        className="input input-bordered w-full mb-4"
      />

      <textarea
        placeholder="Share your thoughts, ideas, or updates..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={loading}
        rows={4}
        className="textarea textarea-bordered w-full mb-4 resize-none"
      />

      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary w-full"
      >
        {loading ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            Publishing...
          </>
        ) : (
          'Publish Post'
        )}
      </button>
    </form>
  );
};
