"""
Management command to seed demo data for PLAYTO
"""
from django.core.management.base import BaseCommand
from api.models import User, Post, Comment, PostLike, CommentLike


class Command(BaseCommand):
    help = 'Seed demo data for PLAYTO community feed'

    def handle(self, *args, **options):
        # Clear existing data
        self.stdout.write('Cleaning up old data...')
        User.objects.all().delete()
        Post.objects.all().delete()
        Comment.objects.all().delete()
        PostLike.objects.all().delete()
        CommentLike.objects.all().delete()
        
        # Create varied demo users (15 profiles)
        demo_users = [
            {'email': 'alice@playto.app', 'username': 'alice_w', 'first_name': 'Alice', 'last_name': 'Wonder', 'clerk_id': 'user_alice001'},
            {'email': 'bob@playto.app', 'username': 'bob_builds', 'first_name': 'Bob', 'last_name': 'Builder', 'clerk_id': 'user_bob002'},
            {'email': 'charlie@playto.app', 'username': 'code_charlie', 'first_name': 'Charlie', 'last_name': 'Dev', 'clerk_id': 'user_charlie003'},
            {'email': 'diana@playto.app', 'username': 'design_diana', 'first_name': 'Diana', 'last_name': 'Prince', 'clerk_id': 'user_diana004'},
            {'email': 'evan@playto.app', 'username': 'evan_flows', 'first_name': 'Evan', 'last_name': 'You', 'clerk_id': 'user_evan005'},
            {'email': 'fiona@playto.app', 'username': 'fiona_front', 'first_name': 'Fiona', 'last_name': 'Stack', 'clerk_id': 'user_fiona006'},
            {'email': 'george@playto.app', 'username': 'git_george', 'first_name': 'George', 'last_name': 'Branch', 'clerk_id': 'user_george007'},
            {'email': 'hannah@playto.app', 'username': 'hannah_hacks', 'first_name': 'Hannah', 'last_name': 'Montana', 'clerk_id': 'user_hannah008'},
            {'email': 'ian@playto.app', 'username': 'ian_infra', 'first_name': 'Ian', 'last_name': 'Ops', 'clerk_id': 'user_ian009'},
            {'email': 'julia@playto.app', 'username': 'julia_java', 'first_name': 'Julia', 'last_name': 'Roberts', 'clerk_id': 'user_julia010'},
            {'email': 'kevin@playto.app', 'username': 'kube_kevin', 'first_name': 'Kevin', 'last_name': 'Kubernetes', 'clerk_id': 'user_kevin011'},
            {'email': 'linda@playto.app', 'username': 'linux_linda', 'first_name': 'Linda', 'last_name': 'Torvalds', 'clerk_id': 'user_linda012'},
            {'email': 'mike@playto.app', 'username': 'mike_micro', 'first_name': 'Mike', 'last_name': 'Service', 'clerk_id': 'user_mike013'},
            {'email': 'nina@playto.app', 'username': 'node_nina', 'first_name': 'Nina', 'last_name': 'Node', 'clerk_id': 'user_nina014'},
            {'email': 'oscar@playto.app', 'username': 'oscar_open', 'first_name': 'Oscar', 'last_name': 'Source', 'clerk_id': 'user_oscar015'},
        ]
        
        users = []
        for user_data in demo_users:
            user = User.objects.create_user(password='demopass123', **user_data)
            users.append(user)
            # self.stdout.write(f'User created: {user.username}')
        
        self.stdout.write(self.style.SUCCESS(f'Created {len(users)} users'))

        # Topics and content templates
        topics = [
            ("Thinking about switching to Rust", "I've been a C++ dev for 10 years, but the memory safety guarantees of Rust are calling me. Has anyone made the switch recently? What was the hardest part?"),
            ("Why I love Tailwind CSS", "Unpopular opinion maybe, but utility classes invoke joy. Once you memorize the syntax, you never leave your HTML. My productivity has doubled."),
            ("Microfrontends: A mistake?", "We split our app into 20 microfrontends and now deployment is a nightmare. Is the complexity worth the isolation? Needed a rant."),
            ("The state of AI agents", "Just tried the latest models. They can write decent boilerplate but struggle with complex system architecture. We are safe... for now."),
            ("Best mechanical keyboard switches?", "Clicky blues or linear reds? My coworkers hate the clicky ones but I type faster. Help me decide."),
            ("Deploying on Friday", "Just pushed to prod. Wish me luck. 🍺"),
            ("Understanding OAuth2 flow", " spent 4 hours debugging a redirect loop. The spec is dry but necessary reading. Anyone have a good simplified guide?"),
            ("Remote work vs Office", "My company is asking us to return to office 3 days a week. I've been remote for 4 years and love it. Time to look for a new job?"),
            ("Docker optimization tips", "Reduced our image size from 1.2GB to 80MB using multi-stage builds and Alpine. Feels good man."),
            ("Javascript fatigue is real", "Every week there is a new framework. Can we just agree on one for 5 years please?"),
            ("SQL vs NoSQL in 2024", "With modern Postgres JSONB support, is there still a strong case for Mongo for general purpose apps? Discuss."),
            ("Dark mode design patterns", "Creating a dark mode isn't just inverting colors. You need to adjust saturation and contrast. Setup a design system first!"),
            ("Vim or Emacs?", "Starting a war in the comments. I use VS Code with Vim bindings. Best of both worlds."),
            ("Junior Dev advice", "Don't be afraid to ask questions. We'd rather you ask than spend 3 days stuck on a config issue."),
            ("Coffee Setup", "Aeropress is the superior brewing method. Fight me."),
            ("Kubernetes is complexity", "Do you really need K8s for your startup with 100 users? Probably not. Stick to a PaaS."),
            ("Typescript strict mode", "Enabling strict null checks revealed 400 errors in our legacy codebase. It's going to be a long week."),
            ("WebAssembly future", "Wasm is moving fast. Blazor, Rust for web... the browser is becoming a true OS."),
            ("CSS Grid vs Flexbox", "Flex for 1D, Grid for 2D. It's not one or the other, use both!"),
            ("Imposter Syndrome", "15 years in the industry and I still Google how to center a div. It's normal folks."),
            ("Code Reviews", "Please stop nitpicking formatting in PRs. Use Prettier and focus on logic/architecture."),
            ("Serverless costs", "Our Lambda bill exploded because of a recursive loop. Set up your billing alerts!"),
            ("GraphQL caching", "Caching at the edge with GraphQL is tricky compared to REST. Any recommended patterns?"),
            ("Svelte 5 runes", "The new reactivity model look interesting. Less magic, more explicit. I like it."),
            ("Open Source contributing", "Want to contribute but don't know where to start? Documentation fixes are a great entry point!"),
            ("Burnout is real", "Take your PTO. Your health is more important than the sprint goal."),
            ("Clean Code", "Read 'Clean Code' again. Functions should do one thing and do it well."),
            ("Legacy Code Refactoring", "Strangler Fig pattern is your friend. Don't rewrite from scratch unless necessary."),
            ("Testing strategies", "Unit tests are fast, E2E are slow but realistic. Aim for the testing pyramid."),
            ("Developer Experience (DX)", "Good docs and fast build times make happy developers. Invest in your internal tooling."),
            ("API Design first", "Write the OpenAPI spec before writing code. It forces you to think about the interface."),
            ("Windows for Dev", "WSL2 has made Windows a viable dev machine again. I'm actually impressed."),
            ("Linux Distro hopping", "I use Arch btw. (Just kidding, Ubuntu LTS for stability)."),
            ("Monitor setup", "One ultrawide or two monitors? I feels ultrawide helps with timeline based apps."),
            ("Standing desks", "Back pain gone after getting a standing desk. Highly recommend."),
            ("Podcast recommendations", "Syntax FM and Lex Fridman are my go-to for commute."),
            ("Reading technical books", "Blogs are great but books give you deep structured knowledge. Currently reading DDIA."),
            ("Mentorship", "Mentoring a junior dev has taught me more than I expected. Teaching reinforces learning."),
            ("Side projects", "I have 50 unfinished domains. One day one of them will ship."),
            ("Hackathons", "Great for networking but terrible for code quality. Fun weekend though!"),
            ("Git rebase vs merge", "Rebase for a clean linear history. Merge for preserving context. Discuss."),
            ("Env variables management", "Stop committing .env files! Use a secrets manager."),
            ("CI/CD Pipelines", "If it's not automated, it's not done. Github Actions is so powerful now."),
            ("Networking", "Your network is your net worth. Go to meetups!"),
            ("Soft skills", "Coding is the easy part. Communication is the hard part."),
            ("Dependency Hell", "npm install downloaded the internet. node_modules is the heaviest object in the universe."),
            ("Browser DevTools", "Console.log is fine, but have you tried the debugger properly?"),
            ("Accessibility (a11y)", "It's not an overlay. Check your contrast ratios and semantic HTML."),
            ("SEO for SPA", "SSR is almost mandatory for SEO these days. Next.js/Nuxt handling it well."),
            ("State Management", "Redux, Zustand, Context? Keep it simple until you can't."),
        ]

        import random
        
        posts = []
        # Generate 50 posts
        for i in range(50):
            topic = topics[i]
            author = random.choice(users)
            post = Post.objects.create(
                author=author,
                title=topic[0],
                content=topic[1]
            )
            posts.append(post)
        
        self.stdout.write(self.style.SUCCESS(f'Created {len(posts)} posts'))

        # Generate comments (avg 3 per post)
        comments = []
        comment_texts = [
            "Totally agree!", "Interesting perspective.", "I ran into this last week.", 
            "Thanks for sharing.", "Could you elaborate?", "Do you have a source for this?",
            "This saved my day.", "Great tip!", "I prefer the alternative approach.",
            "Wow, never thought of it that way.", "Same here.", "LOL true.",
            "Can we connect to discuss this?", "Bookmark this.", "Well said.",
            "I disagree respectfully.", "This is the way.", "Underrated advice.",
            "Top tier content.", "Keep it up!"
        ]

        for post in posts:
            num_comments = random.randint(0, 8)
            for _ in range(num_comments):
                author = random.choice(users)
                text = random.choice(comment_texts)
                # Randomly make longer comments
                if random.random() > 0.7:
                    text += " " + random.choice(comment_texts)
                
                comment = Comment.objects.create(
                    post=post,
                    author=author,
                    content=text
                )
                comments.append(comment)

        self.stdout.write(self.style.SUCCESS(f'Created {len(comments)} comments'))

        # Generate Likes
        # Posts
        post_likes_count = 0
        for post in posts:
            # 30% chance of being viral (many likes), else few likes
            if random.random() > 0.8:
                num_likes = random.randint(5, 15)
            else:
                num_likes = random.randint(0, 5)
            
            likers = random.sample(users, num_likes)
            for liker in likers:
                PostLike.objects.create(user=liker, post=post)
                post_likes_count += 1
        
        self.stdout.write(self.style.SUCCESS(f'Created {post_likes_count} post likes'))
        
        # Comment Likes
        comment_likes_count = 0
        for comment in comments:
            if random.random() > 0.5:
                liker = random.choice(users)
                CommentLike.objects.create(user=liker, comment=comment)
                comment_likes_count += 1
                
        self.stdout.write(self.style.SUCCESS(f'Created {comment_likes_count} comment likes'))
        self.stdout.write(self.style.SUCCESS('✅ Database seeded successfully!'))
