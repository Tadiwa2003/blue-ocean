#!/bin/bash

echo "🚀 Activating 21st.dev AI Assistant..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Cursor is running
echo "1️⃣  Checking Cursor..."
if pgrep -f "Cursor" > /dev/null; then
    echo -e "   ${GREEN}✅ Cursor is running${NC}"
else
    echo -e "   ${RED}❌ Cursor is not running${NC}"
    echo -e "   ${YELLOW}💡 Please start Cursor first${NC}"
    exit 1
fi

# Check extension installation
echo ""
echo "2️⃣  Checking extension..."
EXT_DIR="$HOME/.cursor/extensions/21st-dev.21st-extension-0.0.11-universal"
if [ -d "$EXT_DIR" ]; then
    echo -e "   ${GREEN}✅ Extension found:${NC}"
    echo -e "      ${BLUE}$EXT_DIR${NC}"
else
    echo -e "   ${RED}❌ Extension not found${NC}"
    echo -e "   ${YELLOW}💡 Install it in Cursor:${NC}"
    echo -e "      • Press Cmd+Shift+X"
    echo -e "      • Search '21st extension'"
    echo -e "      • Install: 21st-dev.21st-extension"
    exit 1
fi

# Check dev server
echo ""
echo "3️⃣  Checking dev server..."
if lsof -Pi :5178 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "   ${GREEN}✅ Dev server is running on port 5178${NC}"
else
    echo -e "   ${YELLOW}⚠️  Dev server is not running${NC}"
    echo -e "   ${BLUE}💡 Starting dev server...${NC}"
    echo -e "   ${YELLOW}   Run in another terminal: npm run dev${NC}"
fi

# Instructions
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ Extension is installed!${NC}"
echo ""
echo -e "${BLUE}📋 Next Steps to Activate:${NC}"
echo ""
echo "1. ${YELLOW}Enable Extension in Cursor:${NC}"
echo "   • Press Cmd+Shift+X"
echo "   • Search '21st extension'"
echo "   • Make sure it's ENABLED (not disabled)"
echo "   • If disabled, click 'Enable'"
echo ""
echo "2. ${YELLOW}Reload Cursor:${NC}"
echo "   • Press Cmd+Shift+P"
echo "   • Type: 'Developer: Reload Window'"
echo "   • Press Enter"
echo ""
echo "3. ${YELLOW}Start Dev Server (if not running):${NC}"
echo "   npm run dev"
echo ""
echo "4. ${YELLOW}Open Browser:${NC}"
echo "   http://localhost:5178"
echo ""
echo "5. ${YELLOW}Check Connection:${NC}"
echo "   • Open DevTools (F12)"
echo "   • Check Console for status"
echo "   • Look for toolbar in browser"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}✨ The extension is installed - just enable it and reload!${NC}"
echo ""

