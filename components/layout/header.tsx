"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "../../components/cart/cart-provider";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/auth-provider";
import Image from "next/image";
import { default as icon } from "../../app/assets/image/icon.png";
import { useSession } from "next-auth/react";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cartContext = useCart();
  const {  signOut } = useAuth();
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white",
        isScrolled ? "shadow-md py-2" : "py-4"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/">
          <Image
            src={"/images/icon.png"}
            alt="Logo"
            width={150}
            height={50}
            className="h-16 w-20"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <Link
            href="/"
            className="text-gray-800 hover:text-primary transition-colors"
          >
            Home
          </Link>
          <Link
            href="/shop"
            className="text-gray-800 hover:text-primary transition-colors"
          >
            Catalogue
          </Link>
          <Link
            href="/contact"
            className="text-gray-800 hover:text-primary transition-colors"
          >
            Contact
          </Link>
          <Link
            href="/about"
            className="text-gray-800 hover:text-primary transition-colors"
          >
            About
          </Link>
          <Link
            href="/order-track"
            className="text-gray-800 hover:text-primary transition-colors"
          >
            Track Order
          </Link>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          {status === "authenticated" ? (
            <>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/profile">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="ghost" onClick={() => signOut()}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}

          <Button variant="ghost" size="icon" asChild className="relative">
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {cartContext.totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartContext.totalItems}
                </span>
              )}
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          size="icon"
          className="md:hidden"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white w-full py-4 px-4 shadow-lg">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/"
              className="text-gray-800 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="text-gray-800 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="text-gray-800 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-gray-800 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/order-track"
              className="text-gray-800 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Track Order
            </Link>
            <div className="flex items-center justify-between pt-4 border-t">
              {status === "authenticated" ? (
                <>
                  <Button variant="outline" asChild className="w-full mr-2">
                    <Link
                      href="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      My Account
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full ml-2"
                    onClick={() => {
                      signOut();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" asChild className="w-full mr-2">
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full ml-2">
                    <Link
                      href="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </Button>
                </>
              )}
              <Button
                variant="outline"
                asChild
                className="w-full ml-2 relative"
              >
                <Link href="/cart" onClick={() => setIsMobileMenuOpen(false)}>
                  Cart
                  {cartContext.totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartContext.totalItems}
                    </span>
                  )}
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
