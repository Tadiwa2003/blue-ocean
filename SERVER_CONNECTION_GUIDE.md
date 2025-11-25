# 🚀 Vercel Deployment - Server Connection Guide

## 📋 **COMPLETE DEPLOYMENT CHECKLIST**

Your frontend is pushed to GitHub. Now follow these steps to ensure everything works perfectly!

---

## 🔧 **STEP 1: DEPLOY BACKEND SERVER**

Your backend server needs to be deployed separately. Here are your options:

### **Option A: Deploy Backend to Vercel** (Recommended)

1. **Create New Vercel Project for Backend**
   ```bash
   # In your project root
   cd server
   
   # Create vercel.json for backend
   cat > vercel.json << 'EOF'
   {
     "version": 2,
     "builds": [
       {
         "src": "index.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "/index.js"
       }
     ],
     "env": {
       "NODE_ENV": "production"
     }
   }
   EOF
   ```

2. **Deploy Backend**
   ```bash
   # From server directory
   vercel --prod
   ```

3. **Get Backend URL**
   - After deployment, Vercel will give you a URL like:
   - `https://your-backend-xyz.vercel.app`
   - Save this URL!

### **Option B: Deploy Backend to Railway/Render/Heroku**

Follow their respective deployment guides and get your backend URL.

---

## 🌐 **STEP 2: CONFIGURE FRONTEND ENVIRONMENT VARIABLES**

### **In Vercel Dashboard:**

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your **frontend project** (blue-ocean)
3. Go to **Settings** → **Environment Variables**
4. Add the following:

```
Name: VITE_API_URL
Value: https://your-backend-url.vercel.app/api
Environment: Production (and Preview if needed)
```

**Important**: 
- ✅ Include `/api` at the end
- ✅ Use `https://` (secure)
- ✅ No trailing slash after `/api`

Example:
```
VITE_API_URL=https://brightpath-backend-xyz.vercel.app/api
```

5. Click **Save**

---

## 🔄 **STEP 3: REDEPLOY FRONTEND**

After adding environment variables:

### **Option A: Trigger Redeploy in Vercel**
1. Go to **Deployments** tab
2. Click **...** (three dots) on latest deployment
3. Click **Redeploy**
4. Select **Use existing Build Cache** (faster)
5. Click **Redeploy**

### **Option B: Push a Small Change**
```bash
# Make a small change
echo "# Deployment configured" >> README.md
git add README.md
git commit -m "Trigger redeploy with environment variables"
git push origin fix/master/VercelFix
```

---

## ✅ **STEP 4: VERIFY DEPLOYMENT**

### **1. Check Build Logs**
- Go to Vercel Dashboard → Deployments
- Click on latest deployment
- Check build logs for:
  ```
  ✓ built in XXs
  ✓ Build Completed
  ```

### **2. Test Frontend URL**
Visit your Vercel app URL:
```
https://your-app.vercel.app
```

**Expected**: Landing page loads correctly

### **3. Test API Connection**

Open browser console (F12) and check:

```javascript
// Should see in console (if in dev mode):
🔗 API Base URL: https://your-backend-url.vercel.app/api
```

### **4. Test Authentication**

1. Click **Sign In**
2. Try to sign in with test credentials
3. Check browser console for errors

**If API is connected:**
- ✅ Sign in works
- ✅ No CORS errors
- ✅ No connection errors

**If API is NOT connected:**
- ❌ "Unable to connect to server" error
- ❌ CORS errors
- ❌ Network errors

---

## 🔗 **STEP 5: TEST COPY LINK FUNCTIONALITY**

### **Test Storefront Link Copying:**

1. **Sign in** to your deployed app
2. **Create a storefront** (or use existing)
3. **Click "Copy Link"** button on storefront card
4. **Paste** the link in a new tab

**Expected Behavior:**
- ✅ Link copied to clipboard
- ✅ Success message appears
- ✅ Pasted link opens the storefront
- ✅ Storefront loads correctly

**Link Format:**
```
https://your-app.vercel.app/store/your-storefront-slug
```

---

## 🐛 **TROUBLESHOOTING**

### **Issue 1: "Unable to connect to server"**

**Cause**: Backend not deployed or VITE_API_URL not set

**Fix**:
1. Verify backend is deployed and running
2. Check `VITE_API_URL` in Vercel settings
3. Ensure URL ends with `/api`
4. Redeploy frontend

