#!/bin/bash
# Vercel Deployment Setup Script
# This script helps configure the frontend deployment on Vercel

echo "=== PLAYTO Community Feed - Vercel Frontend Deployment Setup ==="
echo ""
echo "This script will help you set up automated deployment for the frontend."
echo ""

# Check for Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found"
    echo ""
    echo "Install Vercel CLI:"
    echo "  npm install -g vercel"
    echo ""
    exit 1
fi

echo "✅ Vercel CLI is installed"
echo ""

# Login to Vercel
echo "Logging in to Vercel..."
vercel login

echo ""
echo "✅ Logged in to Vercel"
echo ""

# Link project
echo "Linking project to Vercel..."
cd frontend
vercel link

echo ""
echo "✅ Project linked to Vercel"
echo ""

# Instructions
echo "Next steps to configure environment variables:"
echo "1. Go to https://vercel.com/dashboard"
echo "2. Select your 'communichat' project"
echo "3. Go to Settings > Environment Variables"
echo "4. Add the following variables:"
echo ""
echo "   For Production:"
echo "   - VITE_API_URL: https://communichat-backend.onrender.com/api"
echo "   - VITE_CLERK_PUBLISHABLE_KEY: (from your Clerk dashboard)"
echo ""
echo "   For Development (.env.local):"
echo "   - VITE_API_URL: http://localhost:8000/api"
echo "   - VITE_CLERK_PUBLISHABLE_KEY: (from your Clerk dashboard)"
echo ""
echo "5. Redeploy: vercel --prod"
echo ""
echo "GitHub Actions Setup:"
echo "Add these secrets to your GitHub repository:"
echo "  - VERCEL_TOKEN: (Create from https://vercel.com/account/tokens)"
echo "  - VERCEL_ORG_ID: (From Vercel dashboard)"
echo "  - VERCEL_PROJECT_ID: (From Vercel dashboard)"
echo ""
echo "Then the GitHub Actions workflow will automatically deploy on every push!"
echo ""
