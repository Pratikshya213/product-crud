# Product CRUD Task

## How to run

1. **Open the project in a Next.js app**
   This frontend-only version uses a static in-memory product list so the UI works without a real backend server.

2. **Run the Next.js app**
   ```
   npm run dev
   ```
   Then open http://localhost:3000/products

## Files included

```
product-crud/
├── src/
│   ├── lib/
│   │   └── axios.ts
│   ├── service/
│   │   └── product.service.tsx
│   ├── actions/
│   │   └── product.action.tsx
│   └── app/
│       └── products/
│           ├── ProductModal.tsx   <- Create form
│           ├── ProductRow.tsx     <- Update + Delete forms
│           └── page.tsx           <- lists all products
├── .env.local
├── NOTES.md                <- explanation of each layer
├── package.json
└── tsconfig.json
```
