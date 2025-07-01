import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PCCarousel from '@/components/ui/pc-carousel';

type CarouselItem = {
  id: string | number;
  productUrl: string;
  image?: string;
  title?: string;
  subtitle?: string;
  price?: string;
  originalPrice?: string;
  type?: string;
  videoUrl?: string;
};

type ProductCarouselProps = {
  carouselItems: CarouselItem[];
};

function Carousel({ carouselItems }: ProductCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (autoplay && carouselItems.length > 1) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
      }, 5500);
    }
    return () => interval && clearInterval(interval);
  }, [autoplay, carouselItems]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setAutoplay(false);
  };

  const goToPrevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + carouselItems.length) % carouselItems.length
    );
    setAutoplay(false);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    setAutoplay(false);
  };

  if (!carouselItems || carouselItems.length === 0) return null;

  return (
    <>
      <div className="relative w-full overflow-hidden object-cover mt-4">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {carouselItems.map((item) => (
            <Link
              href={item.productUrl}
              key={item.id}
              className="min-w-full relative cursor-pointer aspect-[4/4] md:aspect-[16/4] lg:aspect-[16/4.4]"
            >
              <div className="relative w-full h-[49vh] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-green-900/40 to-transparent z-10" />
                {item.type === "video" ? (
                  <video
                    src={item.videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full object-cover"
                  />
                ) : (
                  <Image
                    src={item.image || "/api/placeholder/1200/500"}
                    alt={item.title || "Product Image"}
                    fill
                    priority
                    style={{ objectFit: "fill", borderRadius: 0 }}
                  />
                )}
              </div>

              <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-8 md:px-12 z-20">
                <div className="max-w-lg">
                  {item.title && (
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
                      {item.title}
                    </h2>
                  )}
                  {item.subtitle && (
                    <p className="text-base sm:text-lg text-green-100 mb-4">
                      {item.subtitle}
                    </p>
                  )}
                  {(item.price || item.originalPrice) && (
                    <div className="flex items-center gap-3 mb-4">
                      {item.price && (
                        <span className="text-2xl sm:text-3xl font-bold text-amber-500">
                          {item.price}
                        </span>
                      )}
                      {item.originalPrice && (
                        <span className="text-base sm:text-lg line-through text-white/70">
                          {item.originalPrice}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {carouselItems.length > 1 && (
          <>
            <button
              onClick={goToPrevSlide}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-sm hover:bg-white/50 p-2 rounded-full z-30"
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} className="text-white" />
            </button>

            <button
              onClick={goToNextSlide}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-sm hover:bg-white/50 p-2 rounded-full z-30"
              aria-label="Next slide"
            >
              <ChevronRight size={20} className="text-white" />
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-30">
              {carouselItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    currentSlide === index ? "bg-white scale-125" : "bg-white/50"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Carousel;
