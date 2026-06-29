




// "use client";

// import { useEffect, useRef, useState, useCallback } from "react";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import Loader from "./Loader";

// if (typeof window !== "undefined") {
//   gsap.registerPlugin(ScrollTrigger);
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // CONFIG 
// // ─────────────────────────────────────────────────────────────────────────────
// const FIRST_FRAME  = 1;
// const LAST_FRAME   = 240;
// const TOTAL_FRAMES = LAST_FRAME - FIRST_FRAME + 1;

// function frameSrc(i: number) {
//   return `/frames/ezgif-frame-${String(FIRST_FRAME + i).padStart(3, "0")}.jpg`;
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // STORY BEATS
// // ─────────────────────────────────────────────────────────────────────────────
// interface Beat {
//   align: "center" | "left" | "right";
//   eyebrow?: string;
//   headline: string;
//   body?: string;
//   bullets?: string[];
//   sectionId?: string;
// }

// const BEATS: Beat[] = [
//   {
//     align: "center",
//     headline: "Aurum\nNocturne",
//     body: "A fragrance born from darkness and gold.",
//     sectionId: "story",
//   },
//   {
//     align: "left",
//     eyebrow: "Composition",
//     headline: "Crafted from\nrare essences.",
//     body: "Each bottle contains a precise alchemy of Oud from Assam, aged Sandalwood, and cold-pressed Bergamot. Sourced across four continents, blended in Grasse.",
//     sectionId: "ingredients",
//   },
//   {
//     align: "right",
//     eyebrow: "Sillage",
//     headline: "A presence\nthat lingers.",
//     bullets: [
//       "Top: Bergamot, Cardamom, Saffron.",
//       "Heart: Rose Taif, Jasmine Sambac, Iris.",
//       "Base: Oud, Sandalwood, Ambergris.",
//     ],
//     sectionId: "scent",
//   },
//   {
//     align: "left",
//     eyebrow: "Object",
//     headline: "A vessel as\nrare as its soul.",
//     body: "Hand-cut crystal. 24-carat gold collar. Each flacon is individually numbered, signed by our master perfumer.",
//     sectionId: "details-beat",
//   },
//   {
//     align: "center",
//     headline: "Some things\ncannot be found.",
//     body: "Aurum Nocturne. 50ml Extrait de Parfum.",
//     sectionId: "acquire-beat",
//   },
// ];

// // ─────────────────────────────────────────────────────────────────────────────
// // SCOPED CSS
// // ─────────────────────────────────────────────────────────────────────────────
// const SCOPED_CSS = `
//   @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

//   :root {
//     --gold:      #C9A84C;
//     --gold-lt:   #E8C97A;
//     --gold-dim:  rgba(201,168,76,0.15);
//     --bg:        #0B0906;
//     --bg2:       #0d0a07;
//     --text:      rgba(255,248,235,0.92);
//     --text-dim:  rgba(255,248,235,0.48);
//     --text-muted:rgba(255,248,235,0.22);
//     --border:    rgba(201,168,76,0.09);
//   }

//   .sc-track  { position: relative; }
//   .sc-sticky {
//     position: sticky;
//     top: 56px;
//     height: calc(100vh - 56px);
//     width: 100%;
//     overflow: hidden;
//   }
//   .sc-canvas { display: block; position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }

//   .sc-fade-bottom {
//     position: absolute; bottom: 0; left: 0; right: 0; height: 38%;
//     background: linear-gradient(to top, #0B0906 10%, rgba(11,9,6,.5) 55%, transparent);
//     pointer-events: none; z-index: 1;
//   }
//   .sc-vignette {
//     position: absolute; inset: 0; pointer-events: none; z-index: 1;
//     background: radial-gradient(ellipse at center, transparent 40%, rgba(11,9,6,0.75) 100%);
//   }

//   /* Base Layout for Beats */
//   .sc-beat {
//     position: absolute; inset: 0; z-index: 2;
//     display: flex; align-items: center;
//     pointer-events: none; opacity: 0; visibility: hidden;
//     padding: 0 6vw; /* Default Desktop Padding */
//   }

//   .sc-beat-inner { width: 100%; max-width: 400px; }

//   /* Desktop Alignments */
//   .sc-beat[data-align="left"] { justify-content: flex-start; }
//   .sc-beat[data-align="right"] { justify-content: flex-end; }
//   .sc-beat[data-align="center"] { justify-content: center; padding: 0 24px; }
  
//   .sc-beat[data-align="left"] .sc-beat-inner { text-align: left; }
//   .sc-beat[data-align="right"] .sc-beat-inner { text-align: right; }
//   .sc-beat[data-align="center"] .sc-beat-inner { text-align: center; max-width: 700px; }

//   /* Flex Wrappers for Elements */
//   .sc-pill-wrapper { margin-bottom: 14px; display: flex; }
//   .sc-rule-wrapper { margin-bottom: 16px; display: flex; }
  
