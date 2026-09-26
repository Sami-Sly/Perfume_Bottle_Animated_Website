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
        syncTouch: false, 
        
        // MOBILE BOOST: Multiplies a small thumb swipe into a massive, slow-motion glide
        touchMultiplier: 1.2, 
      }}
    >
      {children}
    </ReactLenis>
  );
}