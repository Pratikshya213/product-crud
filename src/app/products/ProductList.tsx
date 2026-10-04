"use client";

import ProductRow from "./ProductRow";
import ProductFilter from "./ProductFilter";
import { useProductFilter } from "../../context/ProductFilterContext";

type Product = {
  id: number;
  name: string;
  price: string;
  category: string;
};

export default function ProductList({
  products,
  canManage,
}: {
  products: Product[];
  canManage: boolean;
}) {
  const { search, sortBy, order } = useProductFilter();
  const normalizedSearch = search.trim().toLowerCase();

  const filteredProducts = products
    .filter((product) => {
      const productText = `${product.name} ${product.category}`.toLowerCase();
      return productText.includes(normalizedSearch);
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return order === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }

      if (sortBy === "price") {
        const priceA = Number(a.price);
        const priceB = Number(b.price);

        return order === "asc"
          ? priceA - priceB
          : priceB - priceA;
      }

      return 0;
    });

  return (
    <section className="catalog-section" aria-label="Product catalog">
      <ProductFilter />

      <div className="table-frame">
        <div className="table-scroll">
          <table className="product-table">
            <thead>
              <tr>
                <th scope="col">Product</th>
                <th scope="col">Category</th>
                <th scope="col">Price</th>
                <th scope="col" className="actions-heading">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => <ProductRow key={product.id} product={product} canManage={canManage} />)
              ) : (
                <tr>
                  <td className="empty-cell" colSpan={4}>
                    <strong>No products found</strong>
                    <span>Try another search or add a product to your catalog.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="table-footer">
          <span>{filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}</span>
          <span>Sorted by {sortBy === "name" ? "name" : "price"}, {order === "asc" ? "ascending" : "descending"}</span>
        </div>
      </div>
    </section>
  );
}