//   .sc-beat[data-align="left"] .sc-pill-wrapper, .sc-beat[data-align="left"] .sc-rule-wrapper { justify-content: flex-start; }
//   .sc-beat[data-align="right"] .sc-pill-wrapper, .sc-beat[data-align="right"] .sc-rule-wrapper { justify-content: flex-end; }
//   .sc-beat[data-align="center"] .sc-pill-wrapper { justify-content: center; }

//   /* Elements */
//   .sc-hed {
//     font-family: 'Cormorant Garamond', serif; font-style: italic; font-weight: 300;
//     line-height: 1.0; letter-spacing: -.01em; color: var(--text); white-space: pre-line;
//   }
//   .sc-gold-text {
//     background: linear-gradient(135deg, #C9A84C 0%, #F0D88A 45%, #C9A84C 100%);
//     -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
//   }
//   .sc-pill {
//     display: inline-flex; align-items: center; gap: 8px; font-family: 'DM Sans', sans-serif; font-size: 10px;
//     letter-spacing: .18em; text-transform: uppercase; color: var(--gold); background: rgba(201,168,76,.07);
//     border: 1px solid rgba(201,168,76,.18); border-radius: 99px; padding: 5px 14px 5px 10px;
//   }
//   .sc-pill-dot { display: inline-block; width: 5px; height: 5px; border-radius: 50%; background: var(--gold); flex-shrink: 0; }
//   .sc-rule { display: block; width: 30px; height: 1px; background: linear-gradient(90deg, var(--gold), transparent); }
//   .sc-rule.right { background: linear-gradient(90deg, transparent, var(--gold)); }

//   /* Final CTA */
//   .sc-final-cta {
//     position: absolute; bottom: 10%; left: 50%; transform: translateX(-50%);
//     display: flex; flex-direction: column; align-items: center; gap: 14px;
//     z-index: 10; opacity: 0; visibility: hidden; white-space: nowrap; pointer-events: auto;
//   }
//   .sc-btn-gold {
//     font-family: 'DM Sans', sans-serif; font-weight: 500; font-size: 12px;
//     letter-spacing: .1em; text-transform: uppercase; color: #0B0906; text-decoration: none;
//     padding: 14px 42px; border-radius: 99px;
//     background: linear-gradient(135deg, var(--gold) 0%, var(--gold-lt) 50%, var(--gold) 100%);
//     display: inline-block; transition: opacity .2s, transform .2s, box-shadow .3s; box-shadow: 0 0 0 rgba(201,168,76,0);
//   }
//   .sc-btn-gold:hover { opacity:.88; transform:scale(.97); box-shadow:0 10px 44px rgba(201,168,76,.28); }
//   .sc-btn-ghost {
//     font-family: 'DM Sans', sans-serif; font-size: 11px; letter-spacing: .08em; text-transform: uppercase;
//     color: var(--text-dim); text-decoration: none; border-bottom: 1px solid rgba(255,248,235,.12); padding-bottom: 2px; transition: color .2s, border-color .2s;
//   }
//   .sc-btn-ghost:hover { color: var(--text); border-color: rgba(255,248,235,.35); }

//   /* Scroll Hint */
//   .sc-scroll-hint { display:flex; flex-direction:column; align-items:center; gap:10px; margin-top:40px; }
//   .sc-scroll-hint span { font-family:'DM Sans',sans-serif; font-size:10px; letter-spacing:.15em; text-transform:uppercase; color:rgba(255,248,235,.28); }
//   @keyframes sc-bounce { 0%,100%{transform:translateY(0);opacity:.4} 50%{transform:translateY(5px);opacity:.85} }
//   .sc-scroll-svg { animation: sc-bounce 2.2s ease-in-out infinite; }

//   /* ─────────────────────────────────────────────────────────────────────────────
//      RESPONSIVE BREAKPOINTS (TABLET & MOBILE)
//      ───────────────────────────────────────────────────────────────────────────── */
  
//   @media (max-width: 1024px) {
//     .sc-beat { padding: 0 4vw; }
//     .sc-beat-inner { max-width: 320px; } /* Shrinks text container so it fits on tablet */
//   }

//   @media (max-width: 768px) {
//     .sc-beat { padding: 0 20px; }
    
//     /* CRITICAL FIX: 
//        We constrain the max-width to 280px on phones. 
//        This prevents the text from stretching across the whole screen, 
//        ensuring "Left" actually looks left aligned, and "Right" actually looks right aligned! */
//     .sc-beat-inner { max-width: 280px; } 
    
//     /* Center alignment gets full width */
//     .sc-beat[data-align="center"] .sc-beat-inner { max-width: 100%; } 
    
//     .sc-final-cta { bottom: 6%; transform: translateX(-50%) scale(0.95); }
//   }
// `;

// // ─────────────────────────────────────────────────────────────────────────────
// // COMPONENT
// // ─────────────────────────────────────────────────────────────────────────────
// export default function ScrollCanvas() {
//   const trackRef     = useRef<HTMLDivElement>(null);
//   const canvasRef    = useRef<HTMLCanvasElement>(null);
//   const imagesRef    = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
//   const loadedRef    = useRef<boolean[]>(new Array(TOTAL_FRAMES).fill(false));
//   const frameObjRef  = useRef({ f: 0 });
//   const lastDrawnRef = useRef(-1);
//   const dprRef       = useRef(1); 
//   const contentShownRef = useRef(false);

