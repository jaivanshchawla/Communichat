import React from 'react';

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
  isLiked?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  isLiked = false,
}) => {
  const authorName = `${post.author.first_name} ${post.author.last_name}`.trim() || post.author.email;
  const createdAt = new Date(post.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

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
          <button className="btn btn-sm btn-outline gap-2">
            💬 {post.comments_count}
          </button>
        </div>
      </div>
    </div>
  );
};
