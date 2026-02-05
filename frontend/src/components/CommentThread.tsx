import React, { useState } from 'react';
import { api } from '../api';

interface Comment {
  id: number;
  author: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    username: string;
    total_karma: number;
  };
  content: string;
  likes_count: number;
  replies?: Comment[];
  created_at: string;
}

interface CommentThreadProps {
  comment: Comment;
  postId: number;
  onReplyClick?: (parentId: number) => void;
  onReplySubmit?: (parentId: number, content: string) => Promise<void>;
  depth?: number;
}

export const CommentThread: React.FC<CommentThreadProps> = ({
  comment,
  postId,
  onReplyClick,
  onReplySubmit,
  depth = 0,
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(comment.likes_count);

  const authorName = `${comment.author.first_name} ${comment.author.last_name}`.trim() 
    || comment.author.username 
    || comment.author.email;
  
  const createdAt = new Date(comment.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const handleLike = async () => {
    try {
      if (isLiked) {
        await api.unlikeComment(comment.id);
        setLikesCount(likesCount - 1);
      } else {
        await api.likeComment(comment.id);
        setLikesCount(likesCount + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    try {
      setIsSubmitting(true);
      if (onReplySubmit) {
        await onReplySubmit(comment.id, replyContent);
      } else {
        await api.createComment({
          post: postId,
          content: replyContent,
          parent: comment.id,
        } as any);
      }
      setReplyContent('');
      setShowReplyForm(false);
    } catch (error) {
      console.error('Failed to submit reply:', error);
      alert('Failed to post reply');
    } finally {
      setIsSubmitting(false);
    }
  };

  const maxDepth = 3;
  const canNest = depth < maxDepth;
  const marginLeft = depth > 0 ? `${depth * 16}px` : '0';

  return (
    <div style={{ marginLeft }} className="mb-3">
      {/* Comment Box */}
      <div className="card bg-base-100 border border-base-300">
        <div className="card-body p-3">
          {/* Header */}
          <div className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content rounded-full w-8">
                  <span className="text-xs font-bold">
                    {comment.author.email.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm">{authorName}</p>
                <p className="text-xs opacity-50">{createdAt}</p>
              </div>
              <div className="badge badge-sm badge-accent">
                {comment.author.total_karma} karma
              </div>
            </div>
          </div>

          {/* Content */}
          <p className="text-sm mt-2 text-base-content">{comment.content}</p>

          {/* Actions */}
          <div className="card-actions justify-start gap-2 mt-2">
            <button
              onClick={handleLike}
              className={`btn btn-xs gap-1 ${isLiked ? 'btn-primary' : 'btn-ghost'}`}
            >
              👍 {likesCount}
            </button>
            {canNest && (
              <button
                onClick={() => {
                  setShowReplyForm(!showReplyForm);
                  onReplyClick?.(comment.id);
                }}
                className="btn btn-xs btn-ghost gap-1"
              >
                💬 Reply
              </button>
            )}
          </div>

          {/* Reply Form */}
          {showReplyForm && canNest && (
            <form onSubmit={handleReplySubmit} className="mt-3 space-y-2">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="textarea textarea-bordered textarea-sm w-full"
                rows={2}
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowReplyForm(false);
                    setReplyContent('');
                  }}
                  className="btn btn-sm btn-ghost"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-sm btn-primary"
                  disabled={isSubmitting || !replyContent.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Posting...
                    </>
                  ) : (
                    'Post Reply'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && canNest && (
        <div className="mt-2 space-y-1">
          {comment.replies.map((reply) => (
            <CommentThread
              key={reply.id}
              comment={reply}
              postId={postId}
              onReplyClick={onReplyClick}
              onReplySubmit={onReplySubmit}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};