//   const [loadPct, setLoadPct]       = useState(0);
//   const [showContent, setShowContent] = useState(false);
//   const [isVisible, setIsVisible]   = useState(false); 

//   useEffect(() => {
//     const id = "sc-css";
//     if (document.getElementById(id)) return;
//     const s = document.createElement("style");
//     s.id = id;
//     s.textContent = SCOPED_CSS;
//     document.head.appendChild(s);
//     return () => { document.getElementById(id)?.remove(); };
//   }, []);

//   const NAV_H = 56; 
//   const resizeCanvas = useCallback(() => {
//     const c = canvasRef.current;
//     if (!c) return;
//     const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
//     dprRef.current = dpr;
//     const W = window.innerWidth;
//     const H = window.innerHeight - NAV_H; 
//     c.width  = W * dpr;
//     c.height = H * dpr;
//     c.style.width  = `${W}px`;
//     c.style.height = `${H}px`;
//     const ctx = c.getContext("2d", { alpha: false });
//     if (ctx) {
//       ctx.setTransform(1, 0, 0, 1, 0, 0);
//       ctx.scale(dpr, dpr);
//     }
//   }, []);

//   const drawFrame = useCallback((idx: number) => {
//     let i = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(idx)));
    
//     // Fallback to closest loaded frame if scrolling fast
//     while (i >= 0 && !loadedRef.current[i]) {
//       i--;
//     }
    
//     if (i < 0 || i === lastDrawnRef.current) return;

//     const img = imagesRef.current[i];
//     if (!img) return;

//     const c = canvasRef.current;
//     if (!c) return;
//     const ctx = c.getContext("2d");
//     if (!ctx) return;

//     const dpr = dprRef.current;
//     const W = c.width  / dpr;
//     const H = c.height / dpr;
//     ctx.fillStyle = "#0B0906";
//     ctx.fillRect(0, 0, W, H);

//     const scale = Math.max(W / img.naturalWidth, H / img.naturalHeight);
//     const dw = img.naturalWidth  * scale;
//     const dh = img.naturalHeight * scale;
//     const dx = (W - dw) / 2;
//     const dy = (H - dh) * 0.15;;

//     ctx.drawImage(img, dx, dy, dw, dh);
//     lastDrawnRef.current = i;
//   }, []);

//   useEffect(() => {
//     let loaded = 0;

//     const onFrameDone = (i: number) => {
//       loaded++;
//       setLoadPct(Math.min(100, Math.round((loaded / TOTAL_FRAMES) * 100)));
      
//       if (i === 0) drawFrame(0); 
      
//       // Load 2 frames before showing site
//       if (loaded >= 2 && !contentShownRef.current) {
//         contentShownRef.current = true;
//         setShowContent(true);
//         setTimeout(() => setIsVisible(true), 50); 
//       }
//     };

//     const loadFrame = (i: number) => {
//       const img = new Image();
//       img.decoding = "async";
//       img.onload = () => {
//         img.decode().catch(() => {}).finally(() => {
//             loadedRef.current[i] = true;
//             imagesRef.current[i] = img;
//             onFrameDone(i);
//         });
//       };
//       img.onerror = () => onFrameDone(i);
//       img.src = frameSrc(i);
//     };

//     // Preload first 3
//     for (let i = 0; i < Math.min(3, TOTAL_FRAMES); i++) loadFrame(i);

//     // Background load the rest
//     const ric = (window as any).requestIdleCallback || ((cb: Function) => setTimeout(cb, 100));
//     ric(() => {
//       for (let i = 3; i < TOTAL_FRAMES; i++) {
//         setTimeout(() => loadFrame(i), i * 15);
//       }
//     });
//   }, [drawFrame]);

//   useEffect(() => {
//     resizeCanvas();
//     drawFrame(0);

//     let lastWidth = window.innerWidth;

//     const onResize = () => {
//       // ONLY REFRESH ON WIDTH CHANGE (Fixes mobile scrollbar shrinking break)
//       if (window.innerWidth !== lastWidth) {
//         lastWidth = window.innerWidth;
//         resizeCanvas();
//         lastDrawnRef.current = -1;
//         drawFrame(frameObjRef.current.f);
//         ScrollTrigger.refresh();
//       }
//     };

//     window.addEventListener("resize", onResize);
//     return () => window.removeEventListener("resize", onResize);
//   }, [resizeCanvas, drawFrame]);

//   useEffect(() => {
//     if (!showContent) return;

//     const tl = gsap.timeline({
//       scrollTrigger: {
//         id: "sc-scrub",
//         trigger: trackRef.current,
//         start: "top top",
//         end: "bottom bottom",
//         scrub: 0.8,
//       },
//     });

