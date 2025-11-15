#!/bin/bash

echo "🔍 Checking 21st.dev Extension Installation..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Cursor is running
echo "1️⃣  Checking if Cursor is running..."
if pgrep -f "Cursor" > /dev/null; then
    echo -e "   ${GREEN}✅ Cursor is running${NC}"
else
    echo -e "   ${RED}❌ Cursor is not running${NC}"
    echo -e "   ${YELLOW}💡 Please start Cursor first${NC}"
fi

# Check extension directory
echo ""
echo "2️⃣  Checking for 21st.dev extension..."
CURSOR_EXT_DIR="$HOME/Library/Application Support/Cursor/User/globalStorage"
EXT_DIR="$HOME/.cursor/extensions"
EXT_DIR2="$HOME/Library/Application Support/Cursor/extensions"

if [ -d "$EXT_DIR" ] || [ -d "$EXT_DIR2" ]; then
    if find "$EXT_DIR" "$EXT_DIR2" -type d -name "*21st*" 2>/dev/null | grep -q .; then
        echo -e "   ${GREEN}✅ 21st.dev extension directory found${NC}"
        find "$EXT_DIR" "$EXT_DIR2" -type d -name "*21st*" 2>/dev/null | head -1 | sed 's/^/      /'
    else
        echo -e "   ${YELLOW}⚠️  21st.dev extension not found in extensions directory${NC}"
        echo -e "   ${BLUE}💡 You may need to install it:${NC}"
        echo -e "      • Open Cursor"
        echo -e "      • Press Cmd+Shift+X"
        echo -e "      • Search '21st extension'"
        echo -e "      • Install: 21st-dev.21st-extension"
    fi
else
    echo -e "   ${YELLOW}⚠️  Extensions directory not found${NC}"
fi

# Check VS Code Marketplace for extension
echo ""
echo "3️⃣  Checking extension availability..."
echo -e "   ${BLUE}📦 Extension ID: 21st-dev.21st-extension${NC}"
echo -e "   ${BLUE}🔗 Marketplace: https://marketplace.visualstudio.com/items?itemName=21st-dev.21st-extension${NC}"

# Check if npm packages are installed
echo ""
echo "4️⃣  Checking npm packages..."
if npm list @21st-extension/react @21st-extension/toolbar-react > /dev/null 2>&1; then
    echo -e "   ${GREEN}✅ Packages installed:${NC}"
    npm list @21st-extension/react @21st-extension/toolbar-react 2>/dev/null | grep "@21st-extension" | sed 's/^/      /'
else
    echo -e "   ${RED}❌ Packages not found${NC}"
    echo -e "   ${YELLOW}💡 Run: npm install${NC}"
fi

# Check code integration
echo ""
echo "5️⃣  Checking code integration..."
if grep -q "TwentyFirstToolbar" src/App.jsx && grep -q "ReactPlugin" src/App.jsx; then
    echo -e "   ${GREEN}✅ Code integrated in src/App.jsx${NC}"
else
    echo -e "   ${RED}❌ Code not integrated${NC}"
fi

# Check configuration files
echo ""
echo "6️⃣  Checking configuration files..."
if [ -f ".vscode/settings.json" ]; then
    echo -e "   ${GREEN}✅ .vscode/settings.json exists${NC}"
    if grep -q "21st-extension" .vscode/settings.json; then
        echo -e "   ${GREEN}✅ 21st.dev settings configured${NC}"
    fi
else
    echo -e "   ${YELLOW}⚠️  .vscode/settings.json not found${NC}"
fi

if [ -f "extensions.json" ]; then
    echo -e "   ${GREEN}✅ extensions.json exists${NC}"
else
    echo -e "   ${YELLOW}⚠️  extensions.json not found${NC}"
fi

# Check if dev server is running
echo ""
echo "7️⃣  Checking if dev server is running..."
if lsof -Pi :5178 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "   ${GREEN}✅ Dev server is running on port 5178${NC}"
else
    echo -e "   ${YELLOW}⚠️  Dev server is not running${NC}"
    echo -e "   ${BLUE}💡 Start it with: npm run dev${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}📋 Next Steps:${NC}"
echo ""
echo "1. ${YELLOW}Install Extension in Cursor:${NC}"
echo "   • Open Cursor"
echo "   • Press Cmd+Shift+X"
echo "   • Search '21st extension'"
echo "   • Install: 21st-dev.21st-extension"
echo "   • Reload Cursor"
echo ""
echo "2. ${YELLOW}Start Dev Server:${NC}"
echo "   npm run dev"
echo ""
echo "3. ${YELLOW}Open Browser:${NC}"
echo "   http://localhost:5178"
echo ""
echo "4. ${YELLOW}Check Connection:${NC}"
echo "   • Open DevTools (F12)"
echo "   • Check Console for status messages"
echo "   • Look for toolbar in browser"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"


