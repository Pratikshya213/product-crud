// Service layer for Product.
// This file is the only layer that talks to the static JSON backend.

import api from "../lib/axios";

type Product = {
  id: number;
  name: string;
  price: string;
  category: string;
};

const ProductService = {
  getAll: async () => {
    const res = await api.get<Product[]>("/products");
    const data: unknown = res.data;
    if (Array.isArray(data)) return data as Product[];
    if (data && typeof data === "object" && Array.isArray((data as { products?: unknown }).products)) {
      return (data as { products: Product[] }).products;
    }
    throw new Error("The products API did not return a product list.");
  },

  getById: async (id: number) => {
    const res = await api.get<Product>(`/products/${id}`);
    return res.data;
  },

  create: async (payload: { name: string; price: string; category: string }) => {
    const res = await api.post<Product>("/products", payload);
    return res.data;
  },

  update: async (
    id: number,
    payload: { name: string; price: string; category: string }
  ) => {
    const res = await api.put<Product>(`/products/${id}`, payload);
    return res.data;
  },

  delete: async (id: number) => {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  },
};

export default ProductService;
