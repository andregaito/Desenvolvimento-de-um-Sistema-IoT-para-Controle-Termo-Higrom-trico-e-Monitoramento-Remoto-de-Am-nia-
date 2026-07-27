import React from 'react';
import { formatarNumeroBR } from '../App';

export default function Gauge({ value, hasData }) {
  const MAX_PPM = 40;
  const displayValue = hasData ? value : 0;
  const clampedValue = Math.min(Math.max(displayValue, 0), MAX_PPM);
  
  const circumference = 2 * Math.PI * 80;
  const semiCircumference = circumference / 2;
  
  const greenLength = semiCircumference * 0.50;
  const yellowLength = semiCircumference * 0.625; 
  const fullLength = semiCircumference;

  const angle = (clampedValue / MAX_PPM) * 180 - 90;

  return (
    <div className="flex flex-col items-center justify-center relative w-full pt-4">
      <svg viewBox="0 0 200 110" className="w-full max-w-[220px]">
        <g transform="translate(100, 100) rotate(180)" style={{ opacity: hasData ? 1 : 0.3 }}>
          <circle cx="0" cy="0" r="80" fill="none" stroke="#ef4444" strokeWidth="20" strokeDasharray={`${fullLength} ${circumference}`} />
          <circle cx="0" cy="0" r="80" fill="none" stroke="#facc15" strokeWidth="20" strokeDasharray={`${yellowLength} ${circumference}`} />
          <circle cx="0" cy="0" r="80" fill="none" stroke="#4ade80" strokeWidth="20" strokeDasharray={`${greenLength} ${circumference}`} />
        </g>
        
        {/* Ponteiro */}
        {hasData && (
          <g transform={`translate(100, 100) rotate(${angle})`}>
            <polygon points="-3,-40 3,-40 0,-75" fill="#ffffff" />
            <circle cx="0" cy="-40" r="3" fill="#ffffff" />
          </g>
        )}
      </svg>
      
      <div className="absolute top-[55%] flex flex-col items-center">
        <span className={`text-5xl font-bold ${!hasData && 'text-gray-600'}`}>
          {hasData ? formatarNumeroBR(value, 0) : '--'}
        </span>
        <span className="text-gray-400 text-sm">ppm</span>
      </div>
    </div>
  );
}