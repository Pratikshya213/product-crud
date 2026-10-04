# Notes — Product Module

## What each layer does

- **.env.local** — Stores the backend URL (`NEXT_PUBLIC_API_URL`) in one place, so
  it's never hardcoded anywhere in the code.

- **lib/axios.ts** — Creates one shared axios instance that reads the base URL
  from `.env.local`. Every service reuses this same instance instead of each
  one configuring its own.

- **service/product.service.tsx** — The only file that actually calls the
  backend (via axios). It exposes plain functions: `getAll`, `getById`,
  `create`, `update`, `delete`. It doesn't know anything about forms or
  Server Actions — it just talks to the API.

- **actions/product.action.tsx** — Server Actions (`"use server"`). They read
  the raw `FormData` coming from the form, turn it into a clean payload
  object, call the matching service function, and wrap everything in
  try/catch so errors don't crash the app. They also call `revalidatePath`
  so the page refreshes after a change.

- **app/products/ProductModal.tsx** — The Create form. A Client Component
  because it needs to show a loading/error state while the request is in
  flight. It imports the action, not the service.

- **app/products/ProductRow.tsx** — The Update + Delete forms for a single
  product, same idea as ProductModal (Client Component, shows
  loading/error state).

- **app/products/page.tsx** — A Server Component. It fetches the product
  list directly using the service (no `useEffect`, no loading spinner
  needed just to show the list) and renders `ProductModal` +
  `ProductRow` for each product.

## Why the form never calls axios or the service directly

Each layer should only know about the layer right below it:

`form → action → service → axios → backend`

If the form called axios (or the service) directly:
- Every form would need to know the API's URL and shape.
- Error handling and revalidation logic would have to be repeated in every
  form instead of living in one place (the action).
- Server Actions wouldn't work properly, since the form's `action` prop is
  meant to point at a Server Action, not a random async function that
  touches the network on the client.

Keeping this separation means if the backend changes (say, a different
endpoint or a different library instead of axios), only `lib/axios.ts` and
`service/product.service.tsx` need to change — the forms and actions stay
exactly the same.
