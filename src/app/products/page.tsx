"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ProductService from "../../service/product.service";
import ProductModal from "./ProductModal";
import ProductList from "./ProductList";
import LogoutButton from "./LogoutButton";
import { ProductFilterProvider } from "../../context/ProductFilterContext";

export default function ProductsPage() {
  const router = useRouter();

  const [role, setRole] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    const userRole = localStorage.getItem("role");

    // If user is not logged in
    if (!loggedIn) {
      router.push("/login");
      return;
    }

    // Save role
    setRole(userRole || "");

    // Get products
    const getProducts = async () => {
      try {
        const data = await ProductService.getAll();
        setProducts(data);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, [router]);

  // Show loading while checking login
  if (!role || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <ProductFilterProvider>
      <div className="page-shell">

        <header className="page-header">
  <div>
    <p className="eyebrow">INVENTORY / CATALOG</p>

    <h1>Products</h1>

    <p className="page-description">
      Manage your catalog, pricing, and product details.
    </p>
  </div>

  <div className="flex items-center gap-3">
    {role === "admin" && <ProductModal />}

    <LogoutButton />
  </div>
</header>
        {/* CATALOG HEADING */}
        <div className="catalog-heading">
          <div>
            <h2>All products</h2>

            <p>
              Your complete product catalog in one place.
            </p>
          </div>
        </div>

        {/* CLIENT MESSAGE */}
        {role === "client" && (
          <p className="text-gray-500 mb-4">
            You are logged in as a client. You can view products only.
          </p>
        )}

        {/* PRODUCTS */}
        <ProductList products={products} canManage={role === "admin"} />

      </div>
    </ProductFilterProvider>
  );
}
