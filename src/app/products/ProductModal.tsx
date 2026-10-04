// This is the Create form for a Product.
// It is a Client Component because it needs to show loading/error state.
// Product changes are saved in the browser's local catalog.

"use client";

import { useState, type FormEvent } from "react";
import { toast } from "react-toastify";
import ProductService from "../../service/product.service";

export default function ProductModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      await ProductService.create({
        name: String(formData.get("name") ?? "").trim(),
        price: String(formData.get("price") ?? "").trim(),
        category: String(formData.get("category") ?? "").trim(),
      });

      toast.success("Product added to your catalog.");
      setOpen(false);
    } catch {
      toast.error("Unable to add this product. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button type="button" className="button button-primary add-product-button" onClick={() => setOpen(true)}>
        <span aria-hidden="true">+</span> Add product
      </button>

      {open && (
        <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
          <section className="product-dialog" role="dialog" aria-modal="true" aria-labelledby="add-product-title">
            <div className="dialog-heading">
              <div>
                <p className="eyebrow">NEW CATALOG ITEM</p>
                <h2 id="add-product-title">Add product</h2>
                <p>Enter the product details below.</p>
              </div>
              <button type="button" className="icon-button dialog-close" aria-label="Close add product dialog" onClick={() => setOpen(false)}>×</button>
            </div>

            <form onSubmit={handleCreate} className="product-form">
              <label>Product name<input name="name" placeholder="e.g. Wireless keyboard" required maxLength={100} autoFocus /></label>
              <label>Price<input name="price" type="number" placeholder="0.00" min="0" step="0.01" required /></label>
              <label>Category<input name="category" placeholder="e.g. Electronics" required maxLength={60} /></label>
              <div className="dialog-actions">
                <button type="button" className="button button-quiet" onClick={() => setOpen(false)} disabled={loading}>Cancel</button>
                <button type="submit" className="button button-primary" disabled={loading}>{loading ? "Adding..." : "Add product"}</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
