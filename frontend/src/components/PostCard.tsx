import React, { useState } from 'react';
import { api } from '../api';
import { CommentThread } from './CommentThread';

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
  comments?: Comment[];
  created_at: string;
}

interface PostCardProps {
  post: Post;
  onLike: (postId: number) => void;
  isLiked?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  isLiked = false,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [comments, setComments] = useState<Comment[]>(post.comments || []);

  const authorName = `${post.author.first_name} ${post.author.last_name}`.trim() || post.author.email;
  const authorInitial = post.author.email.charAt(0).toUpperCase();
  const createdAt = new Date(post.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    try {
      setIsSubmittingReply(true);
      const response = await api.createComment({
        post: post.id,
        content: replyContent,
      } as any);
      setComments([response.data, ...comments]);
      setReplyContent('');
    } catch (error) {
      console.error('Failed to post comment:', error);
      alert('Failed to post comment');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  return (
    <article className="bg-base-100 border border-base-300 rounded-xl p-6 hover:shadow-md transition-all duration-200 hover:border-base-400">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="avatar placeholder">
            <div className="bg-gradient-to-br from-primary to-secondary text-primary-content rounded-full w-10">
              <span className="text-xs font-bold">{authorInitial}</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">{authorName}</p>
            <p className="text-xs opacity-50">{createdAt}</p>
          </div>
        </div>
      </div>

      {/* Title & Content */}
      <div className="mb-5">
        <h2 className="text-lg font-bold mb-2 leading-snug">{post.title}</h2>
        <p className="text-sm leading-relaxed opacity-90">{post.content}</p>
      </div>

      {/* Engagement Stats */}
      <div className="flex items-center gap-4 text-xs opacity-60 mb-4 pb-4 border-b border-base-300">
        <span>👍 {post.likes_count} {post.likes_count === 1 ? 'like' : 'likes'}</span>
        <span>💬 {post.comments_count} {post.comments_count === 1 ? 'comment' : 'comments'}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 justify-start flex-wrap">
        <button
          onClick={() => onLike(post.id)}
          className={`btn btn-sm rounded-lg font-medium transition-all ${
            isLiked 
              ? 'btn-primary text-primary-content' 
              : 'btn-ghost border border-base-300 hover:border-primary hover:text-primary'
          }`}
          disabled={isLiked}
        >
          {isLiked ? '👍 Liked' : '👍 Like'}
        </button>
        <button 
          onClick={() => setShowComments(!showComments)}
          className="btn btn-sm btn-ghost border border-base-300 rounded-lg font-medium hover:border-secondary hover:text-secondary transition-all"
        >
          💬 {showComments ? 'Close' : 'Reply'}
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-6 pt-6 border-t border-base-300 space-y-4">
          <h3 className="font-bold text-sm">Comments ({comments.length})</h3>

          {/* New Comment Form */}
          <form onSubmit={handleCommentSubmit} className="space-y-3">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Share your thoughts..."
              className="textarea textarea-bordered w-full text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              rows={2}
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setReplyContent('')}
                className="btn btn-sm btn-ghost rounded-lg"
                disabled={isSubmittingReply}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-sm btn-primary rounded-lg font-medium"
                disabled={isSubmittingReply || !replyContent.trim()}
              >
                {isSubmittingReply ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Posting...
                  </>
                ) : (
                  'Post'
                )}
              </button>
            </div>
          </form>

          {/* Comments Thread */}
          <div className="space-y-3 mt-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <CommentThread
                  key={comment.id}
                  comment={comment}
                  postId={post.id}
                  depth={0}
                />
              ))
            ) : (
              <p className="text-sm opacity-50 text-center py-4">No comments yet. Be the first to share!</p>
            )}
          </div>
        </div>
      )}
    </article>
  );
};
