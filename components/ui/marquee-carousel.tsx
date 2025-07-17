import React from "react";

const items = [
  { src: "/images/1.png", alt: "Item 1" },
  { src: "/images/2.png", alt: "Item 2" },
  { src: "/images/3.png", alt: "Item 3" },
  { src: "/images/4.png", alt: "Item 4" },
  { src: "/images/5.png", alt: "Item 5" },
];

export default function MarqueeCarousel() {
  return (
    <div className="w-full flex justify-center mb-14 mt-14 px-2 sm:px-4 md:px-12">
      <div className="bg-[#faf6f1] rounded-lg shadow-md w-full max-w-7xl flex flex-col items-center overflow-hidden p-4 md:p-10 h-auto">
        <div className="relative w-full h-full">
          <div
            className="flex w-max animate-marquee items-center h-full"
            style={{ animation: "marquee 15s linear infinite" }}
          >
            {[0, 1].map((groupIdx) => (
              <div className="flex" key={groupIdx}>
                {items.map((item, idx) => (
                  <div
                    key={item.alt + idx}
                    className="mx-2 sm:mx-4 flex items-center justify-center"
                  >
                    <div className="rounded-full overflow-hidden h-40 w-40 md:h-52 md:w-52 flex items-center justify-center bg-white shadow-md border border-gray-200">
                      <img
                        src={item.src}
                        alt={item.alt}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <style jsx global>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </div>
    </div>
  );
} 