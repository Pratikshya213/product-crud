import database from "../../backend/db.json";

export type Product = {
  id: number;
  name: string;
  price: string;
  category: string;
};

// This bundled JSON catalog seeds local browser storage on first use.
const defaultProducts: Product[] = database.products;

export default defaultProducts;
