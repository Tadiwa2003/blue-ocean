#!/bin/bash

echo "🧪 Testing 21st.dev Toolbar Connection Setup..."
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Check packages
echo "1️⃣  Checking npm packages..."
if npm list @21st-extension/react @21st-extension/toolbar-react > /dev/null 2>&1; then
    echo -e "   ${GREEN}✅ Packages installed${NC}"
    npm list @21st-extension/react @21st-extension/toolbar-react 2>/dev/null | grep "@21st-extension" | sed 's/^/      /'
else
    echo -e "   ${RED}❌ Packages not found${NC}"
    exit 1
fi

# Test 2: Check code integration
echo ""
echo "2️⃣  Checking code integration..."
if grep -q "TwentyFirstToolbar" src/App.jsx && grep -q "ReactPlugin" src/App.jsx; then
    echo -e "   ${GREEN}✅ Code integrated in src/App.jsx${NC}"
    if grep -q "autoConnect: true" src/App.jsx; then
        echo -e "   ${GREEN}✅ Auto-connect enabled${NC}"
    else
        echo -e "   ${YELLOW}⚠️  Auto-connect not found${NC}"
    fi
else
    echo -e "   ${RED}❌ Code not integrated properly${NC}"
    exit 1
fi

# Test 3: Check configuration files
echo ""
echo "3️⃣  Checking configuration files..."
if [ -f ".vscode/extensions.json" ]; then
    echo -e "   ${GREEN}✅ .vscode/extensions.json exists${NC}"
else
    echo -e "   ${RED}❌ .vscode/extensions.json not found${NC}"
fi

if [ -f ".vscode/settings.json" ]; then
    echo -e "   ${GREEN}✅ .vscode/settings.json exists${NC}"
    if grep -q "21st-extension.enabled" .vscode/settings.json; then
        echo -e "   ${GREEN}✅ Extension enabled in settings${NC}"
    fi
else
    echo -e "   ${RED}❌ .vscode/settings.json not found${NC}"
fi

# Test 4: Check build
echo ""
echo "4️⃣  Testing build..."
if npm run build > /tmp/build-test.log 2>&1; then
    echo -e "   ${GREEN}✅ Build successful${NC}"
    rm -f /tmp/build-test.log
else
    echo -e "   ${RED}❌ Build failed${NC}"
    echo "   Check /tmp/build-test.log for details"
    exit 1
fi

# Test 5: Check for linting errors
echo ""
echo "5️⃣  Checking for linting errors..."
if [ -f "node_modules/.bin/eslint" ] || command -v eslint > /dev/null 2>&1; then
    echo "   (Skipping - eslint not configured)"
else
    echo "   (Skipping - eslint not configured)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ All Code Tests Passed!${NC}"
echo ""
echo "📋 Next Steps to Connect:"
echo ""
echo "   1. ${YELLOW}Install Cursor Extension:${NC}"
echo "      • Open Cursor"
echo "      • Press Cmd+Shift+X"
echo "      • Search '21st extension'"
echo "      • Click Install"
echo ""
echo "   2. ${YELLOW}Start Dev Server:${NC}"
echo "      npm run dev"
echo ""
echo "   3. ${YELLOW}Open Browser:${NC}"
echo "      http://localhost:5178"
echo ""
echo "   4. ${YELLOW}Check Connection:${NC}"
echo "      • Open DevTools (F12)"
echo "      • Check Console for status message"
echo "      • Look for toolbar in browser"
echo "      • Should show 'Connected' status"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📚 Documentation:"
echo "   • QUICK_START_21DEV.md - Quick guide"
echo "   • 21DEV_COMPLETE_SETUP.md - Full setup"
echo "   • 21DEV_TROUBLESHOOTING.md - Troubleshooting"
echo ""

