# 3D Spline Background Setup Guide

## Overview

The storefronts now support 3D Spline backgrounds for immersive, interactive 3D scenes. This feature is optional and gracefully falls back to image backgrounds if not configured.

## Installation

The required packages are already installed:
- `@splinetool/react-spline`
- `@splinetool/runtime`

## Setup Instructions

### 1. Create Your Spline Scenes

1. Go to [spline.design](https://spline.design)
2. Create a new 3D scene or use an existing one
3. Design your scene with:
   - Oceanic/coastal themes for brand consistency
   - Calm, flowing animations
   - Cool color palette (Navy #0A192F, Ocean Blue #1B98E0)
4. Export your scene and get the scene URL

### 2. Configure Environment Variables

Add the following to your `.env` file:

```env
# Products Storefront Spline Scene URL
VITE_PRODUCTS_SPLINE_SCENE=https://prod.spline.design/YOUR_SCENE_URL.splinecode

# Spa Storefront Spline Scene URL
VITE_SPA_SPLINE_SCENE=https://prod.spline.design/YOUR_SCENE_URL.splinecode
```

### 3. Scene Design Recommendations

#### For Products Storefront (`VITE_PRODUCTS_SPLINE_SCENE`)
- **Theme**: Retail, shopping, products floating
- **Colors**: Navy (#0A192F), Ocean Blue (#1B98E0), Soft Gray (#F2F2F2)
- **Elements**: Product showcases, shopping bags, coastal elements
- **Animation**: Gentle floating, slow rotation
- **Camera**: Static or slow pan (non-interactive for background)

#### For Spa Storefront (`VITE_SPA_SPLINE_SCENE`)
- **Theme**: Wellness, relaxation, spa elements
- **Colors**: Warm amber accents, ocean blues, soft lighting
- **Elements**: Spa stones, water droplets, calming shapes
- **Animation**: Flowing, meditative movements
- **Camera**: Static or gentle movement

### 4. Best Practices

1. **Performance**:
   - Keep polygon count reasonable (< 50k triangles)
   - Use simple materials and textures
   - Avoid complex lighting calculations
   - Test on mobile devices

2. **Design**:
   - Keep backgrounds subtle (opacity: 0.7)
   - Ensure text remains readable over the scene
   - Use the overlay gradient for text contrast
   - Match the oceanic brand aesthetic

3. **Interactivity**:
   - Backgrounds are set to `interactive={false}` by default
   - This prevents user interaction that could interfere with the UI
   - Set `interactive={true}` only if you want user interaction

## How It Works

### Component Structure

```jsx
<SplineBackground 
  sceneUrl={import.meta.env.VITE_PRODUCTS_SPLINE_SCENE}
  className="z-0"
  interactive={false}
  opacity={0.7}
/>
```

### Fallback Behavior

- If no Spline scene URL is provided, the storefront uses the image background
- If the Spline scene fails to load, it gracefully falls back to a gradient
- The overlay gradient ensures text remains readable

### Customization

You can customize the Spline background by modifying the component props:

- `sceneUrl`: The Spline scene URL (required)
- `className`: Additional CSS classes
- `interactive`: Enable/disable user interaction (default: false)
- `opacity`: Background opacity 0-1 (default: 0.7)

## Testing

1. **Without Spline** (default):
   - Storefronts work normally with image backgrounds
   - No configuration needed

2. **With Spline**:
   - Add environment variables
   - Restart dev server: `npm run dev`
   - Check browser console for any loading errors
   - Verify the 3D scene appears in the background

## Troubleshooting

### Scene Not Loading
- Check the scene URL is correct and accessible
- Verify the URL starts with `https://prod.spline.design/`
- Check browser console for CORS or loading errors
- Ensure the scene is published/exported correctly

### Performance Issues
- Reduce polygon count in your Spline scene
- Simplify materials and textures
- Disable unnecessary animations
- Test on different devices

### Text Readability
- Adjust the overlay gradient opacity
- Modify the Spline background opacity
- Ensure sufficient contrast between text and background

## Example Scene URLs

You can use these example scenes for testing (replace with your own):

```env
# Example (replace with your actual scene URLs)
VITE_PRODUCTS_SPLINE_SCENE=https://prod.spline.design/example-products-scene.splinecode
VITE_SPA_SPLINE_SCENE=https://prod.spline.design/example-spa-scene.splinecode
```

## Support

For Spline-specific questions:
- [Spline Documentation](https://docs.spline.design)
- [Spline Community](https://discord.gg/spline)

For integration issues:
- Check the component code in `src/components/SplineBackground.jsx`
- Review the storefront implementations in `src/storefront/`

