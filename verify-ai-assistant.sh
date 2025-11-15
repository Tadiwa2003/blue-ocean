#!/bin/bash

echo "🎤 Verifying Marketplace AI Assistant Setup..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check 1: Component exists
echo "1️⃣  Checking component..."
if [ -f "src/components/ElevenLabsAgent.jsx" ]; then
    echo -e "   ${GREEN}✅ Component exists: src/components/ElevenLabsAgent.jsx${NC}"
else
    echo -e "   ${RED}❌ Component not found${NC}"
    exit 1
fi

# Check 2: Component imported in App.jsx
echo ""
echo "2️⃣  Checking integration..."
if grep -q "ElevenLabsAgent" src/App.jsx; then
    echo -e "   ${GREEN}✅ Component imported in src/App.jsx${NC}"
else
    echo -e "   ${RED}❌ Component not imported${NC}"
    exit 1
fi

# Check 3: Backend route exists
echo ""
echo "3️⃣  Checking backend route..."
if [ -f "server/routes/elevenlabs.js" ]; then
    echo -e "   ${GREEN}✅ Backend route exists: server/routes/elevenlabs.js${NC}"
else
    echo -e "   ${RED}❌ Backend route not found${NC}"
    exit 1
fi

# Check 4: Route registered in server
echo ""
echo "4️⃣  Checking route registration..."
if grep -q "elevenlabs" server/index.js; then
    echo -e "   ${GREEN}✅ Route registered in server/index.js${NC}"
else
    echo -e "   ${RED}❌ Route not registered${NC}"
    exit 1
fi

# Check 5: API key configuration
echo ""
echo "5️⃣  Checking API key configuration..."
if [ -f "server/.env" ]; then
    if grep -qi "ELEVENLABS_API_KEY" server/.env && ! grep -qi "ELEVENLABS_API_KEY=$" server/.env && ! grep -qi "ELEVENLABS_API_KEY=your" server/.env; then
        echo -e "   ${GREEN}✅ API key configured in server/.env${NC}"
        API_KEY_SET=true
    else
        echo -e "   ${YELLOW}⚠️  API key not configured or placeholder value${NC}"
        echo -e "   ${BLUE}💡 Add ELEVENLABS_API_KEY=your_key_here to server/.env${NC}"
        API_KEY_SET=false
    fi
else
    echo -e "   ${YELLOW}⚠️  server/.env file not found${NC}"
    echo -e "   ${BLUE}💡 Create server/.env and add ELEVENLABS_API_KEY${NC}"
    API_KEY_SET=false
fi

# Check 6: Backend server running
echo ""
echo "6️⃣  Checking backend server..."
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "   ${GREEN}✅ Backend server running on port 3001${NC}"
    SERVER_RUNNING=true
else
    echo -e "   ${YELLOW}⚠️  Backend server not running on port 3001${NC}"
    echo -e "   ${BLUE}💡 Start with: npm run dev:server${NC}"
    SERVER_RUNNING=false
fi

# Check 7: Frontend server running
echo ""
echo "7️⃣  Checking frontend server..."
if lsof -Pi :5178 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "   ${GREEN}✅ Frontend server running on port 5178${NC}"
    FRONTEND_RUNNING=true
else
    echo -e "   ${YELLOW}⚠️  Frontend server not running on port 5178${NC}"
    echo -e "   ${BLUE}💡 Start with: npm run dev${NC}"
    FRONTEND_RUNNING=false
fi

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ "$API_KEY_SET" = true ] && [ "$SERVER_RUNNING" = true ] && [ "$FRONTEND_RUNNING" = true ]; then
    echo -e "${GREEN}✅ All checks passed! AI Assistant should be working.${NC}"
    echo ""
    echo -e "${BLUE}📋 To use:${NC}"
    echo "   1. Open http://localhost:5178"
    echo "   2. Look for microphone button (bottom-right)"
    echo "   3. Click to open AI assistant"
    echo "   4. Click microphone to start talking"
else
    echo -e "${YELLOW}⚠️  Some configuration needed${NC}"
    echo ""
    if [ "$API_KEY_SET" = false ]; then
        echo -e "${YELLOW}• Configure API key in server/.env${NC}"
    fi
    if [ "$SERVER_RUNNING" = false ]; then
        echo -e "${YELLOW}• Start backend server: npm run dev:server${NC}"
    fi
    if [ "$FRONTEND_RUNNING" = false ]; then
        echo -e "${YELLOW}• Start frontend server: npm run dev${NC}"
    fi
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📚 See MARKETPLACE_AI_ASSISTANT_SETUP.md for details"
echo ""

