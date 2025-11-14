#!/bin/bash

echo "🔍 Verifying 21st.dev Extension Setup..."
echo ""

# Check if packages are installed
echo "1. Checking npm packages..."
if npm list @21st-extension/react @21st-extension/toolbar-react > /dev/null 2>&1; then
    echo "   ✅ Packages installed:"
    npm list @21st-extension/react @21st-extension/toolbar-react 2>/dev/null | grep "@21st-extension"
else
    echo "   ❌ Packages not found. Run: npm install"
    exit 1
fi

echo ""
echo "2. Checking code integration..."
if grep -q "TwentyFirstToolbar" src/App.jsx && grep -q "ReactPlugin" src/App.jsx; then
    echo "   ✅ Code integrated in src/App.jsx"
else
    echo "   ❌ Code not integrated properly"
    exit 1
fi

echo ""
echo "3. Checking VSCode configuration..."
if [ -f ".vscode/extensions.json" ]; then
    echo "   ✅ .vscode/extensions.json exists"
else
    echo "   ⚠️  .vscode/extensions.json not found (will be created)"
fi

if [ -f ".vscode/settings.json" ]; then
    echo "   ✅ .vscode/settings.json exists"
else
    echo "   ⚠️  .vscode/settings.json not found (will be created)"
fi

echo ""
echo "4. Checking build..."
if npm run build > /dev/null 2>&1; then
    echo "   ✅ Build successful"
else
    echo "   ❌ Build failed. Check errors above."
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Code Setup: COMPLETE"
echo ""
echo "📋 Next Steps:"
echo "   1. Open Cursor (or VSCode)"
echo "   2. Install the '21st Extension' when prompted"
echo "      (Or manually: Cmd+Shift+X → Search '21st extension')"
echo "   3. Reload Cursor/VSCode"
echo "   4. Run: npm run dev"
echo "   5. Open: http://localhost:5178"
echo "   6. Check browser console for extension status"
echo ""
echo "📖 For detailed troubleshooting, see: 21DEV_TROUBLESHOOTING.md"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

