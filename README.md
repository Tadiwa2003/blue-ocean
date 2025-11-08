# Blue Ocean

A premium coastal-luxury marketplace landing experience built with React, Vite, and Tailwind CSS. Showcase ocean-inspired product capsules, partnerships, and storytelling content for the Blue Ocean brand.

## Stack

- React 18 with Vite for fast development
- Tailwind CSS for utility-first styling
- Custom gradients, typography, and SVG logo for an elevated coastal aesthetic

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the development server:

   ```bash
   npm run dev
   ```

3. Build for production:

   ```bash
   npm run build
   ```

## Project Structure

- `src/components` – Reusable UI elements including the bespoke Blue Ocean logo, navigation, and cards
- `src/sections` – Page sections composed from components and data
- `src/data` – Structured content for product capsules and testimonials
- `tailwind.config.js` – Theme customizations for the oceanic palette and effects

## Customization Tips

- Update capsule products and testimonials inside `src/data` to reflect live inventory and partners.
- Tailwind theme colors live in `tailwind.config.js`; adjust to align with evolving brand tones.
- Swap hero gradients, background textures, or logo styling by editing `Hero`, `App`, and `Logo` components.

## Deployment

Use any static hosting provider that supports Vite builds (Vercel, Netlify, Cloudflare Pages, etc.). The production build outputs static assets in `dist/` after running `npm run build`.
