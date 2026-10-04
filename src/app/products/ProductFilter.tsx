"use client";

import { useProductFilter } from "../../context/ProductFilterContext";

export default function ProductFilter() {
  const {
    search,
    sortBy,
    order,
    showFilters,
    setSearch,
    setSortBy,
    setOrder,
    setShowFilters,
  } = useProductFilter();

  return (
    <div className="filter-bar">
      <div className="search-control">
        <span aria-hidden="true" className="search-icon">⌕</span>
        <input
          type="text"
          placeholder="Search products"
          aria-label="Search products"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="button button-filter"
          aria-expanded={showFilters}
        >
          <span aria-hidden="true">≡</span> Filters {showFilters ? "−" : "+"}
        </button>
      </div>

      {showFilters && (
        <div className="filter-options">
          <label className="filter-field">
            <span>Sort by</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="name">Product name</option>
              <option value="price">Price</option>
            </select>
          </label>
          <button type="button" className="button button-filter" onClick={() => setOrder(order === "asc" ? "desc" : "asc")}>
            {sortBy === "name" ? (order === "asc" ? "A to Z" : "Z to A") : (order === "asc" ? "Low to high" : "High to low")}
          </button>
        </div>
      )}
    </div>
  );
}