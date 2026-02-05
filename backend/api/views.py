"""
PLAYTO API Views - REST Endpoints for Posts, Comments, Likes, Leaderboard
"""
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404
from django.db import transaction
from .models import User, Post, Comment, PostLike, CommentLike
from .serializers import (
    UserSerializer, PostSerializer, CommentSerializer, PostLikeSerializer, CommentLikeSerializer
)
from .utils import get_leaderboard_24h


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    User profile endpoints.
    GET /api/users/ - List all users
    GET /api/users/{id}/ - Get user details
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class PostViewSet(viewsets.ModelViewSet):
    """
    Post endpoints.
    GET /api/posts/ - List all posts
    POST /api/posts/ - Create a new post
    GET /api/posts/{id}/ - Get post details
    PUT /api/posts/{id}/ - Update post
    DELETE /api/posts/{id}/ - Delete post
    POST /api/posts/{id}/like/ - Like a post
    POST /api/posts/{id}/unlike/ - Unlike a post
    """
    queryset = Post.objects.all()
    pagination_class = StandardResultsSetPagination
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.action == 'create':
            return PostCreateSerializer
        elif self.action == 'retrieve':
            return PostDetailSerializer
        return PostSerializer

    def perform_create(self, serializer):
        """Set the author to the current user"""
        serializer.save(author=self.request.user)

    def perform_update(self, serializer):
        """Only allow author to update their own posts"""
        if self.get_object().author != self.request.user:
            raise permissions.PermissionDenied("You can only edit your own posts.")
        serializer.save()

    def perform_destroy(self, instance):
        """Only allow author to delete their own posts"""
        if instance.author != self.request.user:
            raise permissions.PermissionDenied("You can only delete your own posts.")
        instance.delete()

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def like(self, request, pk=None):
        """Like a post"""
        post = self.get_object()
        like, created = PostLike.objects.get_or_create(user=request.user, post=post)
        if created:
            return Response({'status': 'post liked'}, status=status.HTTP_201_CREATED)
        return Response({'status': 'already liked'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def unlike(self, request, pk=None):
        """Unlike a post"""
        post = self.get_object()
        try:
            like = PostLike.objects.get(user=request.user, post=post)
            like.delete()
            return Response({'status': 'post unliked'}, status=status.HTTP_200_OK)
        except PostLike.DoesNotExist:
            return Response({'error': 'post not liked'}, status=status.HTTP_404_NOT_FOUND)


class CommentViewSet(viewsets.ModelViewSet):
    """
    Comment endpoints.
    GET /api/comments/ - List all comments
    POST /api/comments/ - Create a new comment
    GET /api/comments/{id}/ - Get comment details
    PUT /api/comments/{id}/ - Update comment
    DELETE /api/comments/{id}/ - Delete comment
    POST /api/comments/{id}/like/ - Like a comment
    POST /api/comments/{id}/unlike/ - Unlike a comment
    """
    queryset = Comment.objects.all()
    pagination_class = StandardResultsSetPagination
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.action == 'create':
            return CommentCreateSerializer
        return CommentSerializer

    def perform_create(self, serializer):
        """Set the author to the current user"""
        serializer.save(author=self.request.user)

    def perform_update(self, serializer):
        """Only allow author to update their own comments"""
        if self.get_object().author != self.request.user:
            raise permissions.PermissionDenied("You can only edit your own comments.")
        serializer.save()

    def perform_destroy(self, instance):
        """Only allow author to delete their own comments"""
        if instance.author != self.request.user:
            raise permissions.PermissionDenied("You can only delete your own comments.")
        instance.delete()

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def like(self, request, pk=None):
        """Like a comment"""
        comment = self.get_object()
        like, created = CommentLike.objects.get_or_create(user=request.user, comment=comment)
        if created:
            return Response({'status': 'comment liked'}, status=status.HTTP_201_CREATED)
        return Response({'status': 'already liked'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def unlike(self, request, pk=None):
        """Unlike a comment"""
        comment = self.get_object()
        try:
            like = CommentLike.objects.get(user=request.user, comment=comment)
            like.delete()
            return Response({'status': 'comment unliked'}, status=status.HTTP_200_OK)
        except CommentLike.DoesNotExist:
            return Response({'error': 'comment not liked'}, status=status.HTTP_404_NOT_FOUND)


class PostLikeViewSet(viewsets.ReadOnlyModelViewSet):
    """Read-only endpoint for post likes (use /posts/{id}/like/ instead)"""
    queryset = PostLike.objects.all()
    serializer_class = PostLikeSerializer


class CommentLikeViewSet(viewsets.ReadOnlyModelViewSet):
    """Read-only endpoint for comment likes (use /comments/{id}/like/ instead)"""
    queryset = CommentLike.objects.all()
    serializer_class = CommentLikeSerializer


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def leaderboard_view(request):
    """
    GET /api/leaderboard/ - Top 5 users by 24-hour karma
    Returns user profile data with total_karma earned in last 24 hours
    """
    limit = int(request.query_params.get('limit', 5))
    limit = min(limit, 100)  # Cap at 100 for performance
    
    leaderboard_data = get_leaderboard_24h(limit=limit)
    
    return Response(
        {
            'count': len(leaderboard_data),
            'results': leaderboard_data
        },
        status=status.HTTP_200_OK
    )
