"use client";
import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <p className="text-gray-600 mb-4">
              Discover the ancient power of pure Himalayan Shilajit with
              ShaastraYog. We bring you the highest quality Shilajit
              supplements, rich in essential minerals and bioactive compounds.
              Experience enhanced vitality, energy, and natural balance with our
              authentic products. Transform your well-being with nature's most
              potent mineral supplement.
            </p>
            <div className="flex space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  window.open(
                    "https://www.facebook.com/people/Shaastra-Yog/pfbid025gBhazMiUMGeepddJP66P6EwpDvT2P9XWrNmorMAG5yZxhb7A7tHYb1SN6LmNPAml/",
                    "_blank"
                  )
                }
              >
                <Facebook className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  window.open(
                    "https://www.instagram.com/shaastrayog_/",
                    "_blank"
                  )
                }
              >
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Twitter className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/shop"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Available On</h3>
            <div className=" gap-2">
              <Link
                href={"https://www.amazon.in/s?k=shaastrayog"}
                target="_blank"
                className="flex row gap-2 mt-4"
              >
                <Image
                  src={"/images/amazon.png"}
                  height={20}
                  width={30}
                  alt={"Amazon"}
                  className="rounded-xl"
                />
                Amazon
              </Link>
              <Link
                href={"https://www.flipkart.com/search?q=shaastrayog"}
                target="_blank"
                className="flex row gap-2 mt-4"
              >
                <Image
                  src={"/images/flipkart.png"}
                  height={20}
                  width={30}
                  alt={"Flipkart"}
                  className="rounded-xl"
                />
                Flipkart
              </Link>

              <Link
                href={"https://www.snapdeal.com/search?keyword=shaastrayog"}
                target="_blank"
                className="flex row gap-2   mt-4"
              >
                <Image
                  src={"/images/snapdeal.png"}
                  height={20}
                  width={30}
                  alt={"Snapdeal"}
                  className="rounded-xl"
                />
                Snapdeal
              </Link>

              <Link
                href={
                  "https://www.netmeds.com/catalogsearch/result?q=shaastrayog"
                }
                target="_blank"
                className="flex row gap-2  mt-4"
              >
                <Image
                  src={"/images/netmeds.png"}
                  height={20}
                  width={30}
                  className="rounded-xl"
                  alt={"Netmeds"}
                />
                Netmeds
              </Link>

              <Link
                href={"https://pharmeasy.in/search?name=shaastrayog"}
                target="_blank"
                className="flex row gap-2  mt-4"
              >
                <Image
                  src={"/images/pharmeasy.png"}
                  height={20}
                  width={30}
                  alt={"Pharmeasy"}
                  className="rounded-xl"
                />
                Pharmeasy
              </Link>
              <Link
                href={
                  "https://www.apollopharmacy.in/search-medicines?q=shaastrayog"
                }
                target="_blank"
                className="flex row gap-2  mt-4"
              >
              </Link>

              <Link
                href={"https://www.1mg.com/search/all?name=shaastrayog"}
                target="_blank"
                className="flex row gap-2  mt-4 rounded-xl"
              >
                <Image
                  src={"/images/1mg.png"}
                  height={20}
                  width={30}
                  alt={"1mg"}
                  className="rounded-xl"
                />
                1mg
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/faq"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-600 mb-4">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <div className="flex">
              <Input
                type="email"
                placeholder="Enter your email"
                className="rounded-r-none focus-visible:ring-0"
              />
              <Button className="rounded-l-none">Subscribe</Button>
            </div>
          </div> */}
        </div>

        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row gap-2 justify-between items-center">
            <p className="text-gray-600 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Shaastrayog. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <img
                src="/images/visa.png"
                alt="Visa"
                className="h-8"
              />
              <img
                src="/images/mastercard.png"
                alt="Mastercard"
                className="h-6"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
