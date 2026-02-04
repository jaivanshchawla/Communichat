"""
API URL Configuration
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .views import UserViewSet, PostViewSet, CommentViewSet, PostLikeViewSet, CommentLikeViewSet


class HealthCheckView(APIView):
    """Public health check endpoint"""
    permission_classes = []
    
    def get(self, request):
        return Response({
            "status": "ok",
            "message": "PLAYTO Community Feed API",
            "version": "1.0",
            "endpoints": {
                "posts": "/api/posts/",
                "comments": "/api/comments/",
                "users": "/api/users/",
            }
        }, status=status.HTTP_200_OK)


router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'posts', PostViewSet, basename='post')
router.register(r'comments', CommentViewSet, basename='comment')
router.register(r'post-likes', PostLikeViewSet, basename='post-like')
router.register(r'comment-likes', CommentLikeViewSet, basename='comment-like')

urlpatterns = [
    path('', HealthCheckView.as_view(), name='api-health'),
    path('', include(router.urls)),
]
