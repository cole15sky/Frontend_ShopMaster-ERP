import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AuthProvider from "./AuthProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ShopApp Pro | Billing & Inventory",
  description: "All-in-one solution for shop billing, stock, and e-commerce.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${inter.className} h-full antialiased bg-gray-50`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}