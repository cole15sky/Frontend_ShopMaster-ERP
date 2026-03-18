import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AuthProvider from "./AuthProvider";
import "./globals.css"; // Ensure your Tailwind directives are here

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en" className="h-full bg-gray-50">
      <body className={`${inter.className} h-full antialiased`}>
        <AuthProvider>
          {/* The min-h-screen ensures the background color 
              covers the whole page even if content is short 
          */}
          <main className="min-h-screen">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}