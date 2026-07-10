#!/bin/bash

# Production Setup Script for My Shop
# This script prepares your application for deployment

set -e

echo "🚀 My Shop Production Setup"
echo "================================"
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "❌ Git not initialized. Run: git init"
    exit 1
fi

echo "✅ Git repository found"

# Check if all required files exist
echo "📋 Checking project files..."
required_files=(
    "package.json"
    "next.config.mjs"
    "tsconfig.json"
    "tailwind.config.ts"
    "prisma/schema.prisma"
    ".env.example"
    "vercel.json"
)

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Missing: $file"
        exit 1
    fi
done

echo "✅ All required files present"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo ""
echo "🔧 Generating Prisma client..."
npm run prisma:generate

# Build the application
echo ""
echo "🔨 Building application..."
npm run build

# Type check
echo ""
echo "✓ Running type checks..."
npm run type-check

echo ""
echo "✅ Production setup complete!"
echo ""
echo "Next steps:"
echo "1. Push to GitHub:"
echo "   git push -u origin main"
echo ""
echo "2. Go to https://vercel.com"
echo "3. Import your GitHub repository"
echo "4. Add environment variables (see .env.example)"
echo "5. Deploy!"
echo ""
echo "For detailed instructions, see DEPLOYMENT_GUIDE.md"
