"use client";

import { ThemeProvider } from "next-themes";
import { CartProvider } from "@/components/cart/cart-provider";
import { AuthProvider } from "@/components/auth/auth-provider";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AuthProvider>
        <CartProvider>
          {children}
          <Toaster richColors position="bottom-right" />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
