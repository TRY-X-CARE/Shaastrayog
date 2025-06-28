import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const carouselItems = [
  {
    id: 1,
    productUrl: "#",
    type: "video",
    videoUrl: "/videos/Upper_Sliding_1.mp4",
  },
  {
    id: 2,
    productUrl: "#",
    type: "video",
    videoUrl: "/videos/Upper_Sliding_2.mp4",
  },
  {
    id: 3,
    productUrl: "#",
    image: "/images/Upper_Sliding_3.png",
  },
];

function PCCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (autoplay && carouselItems.length > 1 && !isHovered) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
      }, 6000);
    }
    return () => interval && clearInterval(interval);
  }, [autoplay, isHovered, currentSlide]);

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

  return (
    <>
      <div
        className="relative w-full overflow-hidden group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {carouselItems.map((item) => (
            <Link
              href={item.productUrl}
              key={item.id}
              className="min-w-full relative cursor-pointer aspect-[16/6] md:aspect-[16/6] sm:aspect-[16/8] xs:aspect-[16/10]"
            >
              <div className="relative w-full h-full">
                <div className="absolute inset-0 bg-gradient-to-r from-green-900/40 to-transparent z-10" />
                {item.type === "video" ? (
                  <video
                    src={item.videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={item.image as string}
                    alt="Product Image"
                    fill
                    priority
                    style={{ objectFit: "cover", borderRadius: 0 }}
                  />
                )}
              </div>

              <div className="absolute inset-0 flex flex-col justify-center px-16 z-20">
                <div className="max-w-2xl"></div>
              </div>
            </Link>
          ))}
        </div>

        {carouselItems.length > 1 && (
          <>
            <button
              onClick={goToPrevSlide}
              className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-sm hover:bg-white/50 p-3 rounded-full z-30 transition-all duration-300 opacity-0 group-hover:opacity-100"
              aria-label="Previous slide"
            >
              <ChevronLeft size={24} className="text-white" />
            </button>

            <button
              onClick={goToNextSlide}
              className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-sm hover:bg-white/50 p-3 rounded-full z-30 transition-all duration-300 opacity-0 group-hover:opacity-100"
              aria-label="Next slide"
            >
              <ChevronRight size={24} className="text-white" />
            </button>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-30">
              {carouselItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentSlide === index
                      ? "bg-white scale-125"
                      : "bg-white/50"
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

export default PCCarousel;
