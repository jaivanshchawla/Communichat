"""
DRF Serializers for PLAYTO API
"""
from rest_framework import serializers
from .models import User, Post, Comment, PostLike, CommentLike


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'clerk_id', 'first_name', 'last_name', 'total_karma', 'created_at']
        read_only_fields = ['id', 'created_at', 'clerk_id', 'total_karma']


class CommentLikeSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = CommentLike
        fields = ['id', 'user_email', 'created_at']
        read_only_fields = ['id', 'created_at']


class NestedCommentSerializer(serializers.ModelSerializer):
    """
    Serializer for nested/threaded comments with replies.
    """
    author = UserSerializer(read_only=True)
    likes_count = serializers.SerializerMethodField()
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'author', 'content', 'likes_count', 'replies', 'created_at']
        read_only_fields = ['id', 'author', 'created_at']

    def get_likes_count(self, obj):
        return obj.likes.count()
    
    def get_replies(self, obj):
        """Recursively serialize child replies."""
        replies = obj.replies.all()
        return NestedCommentSerializer(replies, many=True).data


class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    likes_count = serializers.SerializerMethodField()
    likes = CommentLikeSerializer(many=True, read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'post', 'author', 'content', 'parent', 'likes_count', 'likes', 'created_at', 'updated_at']
        read_only_fields = ['id', 'author', 'created_at', 'updated_at']

    def get_likes_count(self, obj):
        return obj.likes.count()


class PostLikeSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = PostLike
        fields = ['id', 'user_email', 'created_at']
        read_only_fields = ['id', 'created_at']


class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    comments = NestedCommentSerializer(many=True, read_only=True)
    comments_count = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    likes = PostLikeSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'author', 'title', 'content', 'comments_count', 'likes_count', 'comments', 'likes', 'created_at', 'updated_at']
        read_only_fields = ['id', 'author', 'comments', 'likes', 'created_at', 'updated_at']

    def get_comments_count(self, obj):
        return obj.comments.count()

    def get_likes_count(self, obj):
        return obj.likes.count()


class PostDetailSerializer(PostSerializer):
    """Extended serializer with full nested details"""
    pass


class PostCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['title', 'content']

    def create(self, validated_data):
        # Author is set from the request user in the view
        return Post.objects.create(**validated_data)


class CommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['post', 'content', 'parent']

    def create(self, validated_data):
        # Author is set from the request user in the view
        return Comment.objects.create(**validated_data)
