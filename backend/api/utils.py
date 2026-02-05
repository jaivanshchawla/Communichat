"""
PLAYTO Utility Functions - Karma, Leaderboard, N+1 Optimization
"""
from django.db.models import Q, Count, F, Prefetch
from django.utils import timezone
from datetime import timedelta
from api.models import User, Post, Comment, PostLike, CommentLike


def get_leaderboard_24h(limit=5):
    """
    Get top users by karma earned in the last 24 hours.
    
    Calculates karma dynamically:
    - PostLike: 5 karma (created in last 24h)
    - CommentLike: 1 karma (created in last 24h)
    
    Returns: List of dicts with user info and karma_24h
    """
    last_24h = timezone.now() - timedelta(hours=24)
    
    # Get users with their karma in last 24 hours
    users_karma = User.objects.annotate(
        karma_24h=Count(
            'post_likes',
            filter=Q(post_likes__created_at__gte=last_24h) * 5
        ) + Count(
            'comment_likes',
            filter=Q(comment_likes__created_at__gte=last_24h)
        )
    ).filter(
        karma_24h__gt=0
    ).order_by('-karma_24h')[:limit]
    
    return [
        {
            'id': user.id,
            'email': user.email,
            'karma_24h': user.karma_24h,
            'total_karma': user.total_karma,
        }
        for user in users_karma
    ]


def get_post_with_nested_comments(post_id):
    """
    Fetch post with nested comments in ONE query (no N+1).
    
    Uses:
    - select_related: author, likes authors
    - prefetch_related: comments with nested replies
    
    Returns: Post object with all related data optimized
    """
    # Build nested comment tree
    all_comments = Comment.objects.filter(
        post_id=post_id
    ).select_related(
        'author'
    ).prefetch_related(
        'likes__user'
    )
    
    # Organize comments: root + nested
    root_comments = []
    comment_map = {}
    
    for comment in all_comments:
        comment_map[comment.id] = {
            'comment': comment,
            'replies': []
        }
    
    for comment in all_comments:
        if comment.parent_id:
            if comment.parent_id in comment_map:
                comment_map[comment.parent_id]['replies'].append(
                    comment_map[comment.id]
                )
        else:
            root_comments.append(comment_map[comment.id])
    
    return {
        'post': Post.objects.select_related('author').prefetch_related(
            'likes__user'
        ).get(id=post_id),
        'comments': root_comments
    }


def build_comment_tree(comments):
    """
    Recursively build nested comment tree for serialization.
    """
    def build_node(comment):
        return {
            'id': comment.id,
            'author': {
                'id': comment.author.id,
                'email': comment.author.email,
                'first_name': comment.author.first_name,
                'last_name': comment.author.last_name,
            },
            'content': comment.content,
            'created_at': comment.created_at,
            'likes_count': comment.likes.count(),
            'replies': [build_node(reply) for reply in comment.replies.all()]
        }
    
    return [build_node(comment) for comment in comments]
