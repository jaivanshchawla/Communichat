from django.contrib import admin
from .models import User, Post, Comment, PostLike, CommentLike


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['email', 'username', 'clerk_id', 'created_at']
    search_fields = ['email', 'username', 'clerk_id']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'created_at']
    search_fields = ['title', 'content', 'author__email']
    readonly_fields = ['created_at', 'updated_at']
    list_filter = ['created_at']


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['post', 'author', 'created_at']
    search_fields = ['content', 'author__email', 'post__title']
    readonly_fields = ['created_at', 'updated_at']
    list_filter = ['created_at']


@admin.register(PostLike)
class PostLikeAdmin(admin.ModelAdmin):
    list_display = ['user', 'post', 'created_at']
    search_fields = ['user__email', 'post__title']
    list_filter = ['created_at']


@admin.register(CommentLike)
class CommentLikeAdmin(admin.ModelAdmin):
    list_display = ['user', 'comment', 'created_at']
    search_fields = ['user__email', 'comment__content']
    list_filter = ['created_at']
