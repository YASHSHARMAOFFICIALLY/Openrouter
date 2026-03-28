"use client"
import { useState,useEffect } from "react";
import Lenis from "@studio-freight/lenis";





function useLenisScroll(){
  useEffect(() => {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    syncTouch: false,
    touchMultiplier: 1.5,
    wheelMultiplier: 1,
    lerp: 0.08,
  });

  function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  const rafId = requestAnimationFrame(raf);

  return () => {
    cancelAnimationFrame(rafId);
    lenis.destroy();
  };
}, []); 
}

export default useLenisScroll