//     tl.to(
//       frameObjRef.current,
//       {
//         f: TOTAL_FRAMES - 1,
//         ease: "none",
//         duration: 1,
//         onUpdate: () => drawFrame(frameObjRef.current.f),
//       },
//       0,
//     );

//     const CARD_ZONE   = 0.78;
//     const STEP        = CARD_ZONE / BEATS.length;
//     const ENTRY_DELAY = STEP * 0.06;
//     const FADE_IN     = STEP * 0.36;
//     const FADE_OUT    = STEP * 0.30;

//     const cards = gsap.utils.toArray<HTMLElement>(".sc-beat");

//     cards.forEach((card, i) => {
//       const zoneStart    = i * STEP;
//       const zoneEnd      = (i + 1) * STEP;
//       const fadeInStart  = zoneStart + ENTRY_DELAY;
//       const fadeOutStart = zoneEnd - FADE_OUT;

//       const a   = BEATS[i].align;
//       const mob = window.innerWidth < 768;
//       const ox  = mob ? 0 : a === "left" ? -22 : a === "right" ? 22 : 0;
//       const oy  = a === "center" ? 14 : 0;

//       tl.fromTo(
//         card,
//         { autoAlpha: 0, x: ox, y: oy },
//         { autoAlpha: 1, x: 0, y: 0, ease: "power2.out", duration: FADE_IN, immediateRender: true },
//         fadeInStart,
//       );
//       tl.to(
//         card,
//         { autoAlpha: 0, x: -ox, y: -oy, ease: "power2.inOut", duration: FADE_OUT },
//         fadeOutStart,
//       );
//     });

//     tl.fromTo(".sc-final-cta", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, ease: "power2.out", duration: 0.06 }, 0.78);
//     tl.to(".sc-final-cta", { autoAlpha: 0, y: -10, ease: "power2.in", duration: 0.04 }, 0.90);

//     return () => {
//       tl.kill();
//       ScrollTrigger.getAll().forEach((t) => t.kill());
//     };
//   }, [showContent, drawFrame]);

//   return (
//     <>
//       {!showContent && <Loader progress={loadPct} />}

//       <div
//         id="story"
//         ref={trackRef}
//         className="sc-track"
//         style={{
//           height: "550vh",
//           opacity: isVisible ? 1 : 0,
//           transition: "opacity 0.8s ease",
//         }}
//       >
//         <div className="sc-sticky">
//           <canvas ref={canvasRef} className="sc-canvas" />

//           <div className="sc-vignette" />
//           <div className="sc-fade-bottom" />

//           {BEATS.map((beat, i) => {
//             const isL = beat.align === "left";
//             const isR = beat.align === "right";
//             const isC = beat.align === "center";

//             return (
//               <div
//                 key={i}
//                 id={beat.sectionId}
//                 className="sc-beat"
//                 data-align={beat.align}
//               >
//                 <div className="sc-beat-inner">
                  
//                   {beat.eyebrow && (
//                     <div className="sc-pill-wrapper">
//                       <span className="sc-pill">
//                         <span className="sc-pill-dot" />
//                         {beat.eyebrow}
//                       </span>
//                     </div>
//                   )}

//                   <h2
//                     className="sc-hed"
//                     style={{
//                       fontSize:
//                         isC && i === 0
//                           ? "clamp(44px, 8.5vw, 100px)"
//                           : "clamp(26px, 4vw, 54px)",
//                       marginBottom: 16,
//                     }}
//                   >
//                     {i === 0 ? (
//                       <span className="sc-gold-text">{beat.headline}</span>
//                     ) : (
//                       beat.headline
//                     )}
//                   </h2>

//                   {!isC && (
//                     <div className="sc-rule-wrapper">
//                       <span className={`sc-rule ${isR ? "right" : ""}`} />
//                     </div>
//                   )}

//                   {beat.body && (
//                     <p
//                       style={{
//                         fontFamily: "'DM Sans', sans-serif",
//                         fontWeight: 300,
//                         fontSize:
//                           i === 0
//                             ? "clamp(15px, 1.8vw, 19px)"
//                             : "clamp(13px, 1.3vw, 15px)",
//                         lineHeight: 1.72,
//                         color:
//                           i === 0
//                             ? "rgba(255,248,235,.68)"
//                             : "rgba(255,248,235,.52)",
//                         letterSpacing: ".01em",
//                       }}
//                     >
//                       {beat.body}
//                     </p>
//                   )}

//                   {beat.bullets && (
//                     <ul 
//                       className="sc-bullets-wrapper" 
//                       style={{ 
//                         listStyle: "none", 
//                         display: "flex", 
//                         flexDirection: "column", 
//                         gap: 10, 
//                         margin: 0, 
//                         padding: 0 
//                       }}
//                     >
//                       {beat.bullets.map((b, bi) => (
//                         <li
//                           key={bi}
//                           style={{
//                             fontFamily: "'DM Sans', sans-serif",
//                             fontWeight: 300,
//                             fontSize: "clamp(12px, 1.2vw, 14px)",
//                             color: "rgba(255,248,235,.52)",
//                             display: "flex",
//                             alignItems: "center",
//                             gap: 10,
//                             justifyContent: isR ? "flex-end" : "flex-start",
//                             flexDirection: isR ? "row-reverse" : "row",
//                             letterSpacing: ".02em",
//                           }}
//                         >
//                           <span
//                             style={{
//                               width: 4,
//                               height: 4,
//                               borderRadius: "50%",
//                               background: "var(--gold)",
//                               flexShrink: 0,
//                             }}
//                           />
//                           {b}
//                         </li>
//                       ))}
//                     </ul>
//                   )}

