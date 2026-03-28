"use client"
import { useState } from "react";
import { NavbarDemo } from "@/components/ui/Landing/Navbar"
import { useTheme } from "next-themes";
import { lazy, Suspense, useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import {ShinyText} from "@/components/ui/ShinyText"



const BackgroundBeams = lazy(() =>
  import("../components/ui/background-beams").then((mod) => ({
    default: mod.BackgroundBeams,
  }))
);


const MorphingText = lazy(() =>
  import("../components/ui/morphing-text")
);

export function Landing(){
     const { resolvedTheme } = useTheme();
     const [color, setColor] = useState("#ffffff");
    const [bgColor, setBgColor] = useState("#000000");
     useEffect(() => {
    if (resolvedTheme === "dark") {
      setColor("#ffffff");
      setBgColor("#000000");
    } else {
      setColor("#ffffff");
      setBgColor("#000000");
    }
  }, [resolvedTheme]);
      useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);
    return(
        <div className="overflow-hidden "  style={{ backgroundColor: bgColor }}  >
      <div className="dark  mt-20 flex mx-auto max-w-[88rem] h-max pb-[1rem] w-full flex-col overflow-hidden">
          <NavbarDemo />
          <div className="md:w-[75%] sm:w-[85%] xs:w-[85%] xss:w-[95%] flex flex-col justify-center items-center mx-auto">
          <div className="flex flex-col mt-24 md:mt-24 h-full">
            <div className="hero-animate-down hero-animate-delay-0 mb-6">
              <ShinyText />
            </div>
            <h1 className="hero-animate hero-animate-delay-1 max-w-[50rem] mx-auto font-semibold text-center md:text-[3.75rem] md:leading-[1.15] sm:text-5xl xs:text-4xl xss:text-3xl font-space text-white tracking-[-0.03em]">
              Access Any  AI Model in One Place
            </h1>
            </div>
            </div>

          </div>
            </div>   
        
    )
}