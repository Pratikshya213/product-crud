export type Product = {
  id: number;
  name: string;
  price: string;
  category: string;
};

// Starter catalog shown when the configured products API is unavailable.
const defaultProducts: Product[] = [
  { id: 1, name: "Wireless Mouse", price: "25.99", category: "Electronics" },
  { id: 2, name: "Notebook", price: "3.50", category: "Stationery" },
  { id: 4, name: "Laptop", price: "750.00", category: "Electronics" },
  { id: 5, name: "Cup", price: "35", category: "Essential" },
  { id: 6, name: "Computer", price: "3.50", category: "Stationery" },
  { id: 7, name: "Colour", price: "25", category: "Stationery" },
  { id: 8, name: "Charger", price: "45", category: "Electronics" },
];

export default defaultProducts;
