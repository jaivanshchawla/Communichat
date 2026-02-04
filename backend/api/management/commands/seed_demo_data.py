"""
Management command to seed demo data for PLAYTO
"""
from django.core.management.base import BaseCommand
from api.models import User, Post, Comment, PostLike, CommentLike


class Command(BaseCommand):
    help = 'Seed demo data for PLAYTO community feed'

    def handle(self, *args, **options):
        # Clear existing data
        User.objects.all().delete()
        Post.objects.all().delete()
        Comment.objects.all().delete()
        PostLike.objects.all().delete()
        CommentLike.objects.all().delete()
        
        # Create demo users
        demo_users = [
            {
                'email': 'demo@playto.app',
                'username': 'demo_user',
                'first_name': 'Demo',
                'last_name': 'User',
                'clerk_id': 'user_demo123'
            },
            {
                'email': 'alice@playto.app',
                'username': 'alice_wonderland',
                'first_name': 'Alice',
                'last_name': 'Wonderland',
                'clerk_id': 'user_alice456'
            },
            {
                'email': 'bob@playto.app',
                'username': 'bob_builder',
                'first_name': 'Bob',
                'last_name': 'Builder',
                'clerk_id': 'user_bob789'
            },
        ]
        
        users = []
        for user_data in demo_users:
            user = User.objects.create_user(password='demopass123', **user_data)
            users.append(user)
            self.stdout.write(self.style.SUCCESS(f'Created user: {user.email}'))
        
        # Create demo posts
        demo_posts = [
            {
                'author': users[0],
                'title': '🚀 Welcome to PLAYTO Community',
                'content': 'This is the first post in our amazing community feed! Built with Django, React, Clerk auth, and Supabase. Let\'s share awesome content and connect with fellow creators!'
            },
            {
                'author': users[1],
                'title': '💡 Tips for Building Great Products',
                'content': 'I\'ve been working on products for 5 years now. Here are my top 3 tips:\n1. Listen to your users\n2. Iterate quickly\n3. Focus on core features first\n\nWhat are your tips?'
            },
            {
                'author': users[2],
                'title': '🎨 Design Inspiration from Nature',
                'content': 'Just published my latest design project inspired by natural patterns. The combination of colors and shapes creates an amazing visual experience. Check it out and let me know what you think!'
            },
            {
                'author': users[0],
                'title': '🔥 New Feature: Real-time Comments',
                'content': 'Excited to announce real-time comment updates on PLAYTO! Now you can see comments from other users instantly as they appear. No need to refresh the page anymore.'
            },
        ]
        
        posts = []
        for post_data in demo_posts:
            post = Post.objects.create(**post_data)
            posts.append(post)
            self.stdout.write(self.style.SUCCESS(f'Created post: {post.title}'))
        
        # Create demo comments
        demo_comments = [
            {
                'post': posts[0],
                'author': users[1],
                'content': 'Awesome! This is exactly what I was looking for. Great work on the setup!'
            },
            {
                'post': posts[0],
                'author': users[2],
                'content': 'Love the clean design and smooth UX. Can\'t wait to share more content here.'
            },
            {
                'post': posts[1],
                'author': users[0],
                'content': 'These are gold! Especially the point about iterating quickly. That\'s what made our product successful.'
            },
            {
                'post': posts[1],
                'author': users[2],
                'content': 'Following this advice for my next project. Thanks for sharing!'
            },
            {
                'post': posts[2],
                'author': users[1],
                'content': 'The natural patterns are stunning! How long did this take to create?'
            },
            {
                'post': posts[3],
                'author': users[1],
                'content': 'Real-time updates! This is game-changing. Makes collaboration so much better.'
            },
        ]
        
        comments = []
        for comment_data in demo_comments:
            comment = Comment.objects.create(**comment_data)
            comments.append(comment)
            self.stdout.write(self.style.SUCCESS(f'Created comment on {comment.post.title}'))
        
        # Create demo likes
        like_data = [
            {'user': users[1], 'post': posts[0]},
            {'user': users[2], 'post': posts[0]},
            {'user': users[0], 'post': posts[1]},
            {'user': users[2], 'post': posts[1]},
            {'user': users[1], 'post': posts[2]},
            {'user': users[0], 'post': posts[3]},
        ]
        
        for data in like_data:
            PostLike.objects.create(**data)
        
        # Create comment likes
        comment_like_data = [
            {'user': users[2], 'comment': comments[0]},
            {'user': users[0], 'comment': comments[1]},
            {'user': users[1], 'comment': comments[2]},
            {'user': users[2], 'comment': comments[4]},
        ]
        
        for data in comment_like_data:
            CommentLike.objects.create(**data)
        
        self.stdout.write(self.style.SUCCESS('✅ Demo data seeded successfully!'))
        self.stdout.write(self.style.WARNING(f'Created {len(users)} users, {len(posts)} posts, {len(comments)} comments, {len(like_data)} post likes'))
