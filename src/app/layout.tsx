import type { Metadata } from "next";
import React from "react";
import "./globals.css";
import ToastProvider from "./ToastProvider";

export const metadata: Metadata = {
  title: "Product CRUD",
  description: "Product management dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
