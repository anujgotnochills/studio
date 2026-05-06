# Logo File Instructions

## Current Behavior
A **cursor-following logo** appears when hovering over the "LOGIC SYNC" text in the navigation bar.

## How to Add Your Logo

1. **Add your logo file** to this `public/` directory with the name `logo.webp`
2. The logo will automatically display when hovering over the text
3. A placeholder SVG (`logo-placeholder.svg`) is currently being used as fallback

## Requirements
- **File name:** `logo.webp` (or update the path in CardNav.tsx)
- **Recommended size:** 300x300px to 500x500px (square format works best)
- **Format:** WebP for best performance (PNG/SVG also supported)
- **Background:** Transparent background recommended for best visual effect

## Features
- ✨ **Desktop (≥768px):** Logo follows your cursor when hovering over text
- 📱 **Mobile (<768px):** Logo appears statically below the text on hover
- 🎨 Glowing effect with drop shadows (white + cyan blue)
- 📏 Desktop: 300px width | Mobile: 150px width
- 🎭 Smooth bounce animation with scale and rotation
- 🌊 Logo overflows from navbar (positioned with fixed/absolute)
- 🔄 Automatically falls back to placeholder if logo.webp not found

## Alternative Formats
If you prefer PNG or SVG:
- Use `logo.png` or `logo.svg` as filename
- Or update line 250 in `src/components/CardNav.tsx` with your preferred path
