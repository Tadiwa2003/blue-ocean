# ANAYA FINDS Logo Instructions

## To Use the ANAYA FINDS Logo Image:

1. **Place your logo image file** in this directory: `/public/assets/images/`
2. **Name the file exactly**: `anaya-finds-logo.png`
3. **Supported formats**: PNG (preferred), JPG, JPEG, WEBP, or SVG

## Logo File Path:
The component is looking for: `/assets/images/anaya-finds-logo.png`

**To use your logo image:**
1. Save your ANAYA FINDS logo image file
2. Copy it to: `/public/assets/images/anaya-finds-logo.png`
3. The component will automatically use it!
4. If the image doesn't load, it will fall back to the SVG version

## Logo Description:
The ANAYA FINDS logo features:
- "ANAYA FINDS" text in colorful gradient (blue, green, pink, magenta)
- A tagline "CURATED FASHION DISCOVERIES"
- A stylized dress and abstract book/frame graphic
- All within a golden circle frame

## Implementation:
This logo component works exactly like the Tana's Beauty Boost logo:
- Uses direct image path: `/assets/images/anaya-finds-logo.png`
- Falls back to SVG if image not found
- Supports both header (no text) and hero (with text) modes
- Responsive sizing with className props

## Usage:
The logo component is already integrated into:
- `AnayaFindsStorefront.jsx` - Header and Hero sections
- Can be used anywhere by importing: `import { AnayaFindsLogo } from '../components/AnayaFindsLogo.jsx'`

## Props:
- `className`: Additional CSS classes for sizing (e.g., `h-10 w-10`)
- `showText`: Boolean to show/hide the text below the logo (default: true)
- `size`: Size of the logo (default: 200) - not used when className is provided

## Example Usage:
```jsx
// Header logo (no text)
<AnayaFindsLogo className="h-10 w-10" showText={false} />

// Hero logo (with text)
<AnayaFindsLogo className="h-32 w-32 sm:h-40 sm:w-40" showText={true} />
```
