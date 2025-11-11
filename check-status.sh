#!/bin/bash

# Check Status Script
# Quick status check for MongoDB and server

echo "🔍 Blue Ocean Status Check"
echo "=========================="
echo ""

# Check MongoDB
if lsof -i :27017 > /dev/null 2>&1; then
  echo "✅ MongoDB: Running on port 27017"
else
  echo "❌ MongoDB: Not running"
  echo "   Start with: brew services start mongodb-community"
fi

# Check Server
if lsof -i :3001 > /dev/null 2>&1; then
  PID=$(lsof -ti :3001 | head -1)
  echo "✅ Server: Running on port 3001 (PID: $PID)"
  
  # Test server health
  if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
    echo "✅ Server Health: Responding"
  else
    echo "⚠️  Server Health: Not responding (may be starting up)"
  fi
else
  echo "❌ Server: Not running"
  echo "   Start with: npm run server"
fi

echo ""

# Check database connection
if lsof -i :27017 > /dev/null 2>&1 && lsof -i :3001 > /dev/null 2>&1; then
  echo "📊 Database Status:"
  node -e "
    import('mongoose').then(async (mongoose) => {
      try {
        await mongoose.default.connect('mongodb://localhost:27017/blueocean', { serverSelectionTimeoutMS: 2000 });
        const Product = mongoose.default.model('Product', new mongoose.default.Schema({}, { strict: false }));
        const Service = mongoose.default.model('Service', new mongoose.default.Schema({}, { strict: false }));
        const products = await Product.countDocuments();
        const services = await Service.countDocuments();
        console.log('   Products:', products);
        console.log('   Services:', services);
        await mongoose.default.disconnect();
      } catch (e) {
        console.log('   ⚠️  Could not connect to database');
      }
    });
  " 2>/dev/null || echo "   ⚠️  Could not check database"
fi

echo ""
echo "✅ Status check complete"

