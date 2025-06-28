"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useEffect, useState } from "react";
import SplashScreen from "../splash-screen";
import { SessionProvider } from "next-auth/react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPath = pathname?.startsWith("/admin");
  const isHome = pathname === "/";
  const [isLoading, setIsLoading] = useState(isHome);

  useEffect(() => {
    if (isLoading) return;
  }, [isLoading]);

  return (
    <SessionProvider>
      {isLoading && isHome ? (
        <SplashScreen
          finishLoader={() => {
            setIsLoading(false);
          }}
        />
      ) : (
        <>
          {!isAdminPath && <Header />}
          <main className="min-h-screen">{children}</main>
          {!isAdminPath && <Footer />}
        </>
      )}
    </SessionProvider>
  );
}
