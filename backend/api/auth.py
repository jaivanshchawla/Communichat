"""
Clerk JWT Authentication for Django REST Framework
"""
import json
import requests
from django.conf import settings
from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed
import jwt
from jwt import PyJWKClient


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
        """
        Verify the Clerk JWT token.
        """
        try:
            # Get the JWKS URL from settings
            jwks_url = settings.CLERK_JWT_KEY
            issuer = settings.CLERK_JWT_ISSUER

            # Fetch and verify the token using JWKS
            if jwks_url.endswith('/.well-known/jwks.json'):
                # Use PyJWKClient to verify the token
                signing_key = PyJWKClient(jwks_url).get_signing_key_from_jwt(token)
                payload = jwt.decode(
                    token,
                    signing_key.key,
                    algorithms=['RS256'],
                    audience=None,
                    options={'verify_aud': False}
                )
            else:
                # Fallback: decode without verification (not recommended for production)
                payload = jwt.decode(token, options={"verify_signature": False})

            # Verify issuer
            if payload.get('iss') != issuer:
                raise AuthenticationFailed('Invalid token issuer.')

            # Extract user info from token
            # The 'email' is in the 'email_addresses' array or 'sub' contains the Clerk user ID
            user_id = payload.get('sub')
            email = payload.get('email') or self._extract_email_from_token(payload)

            if not user_id:
                raise AuthenticationFailed('No user ID in token.')

            return (user_id, token)

        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has expired.')
        except jwt.InvalidTokenError as e:
            raise AuthenticationFailed(f'Invalid token: {str(e)}')
        except Exception as e:
            raise AuthenticationFailed(f'Authentication failed: {str(e)}')

    def _extract_email_from_token(self, payload):
        """
        Extract email from Clerk token payload.
        """
        # Try different possible locations for email in Clerk token
        email = payload.get('email')
        if email:
            return email

        # Check email_addresses array if present
        email_addresses = payload.get('email_addresses', [])
        if email_addresses and isinstance(email_addresses, list):
            return email_addresses[0].get('email') if isinstance(email_addresses[0], dict) else email_addresses[0]

        return None
