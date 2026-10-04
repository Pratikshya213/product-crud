"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { updateProductAction, deleteProductAction } from "../../actions/product.action";

type Product = {
  id: number;
  name: string;
  price: string;
  category: string;
};

export default function ProductRow({ product, canManage }: { product: Product; canManage: boolean }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canManage) return;
    setUpdating(true);

    try {
      const result = await updateProductAction(new FormData(event.currentTarget));

      if (!result.success) {
        toast.error(result.message || "Failed to update product.");
        return;
      }

      toast.success(`${product.name} has been updated.`);
      setEditing(false);
      router.refresh();
    } catch {
      toast.error("Unable to update this product. Please try again.");
    } finally {
      setUpdating(false);
    }
  }

  async function handleDelete() {
    if (!canManage) return;
    setDeleting(true);

    try {
      const result = await deleteProductAction(product.id);

      if (!result.success) {
        toast.error(result.message || "Failed to delete product.");
        return;
      }

      toast.success(`${product.name} has been deleted.`);
      setConfirmDelete(false);
      router.refresh();
    } catch {
      toast.error("Unable to delete this product. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <tr>
      <td className="product-name-cell">
        <>
          <span className="product-name">{product.name}</span>
          <span className="product-id">ID {product.id}</span>
        </>
      </td>
      <td>
        <span className="category-label">{product.category}</span>
      </td>
      <td className="price-cell">
        <span>${Number(product.price).toFixed(2)}</span>
      </td>
      <td className="actions-cell">
        {canManage ? (
          <div className="action-menu-wrap">
            <button
              type="button"
              className="icon-button"
              aria-label={`Actions for ${product.name}`}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              &#8942;
            </button>
            {menuOpen && (
              <div className="action-menu">
                <button type="button" onClick={() => { setEditing(true); setMenuOpen(false); }}>Edit product</button>
                <button type="button" className="menu-danger" onClick={() => { setConfirmDelete(true); setMenuOpen(false); }}>Delete product</button>
              </div>
            )}
          </div>
        ) : <span className="product-id">View only</span>}
        {canManage && editing && (
          <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !updating) setEditing(false); }}>
            <section className="product-dialog" role="dialog" aria-modal="true" aria-labelledby={`edit-title-${product.id}`}>
              <div className="dialog-heading">
                <div>
                  <p className="eyebrow">UPDATE CATALOG ITEM</p>
                  <h2 id={`edit-title-${product.id}`}>Edit product</h2>
                  <p>Update the product details below.</p>
                </div>
                <button type="button" className="icon-button dialog-close" aria-label="Close edit product dialog" onClick={() => setEditing(false)} disabled={updating}>×</button>
              </div>
              <form onSubmit={handleUpdate} className="product-form">
                <input type="hidden" name="id" value={product.id} />
                <label>Product name<input name="name" defaultValue={product.name} required maxLength={100} autoFocus /></label>
                <label>Price<input name="price" type="number" defaultValue={product.price} min="0" step="0.01" required /></label>
                <label>Category<input name="category" defaultValue={product.category} required maxLength={60} /></label>
                <div className="dialog-actions">
                  <button type="button" className="button button-quiet" onClick={() => setEditing(false)} disabled={updating}>Cancel</button>
                  <button type="submit" className="button button-primary" disabled={updating}>{updating ? "Saving..." : "Save changes"}</button>
                </div>
              </form>
            </section>
          </div>
        )}
        {canManage && confirmDelete && (
          <div className="dialog-backdrop" role="presentation">
            <section className="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby={`delete-title-${product.id}`} aria-describedby={`delete-description-${product.id}`}>
              <span className="dialog-mark" aria-hidden="true">!</span>
              <h2 id={`delete-title-${product.id}`}>Delete this product?</h2>
              <p id={`delete-description-${product.id}`}>“{product.name}” will be permanently removed. This action cannot be undone.</p>
              <div className="dialog-actions">
                <button type="button" className="button button-quiet" onClick={() => setConfirmDelete(false)} disabled={deleting}>Keep product</button>
                <button type="button" className="button button-danger" onClick={handleDelete} disabled={deleting}>
                  {deleting ? "Deleting..." : "Delete product"}
                </button>
              </div>
            </section>
          </div>
        )}
      </td>
    </tr>
  );
}
