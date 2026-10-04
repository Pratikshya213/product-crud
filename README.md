# Product CRUD Task

## How to run locally

Install the frontend and backend dependencies once:

```bash
npm install
cd backend
npm install
cd ..
```

Start the app and products API together:

```bash
npm run dev
```

Next.js prints the local app URL (usually http://localhost:3000). The product API runs at http://localhost:5000 and reads its initial products from `backend/db.json`.

For a Vercel deployment, set `NEXT_PUBLIC_API_URL` to the URL of a separately hosted products API. Vercel does not run the local JSON server started by the development command.

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
