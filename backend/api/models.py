"""
PLAYTO API Models - User, Post, Comment, Likes
"""
from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """
    Custom User model linked to Clerk authentication.
    Stores email and optional clerk_id for identification.
    """
    email = models.EmailField(unique=True)
    clerk_id = models.CharField(max_length=255, unique=True, null=True, blank=True, 
                                 help_text="Clerk user ID for cross-system identification")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.email

    class Meta:
        ordering = ['-created_at']


class Post(models.Model):
    """
    Community feed post created by authenticated users.
    """
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    title = models.CharField(max_length=300)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} by {self.author.email}"

    class Meta:
        ordering = ['-created_at']


class Comment(models.Model):
    """
    Comments on posts.
    """
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Comment by {self.author.email} on {self.post.title}"

    class Meta:
        ordering = ['-created_at']


class PostLike(models.Model):
    """
    Likes on posts (one user can like a post once).
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='post_likes')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} likes {self.post.title}"


class CommentLike(models.Model):
    """
    Likes on comments (one user can like a comment once).
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comment_likes')
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'comment')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} likes comment by {self.comment.author.email}"
