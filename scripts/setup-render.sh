#!/bin/bash
# Render Deployment Setup Script
# This script helps configure the backend deployment on Render

echo "=== PLAYTO Community Feed - Render Backend Deployment Setup ==="
echo ""
echo "This script will help you set up automated deployment for the backend."
echo ""

# Check for Render API key
if [ -z "$RENDER_API_KEY" ]; then
    echo "❌ RENDER_API_KEY environment variable not set"
    echo ""
    echo "Steps to get your Render API key:"
    echo "1. Go to https://dashboard.render.com/api-tokens"
    echo "2. Create a new API token"
    echo "3. Copy the token"
    echo "4. Set it: export RENDER_API_KEY='your-token-here'"
    exit 1
fi

echo "✅ RENDER_API_KEY is configured"
echo ""

# Create render.yaml configuration
cat > render.yaml << 'EOF'
services:
  - type: web
    name: communichat-backend
    runtime: python
    pythonVersion: 3.12.1
    buildCommand: pip install -r requirements.txt
    startCommand: gunicorn playto_config.wsgi:application --bind 0.0.0.0:$PORT
    envVars:
      - key: DEBUG
        value: "False"
      - key: SECRET_KEY
        sync: false
      - key: DATABASE_URL
        sync: false
      - key: CLERK_SECRET_KEY
        sync: false
      - key: CORS_ALLOWED_ORIGINS
        value: "http://localhost:3000,http://localhost:5173"
    postgres:
      ipAllowList: []
EOF

echo "✅ Created render.yaml configuration"
echo ""

# Instructions
echo "Next steps:"
echo "1. Push render.yaml to GitHub: git add render.yaml && git commit -m 'Add Render config' && git push"
echo "2. Go to https://dashboard.render.com"
echo "3. Click 'New +' > 'Web Service'"
echo "4. Connect your GitHub repository (jaivanshchawla/Communichat)"
echo "5. Set the build command: pip install -r backend/requirements.txt"
echo "6. Set the start command: gunicorn playto_config.wsgi:application --bind 0.0.0.0:\$PORT"
echo "7. Add environment variables:"
echo "   - DEBUG: False"
echo "   - SECRET_KEY: (generate a new one)"
echo "   - DATABASE_URL: (will be provided by Render PostgreSQL)"
echo "   - CLERK_SECRET_KEY: (from your Clerk dashboard)"
echo "   - CORS_ALLOWED_ORIGINS: (your Vercel frontend URL)"
echo "8. Create a PostgreSQL database on Render"
echo "9. Deploy!"
echo ""
echo "For GitHub Actions automation, add these secrets to your repository:"
echo "  - RENDER_SERVICE_ID (from your Render service)"
echo "  - RENDER_API_KEY (your Render API token)"
echo ""
