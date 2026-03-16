"""Clerk JWT Authentication for Django REST Framework."""
from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils.text import slugify
from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed
import jwt
from jwt import PyJWKClient

User = get_user_model()


class ClerkJWTAuthentication(TokenAuthentication):
    """
    Authenticate using Clerk JWT tokens.
    Expects Authorization header: Bearer <token>
    """

    keyword = 'Bearer'

    def authenticate(self, request):
        auth = request.META.get('HTTP_AUTHORIZATION', '').split()

        if not auth or auth[0].lower() != self.keyword.lower():
            return None

        if len(auth) == 1:
            msg = 'Invalid token header. No credentials provided.'
            raise AuthenticationFailed(msg)
        elif len(auth) > 2:
            msg = 'Invalid token header. Token string should not contain spaces.'
            raise AuthenticationFailed(msg)

        try:
            token = auth[1]
        except (IndexError, ValueError):
            raise AuthenticationFailed('Invalid token header.')

        return self.authenticate_credentials(token)

    def authenticate_credentials(self, token):
        """Verify the Clerk JWT token and resolve it to a Django user."""
        try:
            jwks_url = settings.CLERK_JWT_KEY
            issuer = settings.CLERK_JWT_ISSUER

            if jwks_url.endswith('/.well-known/jwks.json'):
                signing_key = PyJWKClient(jwks_url).get_signing_key_from_jwt(token)
                payload = jwt.decode(
                    token,
                    signing_key.key,
                    algorithms=['RS256'],
                    audience=None,
                    options={'verify_aud': False}
                )
            else:
                payload = jwt.decode(token, options={"verify_signature": False})

            if payload.get('iss') != issuer:
                raise AuthenticationFailed('Invalid token issuer.')

            user_id = payload.get('sub')
            email = payload.get('email') or self._extract_email_from_token(payload)
            first_name = payload.get('given_name') or payload.get('first_name') or ''
            last_name = payload.get('family_name') or payload.get('last_name') or ''

            if not user_id:
                raise AuthenticationFailed('No user ID in token.')

            user = self._get_or_create_user(
                clerk_id=user_id,
                email=email,
                first_name=first_name,
                last_name=last_name,
            )
            return (user, token)

        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has expired.')
        except jwt.InvalidTokenError as e:
            raise AuthenticationFailed(f'Invalid token: {str(e)}')
        except Exception as e:
            raise AuthenticationFailed(f'Authentication failed: {str(e)}')

    def _extract_email_from_token(self, payload):
        """Extract email from Clerk token payload."""
        email = payload.get('email')
        if email:
            return email

        email_addresses = payload.get('email_addresses', [])
        if email_addresses and isinstance(email_addresses, list):
            return email_addresses[0].get('email') if isinstance(email_addresses[0], dict) else email_addresses[0]

        return None

    def _get_or_create_user(self, clerk_id, email=None, first_name='', last_name=''):
        """Resolve Clerk identity to a Django user, creating one if needed."""
        user = User.objects.filter(clerk_id=clerk_id).first()
        if user is None and email:
            user = User.objects.filter(email=email).first()

        if user is None:
            username = self._build_username(email=email, clerk_id=clerk_id)
            user = User.objects.create_user(
                username=username,
                email=email or f'{clerk_id}@clerk.local',
                password=None,
                clerk_id=clerk_id,
                first_name=first_name,
                last_name=last_name,
            )
            user.set_unusable_password()
            user.save(update_fields=['password'])
            return user

        updated_fields = []
        if user.clerk_id != clerk_id:
            user.clerk_id = clerk_id
            updated_fields.append('clerk_id')
        if email and user.email != email:
            user.email = email
            updated_fields.append('email')
        if first_name and user.first_name != first_name:
            user.first_name = first_name
            updated_fields.append('first_name')
        if last_name and user.last_name != last_name:
            user.last_name = last_name
            updated_fields.append('last_name')
        if updated_fields:
            user.save(update_fields=updated_fields)
        return user

    def _build_username(self, email=None, clerk_id=''):
        """Generate a unique username for Clerk-backed users."""
        base = ''
        if email:
            base = email.split('@', 1)[0]
        if not base:
            base = f'user_{clerk_id[-12:]}' if clerk_id else 'user'

        username = slugify(base).replace('-', '_') or 'user'
        candidate = username
        suffix = 1
        while User.objects.filter(username=candidate).exists():
            candidate = f'{username}_{suffix}'
            suffix += 1
        return candidate
