import defaultProducts, { type Product } from "../lib/defaultProducts";

const PRODUCTS_KEY = "productCrudProducts";
const PRODUCTS_UPDATED_EVENT = "product-crud-products-updated";

type ProductInput = Omit<Product, "id">;

function save(products: Product[]) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  window.dispatchEvent(new Event(PRODUCTS_UPDATED_EVENT));
}

function readProducts(): Product[] {
  if (typeof window === "undefined") return [...defaultProducts];

  try {
    const stored = localStorage.getItem(PRODUCTS_KEY);
    if (!stored) {
      const initial = [...defaultProducts];
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(initial));
      return initial;
    }

    const parsed: unknown = JSON.parse(stored);
    if (
      Array.isArray(parsed) &&
      parsed.every((item) =>
        item &&
        Number.isInteger(item.id) &&
        typeof item.name === "string" &&
        typeof item.category === "string" &&
        Number.isFinite(Number(item.price))
      )
    ) {
      return parsed as Product[];
    }
  } catch {
    // Replace malformed browser data with the bundled starter catalog.
  }

  const initial = [...defaultProducts];
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(initial));
  return initial;
}

const ProductService = {
  async getAll() {
    return readProducts();
  },

  async getById(id: number) {
    return readProducts().find((product) => product.id === id) ?? null;
  },

  async create(payload: ProductInput) {
    const products = readProducts();
    const id = products.reduce((largest, product) => Math.max(largest, product.id), 0) + 1;
    const product = { ...payload, id };
    save([...products, product]);
    return product;
  },

  async update(id: number, payload: ProductInput) {
    const products = readProducts();
    if (!products.some((product) => product.id === id)) {
      throw new Error("Product not found.");
    }

    const updated = products.map((product) =>
      product.id === id ? { ...payload, id } : product
    );
    save(updated);
    return updated.find((product) => product.id === id)!;
  },

  async delete(id: number) {
    const products = readProducts();
    if (!products.some((product) => product.id === id)) {
      throw new Error("Product not found.");
    }
    save(products.filter((product) => product.id !== id));
  },
};

export { PRODUCTS_UPDATED_EVENT };
export default ProductService;
