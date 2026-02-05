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
    <form onSubmit={handleSubmit} className="bg-base-100 border border-base-300 rounded-xl p-6">
      <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
        <span>✨</span>
        Share Your Thoughts
      </h3>

      {error && (
        <div className="alert alert-error alert-sm mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-4 w-4" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l-2-2m0 0l-2-2m2 2l2-2m-2 2l-2 2m2-2l2 2m4-4l2-2m0 0l2-2m-2 2l2-2m-2 2l-2 2" /></svg>
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium opacity-80 block mb-2">Title</label>
          <input
            type="text"
            placeholder="What's on your mind?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            className="input input-bordered w-full rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
            maxLength={300}
          />
          <p className="text-xs opacity-50 mt-1">{title.length}/300</p>
        </div>

        <div>
          <label className="text-sm font-medium opacity-80 block mb-2">Content</label>
          <textarea
            placeholder="Share your thoughts, ideas, or updates..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
            rows={4}
            className="textarea textarea-bordered w-full rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
          />
        </div>

        <div className="flex gap-2 justify-end pt-2">
          <button
            type="reset"
            disabled={loading}
            className="btn btn-ghost btn-sm rounded-lg"
            onClick={() => setTitle('')}
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={loading || (!title.trim() && !content.trim())}
            className="btn btn-primary btn-sm rounded-lg font-medium"
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                Publishing...
              </>
            ) : (
              <>
                <span>📤</span>
                Publish
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};
