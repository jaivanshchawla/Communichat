# Debugging Guide - Theme Switcher & Posts Loading

## 🔧 What Was Fixed

### ✅ CORS Configuration (CRITICAL)
**Problem**: Frontend was running on `localhost:5174` but CORS was only configured for `localhost:5173`
**Solution**: Updated `backend/playto_config/settings.py`:
```python
CORS_ALLOWED_ORIGINS = 'http://localhost:3000,http://localhost:5173,http://localhost:5174'
```

**Status**: ✅ Fixed and backend restarted

---

## 📋 Current Status

### Backend (http://localhost:8000)
- ✅ Running on port 8000
- ✅ API responding with status 200
- ✅ Posts data available (10 posts seeded)
- ✅ CORS configured for port 5174

### Frontend (http://localhost:5174)
- ✅ Running on port 5174 (5173 was busy)
- ⏳ Posts should now load (CORS fixed)
- ⏳ Theme switcher needs testing

---

## 🧪 How to Verify Everything Works

### 1. Check Posts Are Loading
Open browser at `http://localhost:5174` and:
- Open DevTools (F12)
- Go to **Network** tab
- Look for `posts/` request
- Should see **Status 200** (green)
- Refresh the page if needed

### 2. Debug Theme Switcher
Open `http://localhost:5174` and:
- Open DevTools (F12)
- Go to **Console** tab
- Paste this test code:

```javascript
// Test 1: Check if theme context is working
console.log('Current data-theme:', document.documentElement.getAttribute('data-theme'));

// Test 2: Manually change theme
document.documentElement.setAttribute('data-theme', 'cupcake');
console.log('Changed to cupcake:', document.documentElement.getAttribute('data-theme'));

// Test 3: Change back
document.documentElement.setAttribute('data-theme', 'dark');
console.log('Changed to dark:', document.documentElement.getAttribute('data-theme'));
```

- If theme **visually changes**: DaisyUI CSS is working ✅
- If theme **doesn't change**: DaisyUI CSS may not be loading ❌

### 3. Check Click Events
In DevTools Console, paste:

```javascript
// Check if setTheme is being called
const originalLog = console.log;
let themeCallCount = 0;

// Intercept theme changes
if (typeof window !== 'undefined') {
  const observer = new MutationObserver(() => {
    themeCallCount++;
    console.log('🎨 Theme attribute changed!', themeCallCount);
  });
  
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });
}
```

Then click theme buttons - should see "Theme attribute changed!" messages.

---

## 🚀 Next Steps If Issues Persist

### If Posts Still Don't Load:
1. Check console for errors (F12 → Console tab)
2. Check Network tab for failed requests
3. Verify backend is running: `http://localhost:8000/api/posts/`

### If Theme Switcher Still Doesn't Work:
1. Verify dropdown opens (click the theme button)
2. Run manual test from section "2. Debug Theme Switcher" above
3. Check if DaisyUI CSS is in the built bundle

---

## 📝 Files Modified

| File | Change | Status |
|------|--------|--------|
| `backend/playto_config/settings.py` | Added `localhost:5174` to CORS origins | ✅ Applied |
| Backend Server | Restarted | ✅ Running |

---

## 🔍 Technical Details

### CORS Allowed Origins Config
**Location**: `backend/playto_config/settings.py` (line 147)

**Old**:
```python
CORS_ALLOWED_ORIGINS = os.getenv('CORS_ALLOWED_ORIGINS', 'http://localhost:3000,http://localhost:5173').split(',')
```

**New**:
```python
CORS_ALLOWED_ORIGINS = os.getenv('CORS_ALLOWED_ORIGINS', 'http://localhost:3000,http://localhost:5173,http://localhost:5174').split(',')
```

### Why 5174?
- Frontend tried to use port 5173 (configured in npm scripts)
- Port 5173 was already in use
- Vite auto-selected port 5174
- CORS verification needed to be updated to match

---

## 📞 Summary

✅ **Fixed**: CORS configuration to allow requests from port 5174
✅ **Verified**: Backend API is running and responding
⏳ **Pending**: Your confirmation that posts load and theme switching works

Please check the browser and run the debugging steps above. Posts should now load! 🎉
