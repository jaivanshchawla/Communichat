import React, { useState } from 'react';

interface CreatePostProps {
  onSubmit: (title: string, content: string) => Promise<void>;
  isLoading?: boolean;
}

export const CreatePost: React.FC<CreatePostProps> = ({ onSubmit, isLoading = false }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !content.trim()) {
      setError('Please fill in both title and content');
      return;
    }

    try {
      await onSubmit(title, content);
      setTitle('');
      setContent('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: '#fff',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '24px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      <h3 style={{ margin: '0 0 16px 0', color: '#1a1a1a' }}>Create a Post</h3>

      {error && (
        <div style={{
          background: '#ffebee',
          color: '#c62828',
          padding: '12px',
          borderRadius: '4px',
          marginBottom: '12px'
        }}>
          {error}
        </div>
      )}

      <input
        type="text"
        placeholder="Post title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={isLoading}
        style={{
          width: '100%',
          padding: '8px',
          marginBottom: '12px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          fontSize: '14px',
          boxSizing: 'border-box'
        }}
      />

      <textarea
        placeholder="Share your thoughts, ideas, or updates..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isLoading}
        rows={4}
        style={{
          width: '100%',
          padding: '8px',
          marginBottom: '12px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          fontSize: '14px',
          boxSizing: 'border-box',
          fontFamily: 'inherit'
        }}
      />

      <button
        type="submit"
        disabled={isLoading}
        style={{
          background: '#4CAF50',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '4px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
          opacity: isLoading ? 0.6 : 1
        }}
      >
        {isLoading ? 'Publishing...' : 'Publish Post'}
      </button>
    </form>
  );
};
