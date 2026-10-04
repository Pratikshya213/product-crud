# Product Catalog

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Next.js. The starter catalog is bundled from `backend/db.json`; no separate API server or API URL is required.

## Sign-in

- Admin: `admin@gmail.com` / `admin123`
- Client: `client@gmail.com` / `client123`

Clients can view the catalog. Admins can add, edit, and delete products.

## Product data

On first use, the bundled catalog is copied into the browser's local storage. Admin changes persist in that browser after refresh. Each browser has its own catalog.
