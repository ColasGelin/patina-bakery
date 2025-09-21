"use client";
import { useEffect, useState, useRef } from "react";
import { PatinaLogo } from "./logo";
import Navbar from "../components/Navbar";
import { Carousel } from "./carousel";
import LiquidFillText from "./fillText";

export default function Home() {
  const [ellipse, setEllipse] = useState({ width: 150, height: 90 });
  const [scrollY, setScrollY] = useState(0);
  const [isSecondSectionVisible, setIsSecondSectionVisible] = useState(false);
  const [backgroundColorProgress, setBackgroundColorProgress] = useState(0);
  const [photoScrollOffset, setPhotoScrollOffset] = useState(0);
  const [textFillProgress, setTextFillProgress] = useState(0);
  const [isInThirdSection, setIsInThirdSection] = useState(false);
  const ellipseRef = useRef(ellipse);
  const secondSectionRef = useRef<HTMLDivElement>(null);
  const thirdSectionRef = useRef<HTMLDivElement>(null);
  
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

  // Intersection observer for second section animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsSecondSectionVisible(true);
          }
        });
      },
      { threshold: 1 }
    );

    if (secondSectionRef.current) {
      observer.observe(secondSectionRef.current);
    }

    return () => {
      if (secondSectionRef.current) {
        observer.unobserve(secondSectionRef.current);
      }
    };
  }, []);

  // Check if viewport is in the middle of third section
  useEffect(() => {
    const checkThirdSectionPosition = () => {
      if (thirdSectionRef.current) {
        const rect = thirdSectionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const sectionTop = rect.top;
        const sectionBottom = rect.bottom;
        const sectionHeight = rect.height;
        
        // Check if the middle of the viewport is within the middle third of the section
        const viewportMiddle = windowHeight / 2;
        const sectionMiddleStart = sectionTop + sectionHeight * 0.5;
        const sectionMiddleEnd = sectionTop + sectionHeight;
        
        const isInMiddleOfSection = viewportMiddle >= sectionMiddleStart && viewportMiddle <= sectionMiddleEnd;
        setIsInThirdSection(isInMiddleOfSection);
      }
    };

    window.addEventListener('scroll', checkThirdSectionPosition);
    checkThirdSectionPosition(); // Check on mount
    
    return () => {
      window.removeEventListener('scroll', checkThirdSectionPosition);
    };
  }, []);

  // Enhanced scroll and wheel handler for third section
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    
    const handleThirdSectionWheelEvent = (e: WheelEvent) => {
      if (isInThirdSection) {
        // Check if we're at the boundaries and should allow normal scrolling
        const isScrollingUp = e.deltaY < 0;
        const isScrollingDown = e.deltaY > 0;
        
        // Allow normal scrolling up when fill is empty
        if (isScrollingUp && textFillProgress <= 0) {
          document.body.style.overflow = "auto";
          // Clear any existing timeout
          clearTimeout(scrollTimeout);
          // Re-disable overflow after a short delay to prevent interference
          scrollTimeout = setTimeout(() => {
            if (isInThirdSection && textFillProgress > 0) {
              document.body.style.overflow = "hidden";
            }
          }, 100);
          return; // Don't prevent default, allow normal scrolling
        }
        
        // Allow normal scrolling down when fill is full
        if (isScrollingDown && textFillProgress >= 100) {
          document.body.style.overflow = "auto";
          // Clear any existing timeout
          clearTimeout(scrollTimeout);
          // Re-disable overflow after a short delay to prevent interference
          scrollTimeout = setTimeout(() => {
            if (isInThirdSection && textFillProgress < 100) {
              document.body.style.overflow = "hidden";
            }
          }, 100);
          return; // Don't prevent default, allow normal scrolling
        }
        
        // Prevent default scrolling and control fill progress
        document.body.style.overflow = "hidden";
        e.preventDefault();
        
        // Update fill progress based on wheel delta when in middle of section
        // Positive deltaY (scroll down) increases fill, negative deltaY (scroll up) decreases fill
        setTextFillProgress(prev => {
          const delta = e.deltaY * 0.2; // Adjust sensitivity
          const newProgress = Math.max(0, Math.min(100, prev + delta));
          return newProgress;
        });
      }
    };

    if (isInThirdSection) {
      window.addEventListener('wheel', handleThirdSectionWheelEvent, { passive: false });
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
      clearTimeout(scrollTimeout);
      window.removeEventListener('wheel', handleThirdSectionWheelEvent);
    };
  }, [isInThirdSection, textFillProgress]);
  
  // Scroll listener for photo gallery and background color change
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      
      // Calculate photo scroll offset based on scroll position
      // Photos will scroll left as we scroll down
      const scrollMultiplier = 0.55; // Adjust speed of horizontal scroll
      setPhotoScrollOffset(currentScrollY * scrollMultiplier);
      
      // Calculate background color progress starting from the second section
      const windowHeight = window.innerHeight;
      const firstSectionHeight = windowHeight; // First section is 100vh
      const secondSectionHeight = windowHeight; // Second section is 100vh
      
      if (currentScrollY < firstSectionHeight) {
        // We're still in the first section, no color change
        setBackgroundColorProgress(0);
        if (!isInThirdSection) {
          setTextFillProgress(0);
        }
      } else if (currentScrollY < firstSectionHeight + secondSectionHeight) {
        // We're in the second section
        const scrollInSecondSections = currentScrollY - firstSectionHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const remainingHeight = documentHeight - windowHeight - firstSectionHeight;
        const progress = Math.min(scrollInSecondSections / remainingHeight, 1);
        setBackgroundColorProgress(progress);
        if (!isInThirdSection) {
          setTextFillProgress(0);
        }
      } else {
        // We're in the third section - only update background color, not text fill
        // Continue background color progress
        const scrollInSecondSections = currentScrollY - firstSectionHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const remainingHeight = documentHeight - windowHeight - firstSectionHeight;
        const progress = Math.min(scrollInSecondSections / remainingHeight, 1);
        setBackgroundColorProgress(progress);
        
        // Don't update text fill progress here when in third section - let the wheel handler control it
        if (!isInThirdSection) {
          const scrollInThirdSection = currentScrollY - firstSectionHeight - secondSectionHeight;
          const thirdSectionScrollableHeight = windowHeight * 0.8;
          const fillProgress = Math.min(scrollInThirdSection / thirdSectionScrollableHeight, 1);
          setTextFillProgress(fillProgress * 100);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isInThirdSection]);

  // Helper function to interpolate between colors
  const interpolateColor = (color1: string, color2: string, factor: number) => {
    const hex1 = color1.replace('#', '');
    const hex2 = color2.replace('#', '');
    
    const r1 = parseInt(hex1.substr(0, 2), 16);
    const g1 = parseInt(hex1.substr(2, 2), 16);
    const b1 = parseInt(hex1.substr(4, 2), 16);
    
    const r2 = parseInt(hex2.substr(0, 2), 16);
    const g2 = parseInt(hex2.substr(2, 2), 16);
    const b2 = parseInt(hex2.substr(4, 2), 16);
    
    const r = Math.round(r1 + (r2 - r1) * factor);
    const g = Math.round(g1 + (g2 - g1) * factor);
    const b = Math.round(b1 + (b2 - b1) * factor);
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  // Calculate background colors based on scroll progress
  const getBackgroundColor = () => {
    // Transition from orange to brown
    return interpolateColor('#ffd29d', '#ffa575ff', backgroundColorProgress);
  };
  
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
        background: getBackgroundColor(), 
        padding: "4rem 2rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        transition: "background 0.1s ease-out"
      }} ref={secondSectionRef}>
        <h1 style={{ 
          fontFamily: "GT Ultra Fine, serif", 
          fontSize: "3rem", 
          color: "#8c4100ff",
          marginBottom: "2rem",
          textAlign: "center",
          opacity: isSecondSectionVisible ? 1 : 0,
          transform: isSecondSectionVisible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s ease-out, transform 0.6s ease-out"
        }}>
          Welcome to Patina Edinburgh
        </h1>
        <p style={{ 
          fontFamily: "GT Ultra Fine, sans-serif", 
          fontSize: "1.2rem", 
          color: "#333",
          maxWidth: "600px",
          textAlign: "center",
          lineHeight: "1.6",
          opacity: isSecondSectionVisible ? 1 : 0,
          transform: isSecondSectionVisible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s ease-out, transform 0.6s ease-out 0.2s"
        }}>
          Discover our artisanal sourdough breads and traditional viennoiseries, 
          crafted with passion and the finest ingredients. Each piece tells a story 
          of time-honored techniques and exceptional taste.
        </p>
        <Carousel photoScrollOffset={photoScrollOffset} />
      </div>

      {/* Third section with fillable text */}
      <div 
        ref={thirdSectionRef}
        style={{ 
          minHeight: "100vh", // Made taller to allow more scrolling
          background: getBackgroundColor(), 
          padding: "6rem 2rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          transition: "background 0.1s ease-out"
        }}
      >
        <div style={{ marginBottom: "4rem" }}>
          <h2 style={{ 
            fontFamily: "GT Ultra Fine, serif", 
            fontSize: "2rem", 
            color: "#8c4100ff",
            textAlign: "center",
            marginBottom: "1rem",
            opacity: 0.9
          }}>
            Our Craft
          </h2>
          <p style={{ 
            fontFamily: "GT Ultra Fine, sans-serif", 
            fontSize: "1.1rem", 
            color: "#8c4100ff",
            maxWidth: "500px",
            textAlign: "center",
            lineHeight: "1.6",
            opacity: 0.8
          }}>
            Every loaf tells a story of patience, tradition, and artisanal excellence.
          </p>
        </div>
        
        <LiquidFillText 
          fillPercentage={textFillProgress}
          liquidColor="#8c4100ff"
          baseColor="#ffd29d"
          fontSize="8rem"
          fontFamily="GT Ultra Fine, serif"
        />
        
        <p style={{ 
          fontFamily: "GT Ultra Fine, sans-serif", 
          fontSize: "1rem", 
          color: "#8c4100ff",
          maxWidth: "400px",
          textAlign: "center",
          lineHeight: "1.6",
          marginTop: "3rem",
          opacity: 0.7
        }}>
          * Or go big on both !
        </p>
      </div>

      {/* News section */}
      
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
