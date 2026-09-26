"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Must render INSIDE <ReactLenis> — useLenis() needs the provider above it.
function LenisGsapSync() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    // tell ScrollTrigger to recalculate every time Lenis moves scroll
    lenis.on("scroll", ScrollTrigger.update);

    // drive Lenis off gsap's ticker instead of its own rAF loop,
    // so both stay in lockstep — critical for your pinned ScrollCanvas
    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
    };
  }, [lenis]);

  return null;
}

export default function SmoothScrolling({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        autoRaf: false, // gsap.ticker drives it now, via LenisGsapSync
        lerp: 0.1,
        wheelMultiplier: 1,
        syncTouch: false,
        touchMultiplier: 1,
      }}
    >
      <LenisGsapSync />
      {children}
    </ReactLenis>
  );
}

// "use client";

// import { ReactLenis } from "lenis/react";

// export default function SmoothScrolling({ children }: { children: React.ReactNode }) {
//   return (
//     <ReactLenis 
//       root 
//       options={{ 
//         // THE BUTTER: Extremely low friction for a long, heavy glide (Applies to both)
//         lerp: 0.1, 
        
//         // DESKTOP: Multiplies 1 small mouse wheel tick
//         wheelMultiplier: 1.5, 
        
//         // MOBILE: Forces mobile to use the Lenis smoothing engine
//         syncTouch: false, 
        
//         // MOBILE BOOST: Multiplies a small thumb swipe into a massive, slow-motion glide
//         touchMultiplier: 1.2, 
//       }}
//     >
//       {children}
//     </ReactLenis>
//   );
// }