import React from 'react';

const LiquidFillText = ({ 
  lines = [
    { text: "FEEL FREE", fontSize: "5rem", scaleY: 1 },
    { text: "TO HAVE A", fontSize: "4.2rem", scaleY: 1 },
    { text: "WEE PASTRY", fontSize: "3rem", scaleY: 1 },
    { text: "AND A BIG", fontSize: "3rem", scaleY: 1 },
    { text: "COFFEE*", fontSize: "2.5rem", scaleY: 1 }
  ],
  liquidColor = "#8c4100ff",
  baseColor = "#ffd29d",
  fontFamily = "GT Ultra Fine, serif",
  fillPercentage = 0
}) => {
  return (
    <div>
    <div className="flex flex-col items-center w-full">
        {/* Brown border above text */}
        <div 
            className="w-80 h-8 rounded-t-lg border-t-6 border-x-6"
            style={{ borderColor: "#8c4100ff", backgroundColor: "transparent" }}
        />
        <div 
            className="w-full h-8 mb-2 rounded-lg border-6"
            style={{ borderColor: "#8c4100ff", backgroundColor: "transparent" }}
        />
    </div>
      
      <div className="relative">
        {/* Base filled text */}
      <div 
        className="font-black select-none text-center flex flex-col items-center gap-1"
      >
        {lines.map((line, index) => (
          <div
            key={`base-${index}`}
            style={{
              fontSize: line.fontSize,
              fontFamily,
              color: baseColor,
              lineHeight: 0.8,
              transform: `scaleY(${line.scaleY || 1})`
            }}
          >
            {line.text}
          </div>
        ))}
      </div>
      
      {/* Overlay filled text */}
      <div 
        className="absolute top-0 left-0 font-black select-none overflow-hidden text-center flex flex-col items-center gap-1"
        style={{
          clipPath: `polygon(0 ${100 - fillPercentage}%, 100% ${100 - fillPercentage}%, 100% 100%, 0% 100%)`,
        }}
      >
        {lines.map((line, index) => (
          <div
            key={`overlay-${index}`}
            style={{
              fontSize: line.fontSize,
              fontFamily,
              color: liquidColor,
              lineHeight: 0.8,
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