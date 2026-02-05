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
    <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
      <div className="card-body">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="avatar placeholder">
              <div className="bg-primary text-primary-content rounded-full w-10">
                <span className="text-sm font-bold">
                  {post.author.email.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div>
              <p className="font-semibold">{authorName}</p>
              <p className="text-xs opacity-60">{createdAt}</p>
            </div>
          </div>
        </div>

        {/* Title & Content */}
        <h2 className="card-title text-lg mt-2">{post.title}</h2>
        <p className="text-base leading-relaxed">{post.content}</p>

        {/* Actions */}
        <div className="card-actions justify-start mt-4 gap-3">
          <button
            onClick={() => onLike(post.id)}
            className={`btn btn-sm gap-2 ${
              isLiked 
                ? 'btn-primary' 
                : 'btn-outline'
            }`}
          >
            👍 {post.likes_count}
          </button>
          <button 
            onClick={() => setShowComments(!showComments)}
            className="btn btn-sm btn-outline gap-2"
          >
            💬 {post.comments_count}
          </button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-6 pt-4 border-t border-base-300">
            <h3 className="font-bold mb-4">Comments ({comments.length})</h3>

            {/* New Comment Form */}
            <form onSubmit={handleCommentSubmit} className="mb-4 p-3 bg-base-200 rounded-lg">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Add a comment..."
                className="textarea textarea-bordered w-full text-sm"
                rows={2}
              />
              <div className="flex gap-2 justify-end mt-2">
                <button
                  type="button"
                  onClick={() => setReplyContent('')}
                  className="btn btn-sm btn-ghost"
                  disabled={isSubmittingReply}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-sm btn-primary"
                  disabled={isSubmittingReply || !replyContent.trim()}
                >
                  {isSubmittingReply ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Posting...
                    </>
                  ) : (
                    'Post Comment'
                  )}
                </button>
              </div>
            </form>

            {/* Comments Thread */}
            <div className="space-y-2">
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
                <p className="text-sm opacity-60">No comments yet</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
