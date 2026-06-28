"use client";

import { ReactLenis } from "lenis/react";

export default function SmoothScrolling({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis 
      root 
      options={{ 
        // THE BUTTER: Extremely low friction for a long, heavy glide (Applies to both)
        lerp: 0.03, 
        
        // DESKTOP: Multiplies 1 small mouse wheel tick
        wheelMultiplier: 1.5, 
        
        // MOBILE: Forces mobile to use the Lenis smoothing engine
        syncTouch: true, 
        
        // MOBILE BOOST: Multiplies a small thumb swipe into a massive, slow-motion glide
        touchMultiplier: 1.5, 
      }}
    >
      {children}
    </ReactLenis>
  );
}