### **Issue 2: CORS Errors**

**Cause**: Backend CORS not configured for frontend URL

**Fix**: Update backend CORS configuration

In your `server/index.js`:
```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:5182',
    'https://your-app.vercel.app',  // Add your Vercel URL
    'https://your-app-*.vercel.app'  // Allow preview deployments
  ],
  credentials: true
}));
```

Redeploy backend after changes.

### **Issue 3: Copy Link Not Working**

**Cause**: Clipboard API requires HTTPS

**Fix**: Vercel automatically provides HTTPS, so this should work. If not:

1. Check browser console for errors
2. Verify you're using HTTPS (not HTTP)
3. Check browser permissions for clipboard

### **Issue 4: Environment Variables Not Working**

**Cause**: Variables not prefixed with `VITE_` or not redeployed

**Fix**:
1. Ensure variable name is `VITE_API_URL` (not `API_URL`)
2. Redeploy after adding variables
3. Clear browser cache

### **Issue 5: 404 on Storefront Links**

**Cause**: SPA routing not configured

**Fix**: Already configured in `vercel.json`:
```json
{
  "routes": [
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

If still not working, verify `vercel.json` is in root directory.

---

## 📊 **CONNECTION FLOW**

```
User Browser
    ↓
Vercel Frontend (your-app.vercel.app)
    ↓ (API calls)
Backend Server (your-backend.vercel.app/api)
    ↓
Database (MongoDB/Parse)
```

---

## 🔐 **SECURITY CHECKLIST**

Before going live:

- [ ] Backend deployed with HTTPS
- [ ] CORS configured for your domain only
- [ ] Environment variables set in Vercel (not in code)
- [ ] No API keys in frontend code
- [ ] JWT_SECRET set in backend environment
- [ ] Database credentials secure

---

## 📝 **BACKEND ENVIRONMENT VARIABLES**

Your backend also needs environment variables. Set these in backend Vercel project:

```
NODE_ENV=production
JWT_SECRET=your-secure-jwt-secret-here
MONGODB_URI=your-mongodb-connection-string
FRONTEND_URL=https://your-app.vercel.app
PORT=3001
```

---

## ✅ **DEPLOYMENT SUCCESS CHECKLIST**

- [ ] Backend deployed and accessible
- [ ] Frontend deployed to Vercel
- [ ] `VITE_API_URL` set in frontend Vercel settings
- [ ] Frontend redeployed after setting env vars
- [ ] Landing page loads
- [ ] Sign in works
- [ ] Dashboard loads
- [ ] Storefronts can be created
- [ ] Copy link works
- [ ] Storefront links open correctly
- [ ] No CORS errors
- [ ] No console errors

---

## 🎯 **QUICK TEST SCRIPT**

Run this in browser console on your deployed app:

```javascript
// Test API connection
console.log('Testing API connection...');

// Check if VITE_API_URL is set
fetch('/api/health')
  .then(r => r.json())
  .then(data => console.log('✅ API Connected:', data))
  .catch(err => console.error('❌ API Error:', err));

// Test clipboard API
navigator.clipboard.writeText('test')
  .then(() => console.log('✅ Clipboard works'))
  .catch(err => console.error('❌ Clipboard error:', err));
```

---

## 📞 **NEED HELP?**

### **Check These First:**

1. **Vercel Build Logs**
   - Dashboard → Deployments → Click deployment → View logs

2. **Browser Console**
   - F12 → Console tab
   - Look for errors

3. **Network Tab**
   - F12 → Network tab
   - Check API calls
   - Look for failed requests

### **Common URLs to Check:**

- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-backend.vercel.app/api/health`
- Storefront: `https://your-app.vercel.app/store/test-slug`

---

## 🎉 **DEPLOYMENT COMPLETE!**

Once all checks pass:

✅ Frontend deployed  
✅ Backend connected  
✅ API working  
✅ Copy link functional  
✅ Storefronts accessible  

**Your BrightPath application is LIVE!** 🚀

---

## 📋 **NEXT STEPS**

1. **Test thoroughly** on deployed version
2. **Share the link** with users
3. **Monitor** Vercel analytics
4. **Set up** custom domain (optional)
5. **Configure** SSL certificate (automatic on Vercel)

---

*Deployment Guide v1.0*  
*Last Updated: ${new Date().toISOString()}*  
*Status: Ready for Production* ✅
