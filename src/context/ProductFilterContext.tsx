"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type ProductFilterContextType = {
  search: string;
  sortBy: string;
  order: string;
  showFilters: boolean;

  setSearch: (value: string) => void;
  setSortBy: (value: string) => void;
  setOrder: (value: string) => void;
  setShowFilters: (value: boolean) => void;
};

const ProductFilterContext =
  createContext<ProductFilterContextType | undefined>(undefined);

export function ProductFilterProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearchState] = useState(
    searchParams.get("search") || ""
  );

  const [sortBy, setSortByState] = useState(
    searchParams.get("sort") || "name"
  );

  const [order, setOrderState] = useState(
    searchParams.get("order") || "asc"
  );

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setSearchState(searchParams.get("search") ?? "");
    setSortByState(searchParams.get("sort") ?? "name");
    setOrderState(searchParams.get("order") ?? "asc");
  }, [searchParams]);

  function updateURL(
    newSearch: string,
    newSort: string,
    newOrder: string
  ) {
    const params = new URLSearchParams();
    const normalizedSearch = newSearch.trim();

    if (normalizedSearch) {
      params.set("search", normalizedSearch);
    }

    params.set("sort", newSort);
    params.set("order", newOrder);

    const queryString = params.toString();
    const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;

    router.replace(nextUrl, { scroll: false });
  }

  function setSearch(value: string) {
    setSearchState(value);
    updateURL(value, sortBy, order);
  }

  function setSortBy(value: string) {
    setSortByState(value);
    updateURL(search, value, order);
  }

  function setOrder(value: string) {
    setOrderState(value);
    updateURL(search, sortBy, value);
  }

  return (
    <ProductFilterContext.Provider
      value={{
        search,
        sortBy,
        order,
        showFilters,
        setSearch,
        setSortBy,
        setOrder,
        setShowFilters,
      }}
    >
      {children}
    </ProductFilterContext.Provider>
  );
}

export function useProductFilter() {
  const context = useContext(ProductFilterContext);

  if (!context) {
    throw new Error(
      "useProductFilter must be used inside ProductFilterProvider"
    );
  }

  return context;
}