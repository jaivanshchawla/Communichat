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
            {
                'email': 'charlie@playto.app',
                'username': 'charlie_coder',
                'first_name': 'Charlie',
                'last_name': 'Coder',
                'clerk_id': 'user_charlie101'
            },
            {
                'email': 'diana@playto.app',
                'username': 'diana_designer',
                'first_name': 'Diana',
                'last_name': 'Designer',
                'clerk_id': 'user_diana202'
            },
            {
                'email': 'eve@playto.app',
                'username': 'eve_innovator',
                'first_name': 'Eve',
                'last_name': 'Innovator',
                'clerk_id': 'user_eve303'
            },
            {
                'email': 'frank@playto.app',
                'username': 'frank_founder',
                'first_name': 'Frank',
                'last_name': 'Founder',
                'clerk_id': 'user_frank404'
            },
            {
                'email': 'grace@playto.app',
                'username': 'grace_guru',
                'first_name': 'Grace',
                'last_name': 'Guru',
                'clerk_id': 'user_grace505'
            },
            {
                'email': 'henry@playto.app',
                'username': 'henry_hacker',
                'first_name': 'Henry',
                'last_name': 'Hacker',
                'clerk_id': 'user_henry606'
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
                'title': '🚀 Welcome to PLAYTO - The Future of Community',
                'content': 'Excited to join PLAYTO! This platform looks amazing with its clean UI and real-time updates. Can\'t wait to connect with the community and share ideas. Love the theme switcher too!'
            },
            {
                'author': users[1],
                'title': '💡 Top 5 Tips for Productive Development',
                'content': 'Here are my top 5 productivity tips after 10 years of development:\n1. Break work into small chunks\n2. Use version control religiously\n3. Write tests first\n4. Automate repetitive tasks\n5. Take breaks regularly\n\nWhich tip helps you the most?'
            },
            {
                'author': users[2],
                'title': '🎨 Design Inspiration from Nature',
                'content': 'Just published my latest project inspired by nature. The organic curves and natural color palettes create such a calming visual experience. I spent weeks researching natural patterns and integrating them into the UI. The results are amazing!'
            },
            {
                'author': users[3],
                'title': '🔥 The Power of Minimalist Design',
                'content': 'Less is more! Minimalist design isn\'t about being boring - it\'s about being intentional. Every element serves a purpose. Looking at PLAYTO\'s interface as a perfect example of modern minimalism.'
            },
            {
                'author': users[4],
                'title': '📱 Mobile-First Development Best Practices',
                'content': 'In 2024, mobile first is not optional. Our latest stats show 75% of users access services via mobile. Tips:\n- Design for touch\n- Optimize images\n- Minimize network requests\n- Use responsive layouts\n\nShare your mobile dev tips!'
            },
            {
                'author': users[5],
                'title': '🌟 Building a Successful Remote Team',
                'content': 'Managing a fully remote team of 15 people has been transformative. Clear communication, async-first culture, and celebrating wins together is key. Happy to share my playbook with anyone starting their remote journey.'
            },
            {
                'author': users[6],
                'title': '💻 The Evolution of Web Frameworks',
                'content': 'From jQuery to React to Vue to Svelte - the journey of JavaScript frameworks is fascinating. Each solved specific problems of their time. What\'s your favorite framework and why? Curious to hear from the community!'
            },
            {
                'author': users[7],
                'title': '🏆 How Gamification Boosts Engagement',
                'content': 'Just launched a gamification system in our app. Karma points, leaderboards, and badges increased user engagement by 300%! PLAYTO\'s approach with karma is brilliant. Who doesn\'t love seeing their name on the leaderboard?'
            },
            {
                'author': users[0],
                'title': '✨ Real-time Collaboration is the Future',
                'content': 'Saw Google Docs change the world with real-time collab. Now it\'s everywhere - from Figma to code editors. What\'s next? Voice-driven development? AI pair programming? Excited to see what\'s coming!'
            },
            {
                'author': users[2],
                'title': '🌈 Color Theory in Digital Products',
                'content': 'Color isn\'t just aesthetic - it\'s psychology! Different colors evoke different emotions. Blue = trust. Green = harmony. Red = urgency. PLAYTO\'s color system is perfectly thought out. Anyone want to discuss color theory?'
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
                'content': 'Welcome aboard! The community is super helpful and engaged. You\'ll love it here!'
            },
            {
                'post': posts[0],
                'author': users[3],
                'content': 'The theme switcher is chef\'s kiss! Finally a platform that respects dark mode 🌙'
            },
            {
                'post': posts[1],
                'author': users[0],
                'content': 'Writing tests first changed my life. Best decision I made as a developer!'
            },
            {
                'post': posts[1],
                'author': users[4],
                'content': 'Tip #2 is golden. Lost weeks of work until I started using Git properly.'
            },
            {
                'post': posts[2],
                'author': users[1],
                'content': 'The organic patterns are stunning! How long did this take to design?'
            },
            {
                'post': posts[2],
                'author': users[5],
                'content': 'This is exactly what our new product needed. Great inspiration!'
            },
            {
                'post': posts[3],
                'author': users[2],
                'content': 'Completely agree! Minimalism forces you to think about what\'s truly important.'
            },
            {
                'post': posts[3],
                'author': users[7],
                'content': 'PLAYTO itself is a masterclass in minimalist design. Every button, every color, intentional.'
            },
            {
                'post': posts[4],
                'author': users[3],
                'content': 'Mobile optimization is no longer a feature, it\'s a requirement. Great tips!'
            },
            {
                'post': posts[5],
                'author': users[0],
                'content': 'Async-first culture sounds amazing. How do you handle urgent issues?'
            },
            {
                'post': posts[6],
                'author': users[4],
                'content': 'React for me. JSX is just *chef\'s kiss* - perfect blend of JS and markup.'
            },
            {
                'post': posts[7],
                'author': users[6],
                'content': 'Gamification works because it taps into intrinsic motivation. Love how PLAYTO does it!'
            },
            {
                'post': posts[8],
                'author': users[1],
                'content': 'AI pair programming is coming sooner than we think. Copilot is just the beginning!'
            },
            {
                'post': posts[9],
                'author': users[5],
                'content': 'Color psychology is underrated in dev communities. Thanks for bringing this up!'
            },
        ]
        
        comments = []
        for comment_data in demo_comments:
            comment = Comment.objects.create(**comment_data)
            comments.append(comment)
            self.stdout.write(self.style.SUCCESS(f'Created comment on {comment.post.title}'))
        
        # Create threaded replies
        threaded_replies = [
            {
                'post': posts[0],
                'author': users[5],
                'content': 'The community has been nothing but supportive. Jump into any discussion!',
                'parent': comments[0]
            },
            {
                'post': posts[1],
                'author': users[3],
                'content': 'Definitely! Small increments keep motivation high too.',
                'parent': comments[2]
            },
            {
                'post': posts[5],
                'author': users[7],
                'content': 'Auto-escalation is the key. Define what\'s truly urgent vs important.',
                'parent': comments[9]
            },
        ]
        
        for reply_data in threaded_replies:
            comment = Comment.objects.create(**reply_data)
            comments.append(comment)
            self.stdout.write(self.style.SUCCESS(f'Created reply to comment on {comment.post.title}'))
        
        # Create demo post likes - more distributed
        like_data = [
            {'user': users[1], 'post': posts[0]},
            {'user': users[2], 'post': posts[0]},
            {'user': users[3], 'post': posts[0]},
            {'user': users[0], 'post': posts[1]},
            {'user': users[2], 'post': posts[1]},
            {'user': users[4], 'post': posts[1]},
            {'user': users[1], 'post': posts[2]},
            {'user': users[4], 'post': posts[2]},
            {'user': users[5], 'post': posts[2]},
            {'user': users[2], 'post': posts[3]},
            {'user': users[5], 'post': posts[3]},
            {'user': users[6], 'post': posts[3]},
            {'user': users[3], 'post': posts[4]},
            {'user': users[6], 'post': posts[4]},
            {'user': users[0], 'post': posts[5]},
            {'user': users[1], 'post': posts[5]},
            {'user': users[4], 'post': posts[6]},
            {'user': users[6], 'post': posts[6]},
            {'user': users[2], 'post': posts[7]},
            {'user': users[7], 'post': posts[7]},
            {'user': users[0], 'post': posts[8]},
            {'user': users[3], 'post': posts[8]},
            {'user': users[5], 'post': posts[9]},
            {'user': users[7], 'post': posts[9]},
        ]
        
        for data in like_data:
            PostLike.objects.create(**data)
        
        # Create comment likes
        comment_like_data = [
            {'user': users[2], 'comment': comments[0]},
            {'user': users[0], 'comment': comments[1]},
            {'user': users[1], 'comment': comments[2]},
            {'user': users[2], 'comment': comments[4]},
            {'user': users[5], 'comment': comments[5]},
            {'user': users[3], 'comment': comments[6]},
            {'user': users[4], 'comment': comments[7]},
            {'user': users[1], 'comment': comments[8]},
            {'user': users[6], 'comment': comments[10]},
            {'user': users[2], 'comment': comments[11]},
            {'user': users[0], 'comment': comments[12]},
            {'user': users[3], 'comment': comments[13]},
        ]
        
        for data in comment_like_data:
            CommentLike.objects.create(**data)
        
        self.stdout.write(self.style.SUCCESS('✅ Demo data seeded successfully!'))
        self.stdout.write(self.style.WARNING(f'Created {len(users)} users, {len(posts)} posts, {len(comments)} comments, {len(like_data)} post likes, {len(comment_like_data)} comment likes'))