//                   {i === 0 && (
//                     <div className="sc-scroll-hint">
//                       <span>Scroll to discover</span>
//                       <svg
//                         width="16"
//                         height="22"
//                         viewBox="0 0 16 22"
//                         fill="none"
//                         className="sc-scroll-svg"
//                       >
//                         <rect
//                           x="1" y="1" width="14" height="20" rx="7"
//                           stroke="rgba(201,168,76,.45)" strokeWidth="1.2"
//                         />
//                         <circle cx="8" cy="7" r="2" fill="rgba(201,168,76,.65)" />
//                       </svg>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             );
//           })}

//           <div className="sc-final-cta">
//             <a href="#acquire" className="sc-btn-gold">Acquire the Flacon</a>
//             <a href="#details" className="sc-btn-ghost">Discover craftsmanship</a>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }




"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Loader from "./Loader";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG 
// ─────────────────────────────────────────────────────────────────────────────
const FIRST_FRAME  = 1;
const LAST_FRAME   = 240;
const TOTAL_FRAMES = LAST_FRAME - FIRST_FRAME + 1;

function frameSrc(i: number) {
  return `/frames/ezgif-frame-${String(FIRST_FRAME + i).padStart(3, "0")}.jpg`;
}

// ─────────────────────────────────────────────────────────────────────────────
// STORY BEATS
// ─────────────────────────────────────────────────────────────────────────────
interface Beat {
  align: "center" | "left" | "right";
  eyebrow?: string;
  headline: string;
  body?: string;
  bullets?: string[];
  sectionId?: string;
}

