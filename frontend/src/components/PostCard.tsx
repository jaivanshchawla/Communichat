import React, { useState } from 'react';

interface Post {
  id: number;
  title: string;
  content: string;
  author: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
  comments_count: number;
  likes_count: number;
  created_at: string;
}

interface PostCardProps {
  post: Post;
  onLike: (postId: number) => void;
  onComment: (postId: number) => void;
  isLiked?: boolean;
  canEdit?: boolean;
  onDelete?: (postId: number) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onComment,
  isLiked = false,
  canEdit = false,
  onDelete,
}) => {
  const authorName = `${post.author.first_name} ${post.author.last_name}`.trim() || post.author.email;
  const createdAt = new Date(post.created_at).toLocaleDateString();

  return (
    <div className="post-card" style={{
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '16px',
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div>
          <h3 style={{ margin: '0 0 8px 0', color: '#1a1a1a' }}>{post.title}</h3>
          <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>
            by <strong>{authorName}</strong> · {createdAt}
          </p>
        </div>
        {canEdit && onDelete && (
          <button
            onClick={() => onDelete(post.id)}
            style={{
              background: '#ff4444',
              color: 'white',
              border: 'none',
              padding: '4px 8px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Delete
          </button>
        )}
      </div>

      <p style={{ margin: '12px 0', lineHeight: '1.5', color: '#333' }}>
        {post.content}
      </p>

      <div style={{
        display: 'flex',
        gap: '16px',
        marginTop: '12px',
        paddingTop: '12px',
        borderTop: '1px solid #f0f0f0'
      }}>
        <button
          onClick={() => onLike(post.id)}
          style={{
            background: isLiked ? '#ff6b6b' : '#f0f0f0',
            color: isLiked ? 'white' : '#333',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          👍 {post.likes_count}
        </button>
        <button
          onClick={() => onComment(post.id)}
          style={{
            background: '#f0f0f0',
            color: '#333',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          💬 {post.comments_count}
        </button>
      </div>
    </div>
  );
};
