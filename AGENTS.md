# Project architecture

This project preserves the user's uploaded DH&Co marketplace application rather than starting from a template.

- `src/App.tsx`: application state and portal routing.
- `src/components/storefront`: catalog, product details, cart, and simulated checkout.
- `src/components/layout`: navigation, currency and demo role selectors, footer.
- `src/components/{buyer,seller,supplier,admin}`: demo management portals.
- `src/services/mockData.ts`: initial sample content.
- `src/services/storage.ts`: synchronous read cache with queued writes to the database API. The cache is transient; Netlify Database is the persistence layer.
- `src/main.tsx`: session bootstrap, loading/error states, and demo/save status banner.
- `src/types`: shared application models.
- `db/schema.ts`: Drizzle schema; `db/index.ts`: server-only database client.
- `netlify/functions/demo-state.mts`: cookie-scoped demo state API. Never expose data from another session or treat the demo role selector as authorization.
- `netlify/database/migrations`: automatically applied platform migrations. Generate schema changes using `npx drizzle-kit generate --name <imperative_snake_case>`; do not apply migrations manually.

Use React function components, TypeScript, and existing Tailwind utility conventions. Preserve the burgundy, charcoal, gold palette and Cinzel/Plus Jakarta Sans typography. Persistent state must use Netlify platform storage. Do not add browser storage as a persistence fallback.

Checkout, supplier actions, role switching, and the administrator console are demonstrations, not live commerce or authentication. Keep this distinction visible. Production commerce requires a separate implementation of authentication, server-side permissions, validated order calculations, real payment confirmation, and supplier integrations. Never add payment credentials to client state.

Use `netlify dev --port 8889` for local development. The Netlify build uses `npm run build` and publishes `dist`, with SPA routing configured in `netlify.toml`.
