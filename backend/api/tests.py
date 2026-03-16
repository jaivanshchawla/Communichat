from django.test import TestCase
from django.conf import settings
from importlib.util import find_spec

from .models import User, Post, PostLike


class APISmokeTests(TestCase):
    """Basic tests to ensure core endpoints work."""

    def setUp(self):
        # Create users and a post with a like to ensure leaderboard returns data
        self.author = User.objects.create_user(
            username='author1',
            email='author1@playto.app',
            password='testpass123',
        )
        self.liker = User.objects.create_user(
            username='liker1',
            email='liker1@playto.app',
            password='testpass123',
        )
        self.post = Post.objects.create(
            author=self.author,
            title='Test post',
            content='Just a test.',
        )
        PostLike.objects.create(user=self.liker, post=self.post)

    def test_posts_list_returns_200(self):
        response = self.client.get('/api/posts/')
        self.assertEqual(response.status_code, 200)
        json = response.json()
        self.assertIn('results', json)
        self.assertGreaterEqual(json.get('count', 0), 1)

    def test_leaderboard_returns_karma(self):
        response = self.client.get('/api/leaderboard/')
        self.assertEqual(response.status_code, 200)
        json = response.json()
        self.assertIn('results', json)
        self.assertGreaterEqual(len(json['results']), 1)

        # Ensure the leaderboard includes karma for the author (5 points per like)
        self.assertTrue(any(item.get('karma_24h') == 5 for item in json['results']))

    def test_optional_whitenoise_does_not_break_settings(self):
        has_whitenoise = find_spec('whitenoise') is not None
        self.assertEqual(
            'whitenoise.middleware.WhiteNoiseMiddleware' in settings.MIDDLEWARE,
            has_whitenoise,
        )
