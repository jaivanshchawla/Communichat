# Theme Switching Debug Test

## What Changed
- Changed from DaisyUI dropdown to custom state-based menu (more reliable)
- Added extensive console logging to track theme changes
- Added theme display in header (small text showing current theme)

## How to Test

### Step 1: Open DevTools
Press `F12` in the browser to open Developer Tools

### Step 2: Go to Console Tab
Click on **Console** tab in DevTools

### Step 3: Test Manual Theme Change
Paste this into the console and press Enter:

```javascript
// Test if DaisyUI is loaded
const htmlElement = document.documentElement;
console.log('Current data-theme:', htmlElement.getAttribute('data-theme'));

// Try to change theme manually
htmlElement.setAttribute('data-theme', 'cupcake');
console.log('Changed to cupcake');

// Wait 500ms and check if it visually changed
setTimeout(() => {
  const bgColor = window.getComputedStyle(document.body).backgroundColor;
  console.log('Body background color:', bgColor);
}, 500);
```

### Step 4: Watch for Visual Changes
- Does the page color change to a light pink/cupcake theme?
- Open DevTools Elements tab and look at the `<html>` tag - does it show `data-theme="cupcake"`?

### Step 5: Test Theme Button Click Events
Now try clicking the theme button and watch the console for:
- `🎨 Setting theme to: <theme-name>`
- Both theme display in header and console logs should update

## What Each Log Means

| Log | Meaning |
|-----|---------|
| `🎨 Setting theme to: X` | Theme button was clicked and function called |
| `🎨 [setTheme] Called with: X` | Context setTheme function was called |
| `✅ [setTheme] Theme applied:` | Theme DOM attribute was set |
| `🎨 [setTheme] Root element CSS var --p:` | DaisyUI CSS variables are loaded |

## If Theme Still Doesn't Change

1. **Check CSS Variables**: In console, run:
```javascript
const styles = window.getComputedStyle(document.documentElement);
console.log('Primary color (--p):', styles.getPropertyValue('--p'));
console.log('Primary content (--pc):', styles.getPropertyValue('--pc'));
```
If these are empty, DaisyUI CSS isn't loading.

2. **Check if data-theme attribute changes**: Run:
```javascript
const observer = new MutationObserver((mutations) => {
  mutations.forEach(m => console.log('data-theme changed!', document.documentElement.getAttribute('data-theme')));
});
observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
```
Then click a theme. Should see "data-theme changed!" messages.

3. **Check Tailwind classes**: Hit F12 → Elements tab → Click on a post card → Check if it has `bg-base-100`, `border-base-300` classes. If not, Tailwind CSS isn't loading.

## Files Modified
- `frontend/src/components/ThemeSwitcher.tsx` - Simplified to state-based menu
- `frontend/src/context/ThemeContext.tsx` - Added detailed logging
- `frontend/src/App.tsx` - Added theme display in header
- `backend/playto_config/settings.py` - Fixed CORS for port 5174
