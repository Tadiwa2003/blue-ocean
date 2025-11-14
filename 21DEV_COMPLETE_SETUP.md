# ✅ 21st.dev Complete Setup Guide

## 🎯 Current Status: CODE READY ✅

All code integration is complete and verified. The only remaining step is installing the IDE extension.

## ✅ What's Already Done

1. **✅ Packages Installed**
   - `@21st-extension/react@0.5.14`
   - `@21st-extension/toolbar-react@0.5.14`

2. **✅ Code Integrated**
   - Imports added to `src/App.jsx`
   - Toolbar component rendered
   - ReactPlugin configured
   - Console logging for debugging

3. **✅ Configuration Files**
   - `.vscode/extensions.json` - Extension recommendation
   - `.vscode/settings.json` - Extension settings
   - `extensions.json` - Workspace recommendation

4. **✅ Build Verified**
   - Code compiles successfully
   - No linting errors
   - All dependencies resolved

## 🚀 Final Step: Install IDE Extension

### Option 1: Automatic Installation (Recommended)

1. **Open Cursor** (or VSCode)
2. **Open this workspace** in Cursor
3. **Look for notification** at bottom-right: "This workspace has extension recommendations"
4. **Click "Install"** on the 21st Extension recommendation
5. **Reload** when prompted

### Option 2: Manual Installation

1. **Open Cursor** (or VSCode)
2. **Open Extensions Panel**:
   - Press `Cmd+Shift+X` (Mac) or `Ctrl+Shift+X` (Windows/Linux)
   - Or click the Extensions icon (four squares) in the sidebar
3. **Search**: Type "21st extension" or "21st-dev.21st-extension"
4. **Install**: Click the "Install" button
5. **Reload**: Click "Reload" if prompted, or restart Cursor

### Option 3: Command Line (VSCode only)

```bash
code --install-extension 21st-dev.21st-extension
```

## 🧪 Testing the Connection

### Step 1: Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:5178`

### Step 2: Open Browser

1. Navigate to: `http://localhost:5178`
2. Open Browser DevTools (F12 or Cmd+Option+I)
3. Go to the Console tab

### Step 3: Verify Connection

**In Browser Console, you should see:**
```
✅ 21st.dev Extension Status: {
  toolbarAvailable: true,
  reactPluginAvailable: true,
  message: 'If toolbar shows "Not Connected", install the 21st.dev extension in Cursor/VSCode'
}
```

**In Browser:**
- The 21st.dev toolbar should appear (usually at top or bottom)
- If it shows "Connected" ✅ - Everything is working!
- If it shows "Not Connected" ⚠️ - See troubleshooting below

## 🔧 Quick Verification Script

Run this to verify everything is set up correctly:

```bash
./verify-21dev-setup.sh
```

This will check:
- ✅ Packages installed
- ✅ Code integrated
- ✅ Configuration files
- ✅ Build successful

## 🐛 Troubleshooting "Not Connected"

If the toolbar shows "Not Connected":

### 1. Verify Extension is Installed

**In Cursor/VSCode:**
- Open Extensions panel (`Cmd+Shift+X`)
- Search for "21st extension"
- Make sure it shows "Installed" and "Enabled"

### 2. Reload IDE

- Close and reopen Cursor/VSCode completely
- Or use Command Palette (`Cmd+Shift+P`) → "Developer: Reload Window"

### 3. Check Extension Status

**In Cursor/VSCode:**
- Look at the bottom status bar
- You should see a 21st.dev icon or indicator
- If not, the extension may not be active

### 4. Retry Connection

**In Browser:**
- Click "Retry Connection" button in the toolbar
- Wait a few seconds
- Check if status changes to "Connected"

### 5. Verify Port

Make sure the dev server is running on the correct port:
- Default: `http://localhost:5178`
- Check `package.json` for the configured port

### 6. Check Firewall/Network

- Make sure your firewall isn't blocking the connection
- If behind a corporate proxy, you may need to configure it
- Try disabling VPN temporarily to test

## 📋 Complete Checklist

- [ ] Packages installed (`npm list @21st-extension/react`)
- [ ] Code integrated in `src/App.jsx`
- [ ] `.vscode/extensions.json` exists
- [ ] `.vscode/settings.json` exists
- [ ] Extension installed in Cursor/VSCode
- [ ] Extension enabled in Cursor/VSCode
- [ ] Cursor/VSCode reloaded after installation
- [ ] Dev server running (`npm run dev`)
- [ ] Browser open to `http://localhost:5178`
- [ ] Browser console shows status message
- [ ] Toolbar appears in browser
- [ ] Toolbar shows "Connected" (not "Not Connected")

## 🎉 Success Indicators

You'll know everything is working when:

1. ✅ Toolbar appears in browser
2. ✅ Toolbar shows "Connected" status (green indicator)
3. ✅ No "Not Connected" message
4. ✅ AI features are accessible in toolbar
5. ✅ Component inspection works
6. ✅ Live editing is enabled

## 📚 Additional Resources

- **Troubleshooting Guide**: See `21DEV_TROUBLESHOOTING.md`
- **Setup Documentation**: See `21DEV_SETUP.md`
- **Verification Script**: Run `./verify-21dev-setup.sh`

## 🆘 Still Having Issues?

1. **Check Extension Marketplace**:
   - Visit: https://marketplace.visualstudio.com/items?itemName=21st-dev.21st-extension
   - Verify you have the latest version

2. **Check Cursor/VSCode Logs**:
   - Open Output panel (`View` → `Output`)
   - Select "21st Extension" from dropdown
   - Look for connection errors

3. **Verify Network Connection**:
   - The extension needs to communicate between IDE and browser
   - Check if localhost connections are allowed

---

**Last Updated**: Based on current codebase
**Status**: Code ready, requires IDE extension installation

