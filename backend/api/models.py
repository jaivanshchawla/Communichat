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
    total_karma = models.IntegerField(default=0, help_text="Total karma from all time")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.email

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-total_karma']),
            models.Index(fields=['clerk_id']),
        ]


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
        indexes = [
            models.Index(fields=['author', '-created_at']),
            models.Index(fields=['-created_at']),
        ]


class Comment(models.Model):
    """
    Comments on posts with threading support (nested replies via parent_id).
    """
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    parent = models.ForeignKey(
        'self', 
        on_delete=models.CASCADE, 
        related_name='replies',
        null=True,
        blank=True,
        help_text="Parent comment for threaded replies"
    )
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Comment by {self.author.email} on {self.post.title}"

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['post', 'parent', '-created_at']),
            models.Index(fields=['author', '-created_at']),
        ]


class PostLike(models.Model):
    """
    Likes on posts (one user can like a post once).
    Karma: 5 points to author per like.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='post_likes')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['post', '-created_at']),
            models.Index(fields=['user', '-created_at']),
        ]

    def __str__(self):
        return f"{self.user.email} likes {self.post.title}"

    def save(self, *args, **kwargs):
        """Award karma to post author on first like."""
        is_new = self.pk is None
        super().save(*args, **kwargs)
        if is_new:
            self.post.author.total_karma += 5
            self.post.author.save(update_fields=['total_karma'])


class CommentLike(models.Model):
    """
    Likes on comments (one user can like a comment once).
    Karma: 1 point to comment author per like.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comment_likes')
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'comment')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['comment', '-created_at']),
            models.Index(fields=['user', '-created_at']),
        ]

    def __str__(self):
        return f"{self.user.email} likes comment by {self.comment.author.email}"

    def save(self, *args, **kwargs):
        """Award karma to comment author on first like."""
        is_new = self.pk is None
        super().save(*args, **kwargs)
        if is_new:
            self.comment.author.total_karma += 1
            self.comment.author.save(update_fields=['total_karma'])
