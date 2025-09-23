import React, { useMemo } from 'react';

const LiquidFillText = ({ 
  lines = [
    { text: "FEEL FREE", fontSize: "6rem", scaleY: 1 },
    { text: "TO HAVE A", fontSize: "5.04rem", scaleY: 1 },
    { text: "WEE PASTRY", fontSize: "3.9rem", scaleY: 1 },
    { text: "AND A BIG", fontSize: "3.8rem", scaleY: 1 },
    { text: "COFFEE*", fontSize: "3.8rem", scaleY: 1 }
  ],
  liquidColor = "#8c4100ff",
  baseColor = "#4e2a00ff",
  fontFamily = "GT Ultra Fine, serif",
  fillPercentage = 40,
  clipPathId = "wavy-clip-default" // Allow custom ID or use default
}) => {
  // Generate wavy SVG path
  const generateWavyPath = (fillLevel) => {
    const waveAmplitude = 3; // Height of waves
    const waveFrequency = 4; // Number of wave cycles across width
    const yPosition = 100 - Math.min(fillLevel, 99.5);

    let path = `M 0 ${yPosition}`;
    
    // Create smooth waves using bezier curves
    const steps = 50;
    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * 100;
      const waveOffset = Math.sin((x / 100) * waveFrequency * Math.PI * 2) * waveAmplitude;
      const y = yPosition + waveOffset;
      
      if (i === 0) {
        path += ` L ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    }
    
    // Complete the polygon to fill bottom area
    path += ` L 100 100 L 0 100 Z`;
    return path;
  };

  // Generate stable clip path based on component props to avoid hydration mismatch
  const stableClipPathId = useMemo(() => {
    const hash = JSON.stringify({ lines, fillPercentage, liquidColor }).split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return `${clipPathId}-${Math.abs(hash)}`;
  }, [lines, fillPercentage, liquidColor, clipPathId]);
  
  return (
    <div>
      {/* SVG definition for the wavy clip path */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <clipPath id={stableClipPathId} clipPathUnits="objectBoundingBox">
            <path 
              d={generateWavyPath(fillPercentage).replace(/(\d+(\.\d+)?)/g, (match) => {
                return (parseFloat(match) / 100).toString();
              })}
              vectorEffect="non-scaling-stroke"
            />
          </clipPath>
        </defs>
      </svg>

      <div className="flex flex-col items-center w-full">
        {/* Brown border above text */}
        <div 
          className="w-96 h-10 rounded-t-lg border-t-8 border-x-8"
          style={{ borderColor: "#8c4100ff", backgroundColor: "transparent" }}
        />
        <div 
          className="w-full h-10 mb-3 rounded-lg border-8"
          style={{ borderColor: "#8c4100ff", backgroundColor: "transparent" }}
        />
      </div>
      
      <div className="relative">
        {/* Base filled text */}
        <div className="font-black select-none text-center flex flex-col items-center gap-1">
          {lines.map((line, index) => (
            <div
              key={`base-${index}`}
              style={{
                fontSize: line.fontSize,
                fontFamily,
                color: baseColor,
                lineHeight: 1,
                transform: `scaleY(${line.scaleY || 1})`
              }}
            >
              {line.text}
            </div>
          ))}
        </div>
        
        {/* Wavy overlay filled text */}
        <div 
          className="absolute top-0 left-0 font-black select-none overflow-hidden text-center flex flex-col items-center gap-1"
          style={{
            clipPath: `url(#${stableClipPathId})`,
          }}
        >
          {lines.map((line, index) => (
            <div
              key={`overlay-${index}`}
              style={{
                fontSize: line.fontSize,
                fontFamily,
                color: liquidColor,
                lineHeight: 1,
                transform: `scaleY(${line.scaleY || 1})`
              }}
            >
              {line.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiquidFillText;