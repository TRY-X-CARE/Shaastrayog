"use client";
import React, { useEffect, useState } from "react";

function SplashScreen({ finishLoader }: { finishLoader: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(false);
      finishLoader();
    }, 3000); // 3 seconds

    return () => clearTimeout(timeout);
  }, [finishLoader]);

  if (!isVisible) return null;

  return (
    <>
      {/* Mobile Splash Video */}
      <div className="relative w-full h-screen flex items-center justify-center overflow-hidden md:hidden">
        <video
          src="/videos/mobile_splash.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-fill"
        />
      </div>

      {/* Desktop/Tablet Splash Video */}
      <div className="relative hidden md:flex w-screen h-screen items-center justify-center overflow-hidden">
        <video
          src="/videos/laptop_splash.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-fill"
        />
      </div>
    </>
  );
}

export default SplashScreen;
