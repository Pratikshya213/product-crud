// Server Actions for Product.
// This layer sits between the form and the service.
// It reads FormData coming from the form, calls the service,
// and handles any errors so the UI never has to deal with axios directly.

"use server";

import ProductService from "../service/product.service";
import { revalidatePath } from "next/cache";

// CREATE
export async function createProductAction(formData: FormData) {
  try {
    const payload = {
      name: formData.get("name") as string,
      price: formData.get("price") as string,
      category: formData.get("category") as string,
    };

    await ProductService.create(payload);

    // Refresh the products page so the new product shows up
    revalidatePath("/products");

    return { success: true };
  } catch (error) {
    console.log("Error occurred:", error);
    return { success: false, message: "Failed to create product" };
  }
}

// UPDATE
export async function updateProductAction(formData: FormData) {
  try {
    const id = Number(formData.get("id"));
    const name = String(formData.get("name") ?? "").trim();
    const price = String(formData.get("price") ?? "").trim();
    const category = String(formData.get("category") ?? "").trim();

    if (!Number.isInteger(id) || id < 1 || !name || !category || !Number.isFinite(Number(price)) || Number(price) < 0) {
      return { success: false, message: "Enter a valid name, category, and non-negative price." };
    }

    const payload = {
      name,
      price,
      category,
    };

    await ProductService.update(id, payload);

    revalidatePath("/products");

    return { success: true };
  } catch (error) {
    console.log("Error occurred:", error);
    return { success: false, message: "Failed to update product" };
  }
}

// DELETE
export async function deleteProductAction(id: number) {
  try {
    if (!Number.isInteger(id) || id < 1) {
      return { success: false, message: "Invalid product id." };
    }

    await ProductService.delete(id);

    revalidatePath("/products");
    return { success: true };
  } catch (error) {
    console.log("Error occurred:", error);
    return { success: false, message: "Failed to delete product" };
  }
}
