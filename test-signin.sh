#!/bin/bash

echo "🧪 Testing Sign-In Endpoint"
echo "============================"
echo ""

# Wait a moment for server to be ready
sleep 2

echo "Testing sign-in with owner credentials..."
echo ""

curl -X POST http://localhost:3001/api/auth/signin \
  -H 'Content-Type: application/json' \
  --data '{"email":"founder@blueocean.co","password":"blueocean2024"}' \
  2>&1 | python3 -m json.tool 2>/dev/null || curl -X POST http://localhost:3001/api/auth/signin \
  -H 'Content-Type: application/json' \
  --data '{"email":"founder@blueocean.co","password":"blueocean2024"}'

echo ""
echo ""
echo "✅ Test complete!"

