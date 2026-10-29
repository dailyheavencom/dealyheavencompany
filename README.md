# DH&Co — Daily Heaven & Company

A luxury marketplace demonstration restored from the supplied React application. It includes product search and filtering, product details, shopping bag, wishlist, currency selection, simulated checkout, and buyer, seller, supplier, and administrator demo portals.

Built with React 19, TypeScript, Vite, Tailwind CSS, Motion, and Lucide icons. Netlify Functions and Netlify Database with Drizzle store each browser's demo state separately using an HTTP-only session cookie. The database schema and migrations are deployed automatically by Netlify.

## Local development

Install Node.js 22 or newer, run `npm install`, then run `netlify dev --port 8889` from a linked Netlify project. Visit http://localhost:8889. This provides both the Vite frontend and the server functions. `npm run build` creates the production frontend in `dist`.

## Scope

This is a demo marketplace. The role selector previews interfaces and does not authenticate users. Checkout simulates payment and fulfillment; it does not charge a payment provider or place supplier orders. Sample products, orders, contacts, and policies originate from the supplied application. Do not enter payment credentials or sensitive personal information. A production marketplace requires authenticated accounts, authorization, payment processing, and supplier integrations.

The database session lasts 30 days in the current browser. Clearing the session cookie starts a fresh demo. Changes are saved asynchronously with a visible retry notice when persistence is unavailable.
