# Commerce Module

This directory houses the Shopify-like domain modules. Each module exposes typed models, API helpers, hooks, and UI components so we can iterate quickly while keeping responsibilities isolated.

- `products/` – product models, API clients, hooks, and admin UI widgets.
- `orders/`, `customers/`, `discounts/`, `settings/`, `analytics/` – typed contracts for upcoming modules.

All new UI should consume these modules through hooks/components to keep the dashboard modular and compatible with the 21st.dev workflow.
