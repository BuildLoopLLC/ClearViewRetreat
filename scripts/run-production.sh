#!/bin/bash

echo "🚀 Building and running in production mode for better caching..."

# Build the application
echo "📦 Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "🚀 Starting production server..."
    echo "💡 This will have much better caching and fewer Firebase reads"
    npm start
else
    echo "❌ Build failed! Check the errors above."
    exit 1
fi
