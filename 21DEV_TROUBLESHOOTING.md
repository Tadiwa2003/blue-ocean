# 🔧 21st.dev Extension Troubleshooting Guide

## ✅ Current Status

### Code Integration: **WORKING** ✅
- ✅ Packages installed: `@21st-extension/react@0.5.14` and `@21st-extension/toolbar-react@0.5.14`
- ✅ Code integrated in `src/App.jsx`
- ✅ Toolbar component rendered correctly
- ✅ No linting errors
- ✅ Build successful

### Connection Status: **Requires IDE Extension** ⚠️

If you see "Not Connected" in the toolbar, it means the **Cursor/VSCode extension** needs to be installed and activated.

## 🚀 Quick Fix Steps

### Step 1: Install the Cursor Extension

1. **Open Cursor** (or VSCode)
2. **Open Extensions**:
   - Press `Cmd+Shift+X` (Mac) or `Ctrl+Shift+X` (Windows/Linux)
   - Or click the Extensions icon in the sidebar
3. **Search for "21st extension"**:
   - Look for: `21st-dev.21st-extension`
   - Publisher: `21st-dev`
4. **Click "Install"**
5. **Reload Cursor/VSCode** if prompted

### Step 2: Verify Extension is Active

1. Check the Extensions panel - the extension should show as "Enabled"
2. Look for the 21st.dev icon in the status bar (bottom of Cursor/VSCode)
3. The extension should automatically connect when you run the dev server

### Step 3: Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:5178`

### Step 4: Open Browser and Check Connection

1. Open `http://localhost:5178` in your browser
2. Open browser DevTools (F12)
3. Check the console for:
   ```
   ✅ 21st.dev Extension Status: {
     toolbarAvailable: true,
     reactPluginAvailable: true,
     message: 'If toolbar shows "Not Connected", install the 21st.dev extension in Cursor/VSCode'
   }
   ```
4. The toolbar should appear in your browser
5. If it shows "Not Connected", click "Retry Connection" in the toolbar

## 🔍 Verification Checklist

- [ ] Extension installed in Cursor/VSCode
- [ ] Extension is enabled/active
- [ ] Dev server is running (`npm run dev`)
- [ ] Browser is open to `http://localhost:5178`
- [ ] Console shows extension status message
- [ ] Toolbar appears in browser
- [ ] Toolbar shows "Connected" (not "Not Connected")

## 🐛 Common Issues & Solutions

### Issue 1: "Not Connected" Message

**Cause**: IDE extension not installed or not active

**Solution**:
1. Install the extension (see Step 1 above)
2. Make sure it's enabled
3. Reload Cursor/VSCode
4. Restart the dev server
5. Refresh the browser

### Issue 2: Toolbar Not Appearing

**Cause**: Code not loaded or build error

**Solution**:
1. Check browser console for errors
2. Verify packages are installed:
   ```bash
   npm list @21st-extension/react @21st-extension/toolbar-react
   ```
3. Clear cache and rebuild:
   ```bash
   rm -rf node_modules/.vite
   npm run dev
   ```

### Issue 3: Extension Installed But Still Not Connected

**Cause**: Extension needs to be activated or connection needs retry

**Solution**:
1. Click "Retry Connection" in the toolbar
2. Check if extension is enabled in Extensions panel
3. Try disabling and re-enabling the extension
4. Restart Cursor/VSCode completely
5. Make sure you're using the same workspace where the extension is installed

### Issue 4: Console Errors

**Cause**: Package version mismatch or missing dependencies

**Solution**:
1. Reinstall packages:
   ```bash
   npm install @21st-extension/react@^0.5.14 @21st-extension/toolbar-react@^0.5.14
   ```
2. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

## 📋 Technical Details

### Package Versions
- `@21st-extension/react`: `^0.5.14`
- `@21st-extension/toolbar-react`: `^0.5.14`

### Integration Location
- **File**: `src/App.jsx`
- **Line**: ~225
- **Component**: `<TwentyFirstToolbar config={{ plugins: [ReactPlugin] }} />`

### Requirements
- React 18+ ✅ (Current: 18.3.1)
- Vite ✅ (Current: 5.4.8)
- Modern browser with JavaScript enabled

## 🎯 Expected Behavior

When everything is working correctly:

1. **Dev server starts** without errors
2. **Browser console** shows extension status message
3. **Toolbar appears** in the browser (usually at the top or bottom)
4. **Toolbar shows "Connected"** status
5. **AI features** are available in the toolbar
6. **Component inspection** works
7. **Live editing** is enabled

## 📞 Still Having Issues?

If the toolbar still shows "Not Connected" after following all steps:

1. **Check Extension Marketplace**:
   - Visit: https://marketplace.visualstudio.com/items?itemName=21st-dev.21st-extension
   - Verify you have the latest version

2. **Check 21st.dev Documentation**:
   - Visit: https://21.dev (or their official docs)
   - Look for connection troubleshooting

3. **Verify Network**:
   - Make sure your firewall isn't blocking the connection
   - Check if you're behind a corporate proxy

4. **Check Cursor/VSCode Logs**:
   - Open Output panel in Cursor/VSCode
   - Select "21st Extension" from the dropdown
   - Look for connection errors

## ✅ Success Indicators

You'll know everything is working when:
- ✅ Toolbar appears in browser
- ✅ Toolbar shows "Connected" (green indicator)
- ✅ No "Not Connected" message
- ✅ AI features are accessible
- ✅ Console shows successful status message

---

**Last Updated**: Based on current codebase configuration
**Status**: Code integration complete, requires IDE extension installation for full functionality