const BEATS: Beat[] = [
  {
    align: "center",
    headline: "Aurum\nNocturne",
    body: "A fragrance born from darkness and gold.",
    sectionId: "story",
  },
  {
    align: "left",
    eyebrow: "Composition",
    headline: "Crafted from\nrare essences.",
    body: "Each bottle contains a precise alchemy of Oud from Assam, aged Sandalwood, and cold-pressed Bergamot. Sourced across four continents, blended in Grasse.",
    sectionId: "ingredients",
  },
  {
    align: "right",
    eyebrow: "Sillage",
    headline: "A presence\nthat lingers.",
    bullets: [
      "Top: Bergamot, Cardamom, Saffron.",
      "Heart: Rose Taif, Jasmine Sambac, Iris.",
      "Base: Oud, Sandalwood, Ambergris.",
    ],
    sectionId: "scent",
  },
  {
    align: "left",
    eyebrow: "Object",
    headline: "A vessel as\nrare as its soul.",
    body: "Hand-cut crystal. 24-carat gold collar. Each flacon is individually numbered, signed by our master perfumer.",
    sectionId: "details-beat",
  },
  {
    align: "center",
    headline: "Some things\ncannot be found.",
    body: "Aurum Nocturne. 50ml Extrait de Parfum.",
    sectionId: "acquire-beat",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SCOPED CSS
// ─────────────────────────────────────────────────────────────────────────────
const SCOPED_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

  :root {
    --gold:      #C9A84C;
    --gold-lt:   #E8C97A;
    --gold-dim:  rgba(201,168,76,0.15);
    --bg:        #0B0906;
    --bg2:       #0d0a07;
    --text:      rgba(255,248,235,0.92);
    --text-dim:  rgba(255,248,235,0.48);
    --text-muted:rgba(255,248,235,0.22);
    --border:    rgba(201,168,76,0.09);
  }

  .sc-track  { position: relative; }
  .sc-sticky {
    position: sticky;
    top: 56px;
    height: calc(100vh - 56px);
    width: 100%;
    overflow: hidden;
  }
  .sc-canvas { display: block; position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }

  .sc-fade-bottom {
    position: absolute; bottom: 0; left: 0; right: 0; height: 38%;
    background: linear-gradient(to top, #0B0906 10%, rgba(11,9,6,.5) 55%, transparent);
    pointer-events: none; z-index: 1;
  }
  .sc-vignette {
    position: absolute; inset: 0; pointer-events: none; z-index: 1;
    background: radial-gradient(ellipse at center, transparent 40%, rgba(11,9,6,0.75) 100%);
  }

  /* Base Layout for Beats */
  .sc-beat {
    position: absolute; inset: 0; z-index: 2;
    display: flex; align-items: center;
    pointer-events: none; opacity: 0; visibility: hidden;
    padding: 0 6vw; /* Default Desktop Padding */
  }

  .sc-beat-inner { width: 100%; max-width: 400px; }

  /* Desktop Alignments */
  .sc-beat[data-align="left"] { justify-content: flex-start; }
  .sc-beat[data-align="right"] { justify-content: flex-end; }
  .sc-beat[data-align="center"] { justify-content: center; padding: 0 24px; }
  
  .sc-beat[data-align="left"] .sc-beat-inner { text-align: left; }
  .sc-beat[data-align="right"] .sc-beat-inner { text-align: right; }
  .sc-beat[data-align="center"] .sc-beat-inner { text-align: center; max-width: 700px; }

  /* Flex Wrappers for Elements */
  .sc-pill-wrapper { margin-bottom: 14px; display: flex; }
  .sc-rule-wrapper { margin-bottom: 16px; display: flex; }
  
  .sc-beat[data-align="left"] .sc-pill-wrapper, .sc-beat[data-align="left"] .sc-rule-wrapper { justify-content: flex-start; }
  .sc-beat[data-align="right"] .sc-pill-wrapper, .sc-beat[data-align="right"] .sc-rule-wrapper { justify-content: flex-end; }
  .sc-beat[data-align="center"] .sc-pill-wrapper { justify-content: center; }

  /* Elements */
  .sc-hed {
    font-family: 'Cormorant Garamond', serif; font-style: italic; font-weight: 300;
    line-height: 1.0; letter-spacing: -.01em; color: var(--text); white-space: pre-line;
  }
  .sc-gold-text {
    background: linear-gradient(135deg, #C9A84C 0%, #F0D88A 45%, #C9A84C 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .sc-pill {
    display: inline-flex; align-items: center; gap: 8px; font-family: 'DM Sans', sans-serif; font-size: 10px;
    letter-spacing: .18em; text-transform: uppercase; color: var(--gold); background: rgba(201,168,76,.07);
    border: 1px solid rgba(201,168,76,.18); border-radius: 99px; padding: 5px 14px 5px 10px;
  }
  .sc-pill-dot { display: inline-block; width: 5px; height: 5px; border-radius: 50%; background: var(--gold); flex-shrink: 0; }
  .sc-rule { display: block; width: 30px; height: 1px; background: linear-gradient(90deg, var(--gold), transparent); }
  .sc-rule.right { background: linear-gradient(90deg, transparent, var(--gold)); }

  /* Final CTA */
  .sc-final-cta {
    position: absolute; bottom: 10%; left: 50%; transform: translateX(-50%);
    display: flex; flex-direction: column; align-items: center; gap: 14px;
    z-index: 10; opacity: 0; visibility: hidden; white-space: nowrap; pointer-events: auto;
  }
  .sc-btn-gold {
    font-family: 'DM Sans', sans-serif; font-weight: 500; font-size: 12px;
    letter-spacing: .1em; text-transform: uppercase; color: #0B0906; text-decoration: none;
    padding: 14px 42px; border-radius: 99px;
    background: linear-gradient(135deg, var(--gold) 0%, var(--gold-lt) 50%, var(--gold) 100%);
    display: inline-block; transition: opacity .2s, transform .2s, box-shadow .3s; box-shadow: 0 0 0 rgba(201,168,76,0);
  }
  .sc-btn-gold:hover { opacity:.88; transform:scale(.97); box-shadow:0 10px 44px rgba(201,168,76,.28); }
  .sc-btn-ghost {
    font-family: 'DM Sans', sans-serif; font-size: 11px; letter-spacing: .08em; text-transform: uppercase;
    color: var(--text-dim); text-decoration: none; border-bottom: 1px solid rgba(255,248,235,.12); padding-bottom: 2px; transition: color .2s, border-color .2s;
  }
  .sc-btn-ghost:hover { color: var(--text); border-color: rgba(255,248,235,.35); }

  /* Scroll Hint */
  .sc-scroll-hint { display:flex; flex-direction:column; align-items:center; gap:10px; margin-top:40px; }
  .sc-scroll-hint span { font-family:'DM Sans',sans-serif; font-size:10px; letter-spacing:.15em; text-transform:uppercase; color:rgba(255,248,235,.28); }
  @keyframes sc-bounce { 0%,100%{transform:translateY(0);opacity:.4} 50%{transform:translateY(5px);opacity:.85} }
  .sc-scroll-svg { animation: sc-bounce 2.2s ease-in-out infinite; }

  /* ─────────────────────────────────────────────────────────────────────────────
     RESPONSIVE BREAKPOINTS (TABLET & MOBILE)
     ───────────────────────────────────────────────────────────────────────────── */
  
  @media (max-width: 1024px) {
    .sc-beat { padding: 0 4vw; }
    .sc-beat-inner { max-width: 320px; } 
  }

  @media (max-width: 768px) {
    .sc-beat { padding: 0 20px; }
    .sc-beat-inner { max-width: 280px; } 
    .sc-beat[data-align="center"] .sc-beat-inner { max-width: 100%; } 
    .sc-final-cta { bottom: 6%; transform: translateX(-50%) scale(0.95); }
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function ScrollCanvas() {
  const trackRef     = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const imagesRef    = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const loadedRef    = useRef<boolean[]>(new Array(TOTAL_FRAMES).fill(false));
  const frameObjRef  = useRef({ f: 0 });
  const lastDrawnRef = useRef(-1);
  const dprRef       = useRef(1); 
  const contentShownRef = useRef(false);

  const [loadPct, setLoadPct]       = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [isVisible, setIsVisible]   = useState(false); 

  useEffect(() => {
    const id = "sc-css";
    if (document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id;
    s.textContent = SCOPED_CSS;
    document.head.appendChild(s);
    return () => { document.getElementById(id)?.remove(); };
  }, []);

  const NAV_H = 56; 
  const resizeCanvas = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    dprRef.current = dpr;
    const W = window.innerWidth;
    const H = window.innerHeight - NAV_H; 
    c.width  = W * dpr;
    c.height = H * dpr;
    c.style.width  = `${W}px`;
    c.style.height = `${H}px`;
    const ctx = c.getContext("2d", { alpha: false });
    if (ctx) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }
  }, []);

  const drawFrame = useCallback((idx: number) => {
    let i = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(idx)));
    
    // Fallback to closest loaded frame if scrolling fast
    while (i >= 0 && !loadedRef.current[i]) {
      i--;
    }
    
    if (i < 0 || i === lastDrawnRef.current) return;

    const img = imagesRef.current[i];
    if (!img) return;

    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    const dpr = dprRef.current;
    const W = c.width  / dpr;
    const H = c.height / dpr;
    ctx.fillStyle = "#0B0906";
    ctx.fillRect(0, 0, W, H);

    const scale = Math.max(W / img.naturalWidth, H / img.naturalHeight);
    const dw = img.naturalWidth  * scale;
    const dh = img.naturalHeight * scale;
    const dx = (W - dw) / 2;
    const dy = (H - dh) * 0.15;

    ctx.drawImage(img, dx, dy, dw, dh);
    lastDrawnRef.current = i;
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // OPTIMIZED IMAGE PRELOADER
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    let loaded = 0;

    const onFrameDone = (i: number) => {
      loaded++;
      setLoadPct(Math.min(100, Math.round((loaded / TOTAL_FRAMES) * 100)));
      
      if (i === 0) drawFrame(0); 
      
      // Changed from 2 to 10 to give the UI a sufficient buffer
      // before allowing the user to start scrubbing.
      if (loaded >= 10 && !contentShownRef.current) {
        contentShownRef.current = true;
        setShowContent(true);
        setTimeout(() => setIsVisible(true), 50); 
      }
    };

    // 1. Load the first 10 frames immediately 
    const initialBatch = 10;
    for (let i = 0; i < Math.min(initialBatch, TOTAL_FRAMES); i++) {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        img.decode().catch(() => {}).finally(() => {
          loadedRef.current[i] = true;
          imagesRef.current[i] = img;
          onFrameDone(i);
        });
      };
      img.onerror = () => onFrameDone(i);
      img.src = frameSrc(i);
    }

    // 2. Load the rest sequentially to prevent browser/network throttling
    let nextFrameToLoad = initialBatch;

    const loadNextSequence = () => {
      if (nextFrameToLoad >= TOTAL_FRAMES) return; 

      const i = nextFrameToLoad;
      nextFrameToLoad++; 

      const img = new Image();
      img.decoding = "async";
      
      const handleComplete = () => {
        onFrameDone(i);
        loadNextSequence(); // Fire next image request only when this one completes
      };

      img.onload = () => {
        img.decode().catch(() => {}).finally(() => {
          loadedRef.current[i] = true;
          imagesRef.current[i] = img;
          handleComplete();
        });
      };
      img.onerror = handleComplete;
      img.src = frameSrc(i);
    };

    // 3. Initiate 3 parallel streams to maximize connection without choking
    const ric = (window as any).requestIdleCallback || ((cb: Function) => setTimeout(cb, 100));
    ric(() => {
      loadNextSequence();
      loadNextSequence();
      loadNextSequence();
    });

  }, [drawFrame]);

  useEffect(() => {
    resizeCanvas();
    drawFrame(0);

    let lastWidth = window.innerWidth;

    const onResize = () => {
      if (window.innerWidth !== lastWidth) {
        lastWidth = window.innerWidth;
        resizeCanvas();
        lastDrawnRef.current = -1;
        drawFrame(frameObjRef.current.f);
        ScrollTrigger.refresh();
      }
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [resizeCanvas, drawFrame]);

  useEffect(() => {
    if (!showContent) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        id: "sc-scrub",
        trigger: trackRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.8,
      },
    });

    tl.to(
      frameObjRef.current,
      {
        f: TOTAL_FRAMES - 1,
        ease: "none",
        duration: 1,
        onUpdate: () => drawFrame(frameObjRef.current.f),
      },
      0,
    );

    const CARD_ZONE   = 0.78;
    const STEP        = CARD_ZONE / BEATS.length;
    const ENTRY_DELAY = STEP * 0.06;
    const FADE_IN     = STEP * 0.36;
    const FADE_OUT    = STEP * 0.30;

    const cards = gsap.utils.toArray<HTMLElement>(".sc-beat");

    cards.forEach((card, i) => {
      const zoneStart    = i * STEP;
      const zoneEnd      = (i + 1) * STEP;
      const fadeInStart  = zoneStart + ENTRY_DELAY;
      const fadeOutStart = zoneEnd - FADE_OUT;

      const a   = BEATS[i].align;
      const mob = window.innerWidth < 768;
      const ox  = mob ? 0 : a === "left" ? -22 : a === "right" ? 22 : 0;
      const oy  = a === "center" ? 14 : 0;

      tl.fromTo(
        card,
        { autoAlpha: 0, x: ox, y: oy },
        { autoAlpha: 1, x: 0, y: 0, ease: "power2.out", duration: FADE_IN, immediateRender: true },
        fadeInStart,
      );
      tl.to(
        card,
        { autoAlpha: 0, x: -ox, y: -oy, ease: "power2.inOut", duration: FADE_OUT },
        fadeOutStart,
      );
    });

    tl.fromTo(".sc-final-cta", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, ease: "power2.out", duration: 0.06 }, 0.78);
    tl.to(".sc-final-cta", { autoAlpha: 0, y: -10, ease: "power2.in", duration: 0.04 }, 0.90);

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [showContent, drawFrame]);

  return (
    <>
      {!showContent && <Loader progress={loadPct} />}

      <div
        id="story"
        ref={trackRef}
        className="sc-track"
        style={{
          height: "550vh",
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.8s ease",
        }}
      >
        <div className="sc-sticky">
          <canvas ref={canvasRef} className="sc-canvas" />

          <div className="sc-vignette" />
          <div className="sc-fade-bottom" />

          {BEATS.map((beat, i) => {
            const isL = beat.align === "left";
            const isR = beat.align === "right";
            const isC = beat.align === "center";

            return (
              <div
                key={i}
                id={beat.sectionId}
                className="sc-beat"
                data-align={beat.align}
              >
                <div className="sc-beat-inner">
                  
                  {beat.eyebrow && (
                    <div className="sc-pill-wrapper">
                      <span className="sc-pill">
                        <span className="sc-pill-dot" />
                        {beat.eyebrow}
                      </span>
                    </div>
                  )}

                  <h2
                    className="sc-hed"
                    style={{
                      fontSize:
                        isC && i === 0
                          ? "clamp(44px, 8.5vw, 100px)"
                          : "clamp(26px, 4vw, 54px)",
                      marginBottom: 16,
                    }}
                  >
                    {i === 0 ? (
                      <span className="sc-gold-text">{beat.headline}</span>
                    ) : (
                      beat.headline
                    )}
                  </h2>

                  {!isC && (
                    <div className="sc-rule-wrapper">
                      <span className={`sc-rule ${isR ? "right" : ""}`} />
                    </div>
                  )}

                  {beat.body && (
                    <p
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 300,
                        fontSize:
                          i === 0
                            ? "clamp(15px, 1.8vw, 19px)"
                            : "clamp(13px, 1.3vw, 15px)",
                        lineHeight: 1.72,
                        color:
                          i === 0
                            ? "rgba(255,248,235,.68)"
                            : "rgba(255,248,235,.52)",
                        letterSpacing: ".01em",
                      }}
                    >
                      {beat.body}
                    </p>
                  )}

                  {beat.bullets && (
                    <ul 
                      className="sc-bullets-wrapper" 
                      style={{ 
                        listStyle: "none", 
                        display: "flex", 
                        flexDirection: "column", 
                        gap: 10, 
                        margin: 0, 
                        padding: 0 
                      }}
                    >
                      {beat.bullets.map((b, bi) => (
                        <li
                          key={bi}
                          style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontWeight: 300,
                            fontSize: "clamp(12px, 1.2vw, 14px)",
                            color: "rgba(255,248,235,.52)",
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            justifyContent: isR ? "flex-end" : "flex-start",
                            flexDirection: isR ? "row-reverse" : "row",
                            letterSpacing: ".02em",
                          }}
                        >
                          <span
                            style={{
                              width: 4,
                              height: 4,
                              borderRadius: "50%",
                              background: "var(--gold)",
                              flexShrink: 0,
                            }}
                          />
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}

                  {i === 0 && (
                    <div className="sc-scroll-hint">
                      <span>Scroll to discover</span>
                      <svg
                        width="16"
                        height="22"
                        viewBox="0 0 16 22"
                        fill="none"
                        className="sc-scroll-svg"
                      >
                        <rect
                          x="1" y="1" width="14" height="20" rx="7"
                          stroke="rgba(201,168,76,.45)" strokeWidth="1.2"
                        />
                        <circle cx="8" cy="7" r="2" fill="rgba(201,168,76,.65)" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <div className="sc-final-cta">
            <a href="#acquire" className="sc-btn-gold">Acquire the Flacon</a>
            <a href="#details" className="sc-btn-ghost">Discover craftsmanship</a>
          </div>
        </div>
      </div>
    </>
  );
}

