"use client";
import { useEffect, useState, useRef } from "react";
import { PatinaLogo } from "./logo";
import Navbar from "../components/Navbar";

export default function Home() {
  const [ellipse, setEllipse] = useState({ width: 150, height: 90 });
  const [scrollY, setScrollY] = useState(0);
  const ellipseRef = useRef(ellipse);
  
  // Reset to initial state on page load
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";
    setEllipse({ width: 150, height: 90 });
  }, []);
  
  useEffect(() => {
    // Reset scroll position on page load
    window.scrollTo(0, 0);
    
    // Only hide overflow if ellipse is not at max size
    const isMaxSize = ellipse.width >= 600;
    document.body.style.overflow = isMaxSize ? "auto" : "hidden";
    
    document.documentElement.style.setProperty("--ellipse-width", `${ellipse.width}px`);
    document.documentElement.style.setProperty("--ellipse-height", `${ellipse.height}px`);
    ellipseRef.current = ellipse;
    const maskedBg = document.querySelector<HTMLElement>(".masked-bg");
    if (maskedBg) {
      const handleWheel = (e: WheelEvent) => {
        // If ellipse is at max size and scrolling down, allow normal scrolling
        if (ellipseRef.current.width >= 600 && e.deltaY > 0) {
          return;
        }
        
        // If we're scrolled down and scrolling up, allow normal scrolling to return
        if (window.scrollY > 0 && e.deltaY < 0) {
          return;
        }
        
        e.preventDefault();
        let newWidth = ellipseRef.current.width + e.deltaY * 0.7;
        let newHeight = ellipseRef.current.height + e.deltaY * 0.4;
        if (newWidth < 150) newWidth = 150;
        if (newHeight < 90) newHeight = 90;
        if (newWidth > 600) newWidth = 600;
        if (newHeight > 346) newHeight = 346;
        
        setEllipse({ width: newWidth, height: newHeight });
        ellipseRef.current = { width: newWidth, height: newHeight };
        
        // Enable scrolling when ellipse reaches max size
        if (newWidth >= 600) {
          document.body.style.overflow = "auto";
        }
      };
      maskedBg.addEventListener("wheel", handleWheel, { passive: false });
      return () => {
        maskedBg.removeEventListener("wheel", handleWheel);
        document.body.style.overflow = "";
      };
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [ellipse.width]);
  
  useEffect(() => {
    document.documentElement.style.setProperty("--ellipse-width", `${ellipse.width}px`);
    document.documentElement.style.setProperty("--ellipse-height", `${ellipse.height}px`);
  }, [ellipse]);

  // Calculate scale: as ellipse grows, image dezooms
  const minWidth = 155;
  const maxWidth = 850;
  const minScale = 0.9;
  const maxScale = 1;
  const scale = Math.max(minScale, maxScale - ((ellipse.width - minWidth) / (maxWidth - minWidth)) * (maxScale - minScale));

  // Arrow opacity: fully visible at minWidth, fades out as ellipse grows
  const arrowOpacity = Math.max(0, 1 - (ellipse.width - minWidth) / 200);

  // Text opacity: fades out quickly as ellipse grows
  const textOpacity = Math.max(0, 1 - (ellipse.width - minWidth) / 10);

  // Show navbar when ellipse is at or near full size
  const showNavbar = ellipse.width >= 580; // Show when close to max width (600)

  // SVG ellipse params (static, not affected by ellipse)
  const svgWidth = 2000;
  const svgHeight = 1000;
  const rx = 150 * 1.05; // 160 * 1.05 (new min width)
  const ry = 90 * 1.1;  // 95 * 1.1 (new min height)
  const cx = svgWidth / 2;
  const cy = svgHeight / 2;

  return (
    <div>
      <Navbar show={showNavbar} />
      
      {/* SVG bent text header masked by ellipse */}
      <svg
        width={svgWidth}
        height={svgHeight}
        style={{
          position: "absolute",
          top: "-16%",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          pointerEvents: "none",
          opacity: textOpacity,
          transition: "opacity 0.2s ease-out",
          maskImage: `radial-gradient(ellipse var(--ellipse-width, 200px) var(--ellipse-height, 120px) at 50% 50%, transparent 0, transparent var(--ellipse-width, 200px) var(--ellipse-height, 120px), black 10px, black 100vw)`,
          WebkitMaskImage: `radial-gradient(ellipse var(--ellipse-width, 200px) var(--ellipse-height, 120px) at 50% 50%, transparent 0, transparent var(--ellipse-width, 200px) var(--ellipse-height, 120px), black 10px, black 100vw)`
        }}
      >
        <defs>
          <ellipse
            id="ellipsePath"
            cx={cx}
            cy={cy}
            rx={rx}
            ry={ry}
          />
          <path
            id="ellipseCurve"
            d={`M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 1 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 1 ${cx - rx} ${cy}`}
          />
        </defs>
        <text
          fontFamily="GT Ultra, Arial, sans-serif"
          fontSize="0.83rem"
          fontWeight="normal"
          letterSpacing="0.04em"
          fill="#8c4100ff"
          textAnchor="middle"
        >
          <textPath
            href="#ellipseCurve"
            startOffset="50%"
            alignmentBaseline="middle"
          >
            Sourdough and viennoiseries · Sourdough and viennoiseries · Sourdough and viennoiseries · Sourdough and viennoiseries · Sourdough and viennoiseries ·
          </textPath>
        </text>
      </svg>
      
      <div
        className="masked-bg"
        tabIndex={0}
        style={{ width: "100vw", height: "100vh" }}
      >
        <img
          src="/croissant.jpg"
          className="masked-bg-img"
          alt="Croissant"
          style={{ transform: `translate(-50%, -50%) scale(${scale})` }}
        />
        <div style={{ position: "absolute", top: "22%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 10, pointerEvents: "none" }}>
        <PatinaLogo textOpacity={textOpacity} />
        </div>
        {/* Scroll down indicator */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: "32px",
            transform: "translateX(-50%)",
            opacity: arrowOpacity,
            transition: "opacity 0.3s",
            pointerEvents: "none",
            zIndex: 10,
            animation: arrowOpacity > 0 ? "bounce 2s infinite" : "none",
          }}
        >

          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8c4100ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>

        </div>
      </div>

      {/* Second page/section */}
      <div style={{ 
        minHeight: "100vh", 
        background: "#ffd29d", 
        padding: "4rem 2rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <h1 style={{ 
          fontFamily: "GT Ultra, serif", 
          fontSize: "3rem", 
          color: "#8c4100ff",
          marginBottom: "2rem",
          textAlign: "center"
        }}>
          Welcome to Patina Bakery
        </h1>
        <p style={{ 
          fontFamily: "GT Ultra Fine, sans-serif", 
          fontSize: "1.2rem", 
          color: "#333",
          maxWidth: "600px",
          textAlign: "center",
          lineHeight: "1.6"
        }}>
          Discover our artisanal sourdough breads and traditional viennoiseries, 
          crafted with passion and the finest ingredients. Each piece tells a story 
          of time-honored techniques and exceptional taste.
        </p>
      </div>

      {/* Add CSS animation */}
      <style jsx>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateX(-50%) translateY(0);
          }
          40% {
            transform: translateX(-50%) translateY(-10px);
          }
          60% {
            transform: translateX(-50%) translateY(-5px);
          }
        }
      `}</style>
    </div>
  );
}
