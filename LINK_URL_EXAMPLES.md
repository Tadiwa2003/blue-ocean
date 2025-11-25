# 🔗 Storefront Link URL Examples

## 📍 **LINK URL FORMAT**

Your storefront links follow this format:

```
{domain}/store/{storefront-slug}
```

---

## 🌐 **EXAMPLE URLS**

### **Development (Localhost):**
```
http://localhost:5182/store/elegant-beauty-spa
http://localhost:5182/store/tech-gadgets-store
http://localhost:5182/store/fashion-boutique
http://localhost:5182/store/organic-wellness
```

### **Production (Vercel):**
```
https://blue-ocean-tadiwa2003.vercel.app/store/elegant-beauty-spa
https://blue-ocean-tadiwa2003.vercel.app/store/tech-gadgets-store
https://blue-ocean-tadiwa2003.vercel.app/store/fashion-boutique
https://blue-ocean-tadiwa2003.vercel.app/store/organic-wellness
```

### **Custom Domain:**
```
https://yourdomain.com/store/elegant-beauty-spa
https://yourdomain.com/store/tech-gadgets-store
https://yourdomain.com/store/fashion-boutique
https://yourdomain.com/store/organic-wellness
```

---

## 🎯 **HOW TO SEE YOUR LINK**

### **Method 1: Copy Link Button**

1. **Open** http://localhost:5182
2. **Sign in** to your account
3. **Go to Dashboard** → Storefronts section
4. **Find** any storefront card
5. **Click** "Copy Link" button
6. **Paste** in any text editor (Ctrl+V / Cmd+V)
7. **See** your link: `http://localhost:5182/store/your-slug`

### **Method 2: Browser Address Bar**

1. **Open** http://localhost:5182
2. **Sign in** to your account
3. **Click** "View Storefront" on any card
4. **Look** at browser address bar
5. **See** URL: `http://localhost:5182/store/your-slug`
6. **Copy** from address bar

---

## 📋 **LINK COMPONENTS**

### **Breaking Down the URL:**

```
http://localhost:5182/store/elegant-beauty-spa
└─────┬────────┘└──┬──┘└─┬─┘└────────┬──────────┘
   Domain      Port Path    Storefront Slug
```

**Components:**
- **Domain**: `localhost` (or your Vercel/custom domain)
- **Port**: `5182` (only in development)
- **Path**: `/store/` (fixed path for all storefronts)
- **Slug**: Unique identifier for your storefront

---

## 🔍 **SLUG GENERATION**

The slug is automatically created from your storefront name:

**Examples:**
- Name: "Elegant Beauty Spa" → Slug: `elegant-beauty-spa`
- Name: "Tech Gadgets Store" → Slug: `tech-gadgets-store`
- Name: "Fashion Boutique" → Slug: `fashion-boutique`
- Name: "Organic Wellness" → Slug: `organic-wellness`

**Rules:**
- Lowercase letters
- Spaces become hyphens (-)
- Special characters removed
- Unique per storefront

---

## 🌍 **PRODUCTION URLS**

### **Your Vercel App:**

Based on your GitHub repository (Tadiwa2003/blue-ocean), your Vercel URL will be:

```
https://blue-ocean-tadiwa2003.vercel.app
```

**Full Storefront Links:**
```
https://blue-ocean-tadiwa2003.vercel.app/store/{your-slug}
```

**Examples:**
```
https://blue-ocean-tadiwa2003.vercel.app/store/my-first-store
https://blue-ocean-tadiwa2003.vercel.app/store/beauty-spa
https://blue-ocean-tadiwa2003.vercel.app/store/tech-shop
```

---

## 📱 **SHARING EXAMPLES**

### **Email:**
```
Hi! Check out my store:
https://blue-ocean-tadiwa2003.vercel.app/store/elegant-beauty-spa
```

### **WhatsApp:**
```
🛍️ Visit my store!
https://blue-ocean-tadiwa2003.vercel.app/store/elegant-beauty-spa
```

### **Instagram Bio:**
```
Shop here 👇
blue-ocean-tadiwa2003.vercel.app/store/elegant-beauty-spa
```

### **QR Code:**
Generate QR code from:
```
https://blue-ocean-tadiwa2003.vercel.app/store/elegant-beauty-spa
```

---

## ✅ **TESTING YOUR LINKS**

### **Test Locally:**

1. **Create** a storefront in dashboard
2. **Copy** the link using "Copy Link" button
3. **Open** new browser tab
4. **Paste** the link
5. **Press** Enter
6. **Verify** storefront loads

**Expected URL:**
```
http://localhost:5182/store/your-storefront-slug
```

### **Test on Vercel:**

1. **Deploy** to Vercel
2. **Create** a storefront
3. **Copy** the link
4. **Share** with someone
5. **They click** the link
6. **Storefront** opens

**Expected URL:**
```
https://blue-ocean-tadiwa2003.vercel.app/store/your-storefront-slug
```

---

## 🎯 **QUICK REFERENCE**

### **Current Environment:**
- **Local Dev**: `http://localhost:5182`
- **Dev Server**: Running on port 5182 ✅

### **Your Links Will Be:**
```
Local:      http://localhost:5182/store/{slug}
Production: https://blue-ocean-tadiwa2003.vercel.app/store/{slug}
```

### **To See a Link:**
1. Open http://localhost:5182
2. Sign in
3. Go to Dashboard
4. Click "Copy Link" on any storefront
5. Paste anywhere to see the URL

---

## 📸 **VISUAL EXAMPLE**

When you click "Copy Link", you'll copy a URL like:

```
┌─────────────────────────────────────────────────────────┐
│ http://localhost:5182/store/elegant-beauty-spa          │
│                                                          │
│ This is what gets copied to your clipboard!             │
│                                                          │
│ Share this link with anyone and they can visit          │
│ your storefront directly!                               │
└─────────────────────────────────────────────────────────┘
```

**On Vercel:**
```
┌─────────────────────────────────────────────────────────┐
│ https://blue-ocean-tadiwa2003.vercel.app/store/         │
│ elegant-beauty-spa                                       │
│                                                          │
│ This is your production link!                           │
│                                                          │
│ Share with customers worldwide!                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🎉 **SUMMARY**

**Your storefront links are:**
- ✅ Automatically generated
- ✅ Clean and professional
- ✅ Easy to share
- ✅ Work on any device
- ✅ SEO-friendly format

**Format:**
```
{your-domain}/store/{storefront-slug}
```

**To see your actual links:**
1. Open the app at http://localhost:5182
2. Sign in and go to Dashboard
3. Click "Copy Link" on any storefront
4. Paste to see the URL!

---

*Link URL Guide*  
*Your app is running at: http://localhost:5182*  
*Ready to copy and share!* 🚀
