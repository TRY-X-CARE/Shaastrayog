"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/product-card";
import { featuredProducts } from "@/lib/data";
import Carousel from "@/components/ui/carousel";
import PCCarousel from "@/components/ui/pc-carousel";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import FeaturesSection from "@/components/ui/features-section";
import Script from "next/script";
import MarqueeCarousel from "@/components/ui/marquee-carousel";
import Image from "next/image";

const carouselItems = [
  {
    id: 1,
    type: "video",
    videoUrl: "/videos/mobile_splash.mp4",
    productUrl: "/shop",
  },
  {
    id: 2,
    type: "video",
    videoUrl: "/videos/MOBILE UPPER SLIDING.mp4",
    productUrl: "/product/prod2",
  },
  {
    id: 3,
    type: "video",
    videoUrl: "/videos/MOBILE UPPER SLIDING 2.mp4",
    productUrl: "/product/prod2",
  },
];

export default function HomeClient() {
  const [showSplash, setShowSplash] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if the user has already seen the splash screen
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");

    if (hasSeenSplash) {
      setShowSplash(false);
    } else {
      const timer = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem("hasSeenSplash", "true");
      }, 6500); // Video length + buffer

      return () => clearTimeout(timer);
    }

    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile === null) {
    // Optionally show a loader or nothing
    return null;
  }

  return (
    <>
      <Script id="organization-ld-json" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "ShaastraYog",
          "url": "https://shaastrayog.com",
          "logo": "https://shaastrayog.com/images/icon.png",
          "sameAs": [
            "https://www.instagram.com/shaastrayog_/"
          ],
          "description": "ShaastraYog offers pure Himalayan Shilajit and premium Ayurvedic wellness products. Shop now for authentic, natural health solutions."
        })}
      </Script>
      <SpeedInsights/>
      <Analytics />
      {/* Hero Section */}
      <section className="relative bg-gray-50 top-20">
        {isMobile ? <Carousel carouselItems={carouselItems} /> : <PCCarousel />}
      </section>

      <section className="py-12 bg-gray-50 mt-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="bg-[#faf6f1] rounded-lg p-6 content-center mb-10 w-[100%] xs:w-[50%]">
              <h2 className="text-3xl font-bold text-center">
                Featured Products
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link href="/shop">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-2 md:py-14 bg-gray-50 p-[10px]">
        <div className="container p-4  mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <Link href={`/product/prod2`}>
            <Image
              src="/images/pure_shilajeet.jpg"
              alt="Yoga"
              width={550}
              height={350}
              className="w-[550px] h-[350px] rounded-lg shadow-lg"
              loading="lazy"
            />
          </Link>
          <div className="w-full  flex flex-col  gap-6">
            <h3 className="text-2xl md:text-4xl font-bold text-center">
              Premium Quality Shilajit
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Shilajit is rich in nutrients such as mineral salts, amino acids,
              and other organic components including benzoic acid, hippuric
              acid, fatty acids. Although shilajit is
              sometimes referred to as a mineral tar or resin, it is neither. It
              is a highly viscous substance like a tar or resin, that is very
              dark brown or black in color, but unlike these is readily soluble
              in water but insoluble in ethanol. It contains more than 20
              elements, including Ca, Mg, Na, Fe, Cr, Pb. It also contains solid
              paraffin hydrocarbons, proteins, carbohydrates, amino acids, fatty
              acids, and alcohols.[9] The mineral content is 15–20%, along with
              trace elements including selenium.
            </p>
            <div className="flex justify-center md:justify-start ">
              <Button size="lg" asChild>
                <Link href={`/product/prod2`}>Shop Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      <MarqueeCarousel />

      <section className="bg-gray-50 mb-8 p-[10px]">
        <div className="container mx-auto flex flex-col-reverse p-4 md:flex-row justify-between items-center gap-6">
          <div className="w-full  flex flex-col gap-4">
            <h3 className="text-2xl md:text-4xl font-bold text-center md:text-left">
            Shilajit: Nature’s Ancient Elixir for Vitality
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed pr-4">
            Shilajit, revered for centuries in Ayurvedic tradition, is a potent natural substance formed from the slow decomposition of plant matter in the Himalayan mountains. Known as the "destroyer of weakness," it is rich in fulvic acid, minerals, and bioactive compounds that help rejuvenate the body and mind. Shilajit is believed to boost energy, enhance stamina, support cognitive function, and promote overall vitality. Its adaptogenic properties help the body manage stress, while its antioxidant content aids in cellular protection and healthy aging. Experience the ancient power of Shilajit and unlock your natural potential for wellness and vigor.
            </p>
            <div className="flex justify-center md:justify-start ">
              <Button size="lg" asChild>
                <Link href={`/product/prod1`}>Shop Now</Link>
              </Button>
            </div>
          </div>
          <Link href={`/product/prod1`}>
            <Image
              alt="dash"
              src="/images/16.png"
              className="w-[550px] h-[350px] rounded-lg shadow-lg"
              width={550}
              height={350}
              loading="lazy"
            />
          </Link>
        </div>
      </section>

      <section className="py-16 bg-gray-50 p-[10px] ">
        <div className="container p-4  mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <Link href="/shop">
            <Image
              src={"/images/1.png"}
              alt="Yoga"
              width={550}
              height={350}
              className="w-[550px] h-[350px] rounded-lg shadow-lg"
              loading="lazy"
            />
          </Link>
          <div className="w-full  flex flex-col  gap-6">
            <h3 className="text-2xl md:text-4xl font-bold text-center">
              Explore Our Range of Ayurvedic Products
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              Discover a curated selection of authentic Ayurvedic products
              designed to support your holistic wellness journey. From herbal
              supplements to natural skincare, our offerings are rooted in
              tradition and backed by modern science.
              Experience the power of nature with our premium Ayurvedic
              products, crafted to enhance your health and well-being. Each
              product is carefully formulated using time-tested ingredients,
              ensuring you receive the highest quality and effectiveness.
            </p>
            <div className="flex justify-center md:justify-start ">
              <Button size="lg" asChild>
                <Link href="/shop">Shop All</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <FeaturesSection />

      <section className="my-10">
        <div className="container mx-auto px-4">
          <div className="flex  justify-center">
            <div className="bg-[#faf6f1] rounded-lg p-6 content-center mb-10 w-[100%] xs:w-[50%]">
              <h2 className="text-3xl font-bold text-center">
                What Our Customers Say
              </h2>
            </div>
          </div>

          <div className="w-full overflow-hidden">
            <div
              className="flex w-max animate-marquee-testimonial items-center"
              style={{ animation: "marquee-testimonial 10s linear infinite" }}
            >
              {[0, 1].map((groupIdx) => (
                <div className="flex" key={groupIdx}>
                  {/* Testimonial 1 */}
                  <div className="testimonial-card p-8 rounded-lg shadow-md mx-4 min-w-[320px] max-w-xs flex-shrink-0">
                    <div className="flex items-center mb-4">
                      <Image
                        src="/images/testi3.png"
                        alt="Customer"
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover mr-4"
                        loading="lazy"
                      />
                      <div>
                        <h4 className="font-semibold">Raj Kumar</h4>
                        <div className="flex text-yellow-400">
                          <span>★</span>
                          <span>★</span>
                          <span>★</span>
                          <span>★</span>
                          <span>★</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-lg text-gray-600">
                      &ldquo;My journey at Shaastrayog has been nothing short of
                      transformative. The combination of ancient wisdom and modern
                      techniques has helped me find a deeper connection to myself. The
                      workshops are engaging, and the community is incredibly
                      supportive. I leave every session feeling rejuvenated and
                      inspired!&ldquo;
                    </p>
                  </div>
                  {/* Testimonial 2 */}
                  <div className="testimonial-card p-8 rounded-lg shadow-md mx-4 min-w-[320px] max-w-xs flex-shrink-0">
                    <div className="flex items-center mb-4">
                      <Image
                        src="/images/testi2.png"
                        alt="Customer"
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover mr-4"
                        loading="lazy"
                      />
                      <div>
                        <h4 className="font-semibold">Arif Mohammad </h4>
                        <div className="flex text-yellow-400">
                          <span>★</span>
                          <span>★</span>
                          <span>★</span>
                          <span>★</span>
                          <span>★</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600">
                      &ldquo;ShaastraYog has truly changed my life. The personalized
                      consultations provided me with insights into my health that I
                      never knew I needed. The practitioners are knowledgeable and
                      genuinely care about each individual's journey. I feel
                      healthier, both physically and mentally, than ever
                      before.&ldquo;
                    </p>
                  </div>
                  {/* Testimonial 3 */}
                  <div className="testimonial-card p-8 rounded-lg shadow-md mx-4 min-w-[320px] max-w-xs flex-shrink-0">
                    <div className="flex items-center mb-4">
                      <Image
                        src="/images/testi1.png"
                        alt="Customer"
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover mr-4"
                        loading="lazy"
                      />
                      <div>
                        <h4 className="font-semibold">Samir</h4>
                        <div className="flex text-yellow-400">
                          <span>★</span>
                          <span>★</span>
                          <span>★</span>
                          <span>★</span>
                          <span>★</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600">
                      &ldquo;I was a complete beginner when I first joined, and I was
                      nervous about trying yoga. The warm, welcoming atmosphere at
                      ShaastraYog made all the difference. The instructors guide you
                      every step of the way, and I now look forward to my yoga
                      sessions. It's not just exercise; it's a path to
                      self-discovery.&ldquo;
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <style jsx global>{`
              @keyframes marquee-testimonial {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
            `}</style>
          </div>
        </div>
      </section>
    </>
  );
} 