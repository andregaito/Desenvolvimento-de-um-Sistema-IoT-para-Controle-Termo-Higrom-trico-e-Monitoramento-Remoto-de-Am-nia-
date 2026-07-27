import React from 'react';
import { formatarNumeroBR } from '../App';

function getColorForValue(value, min, max) {
  let ratio = (value - min) / (max - min);
  if (ratio < 0) ratio = 0;
  if (ratio > 1) ratio = 1;

  const colors = [
    { pct: 0.00, r: 0, g: 0, b: 255 },
    { pct: 0.25, r: 0, g: 255, b: 255 },
    { pct: 0.50, r: 0, g: 255, b: 0 },
    { pct: 0.75, r: 255, g: 255, b: 0 },
    { pct: 1.00, r: 255, g: 0, b: 0 }
  ];

  let i = 1;
  for (; i < colors.length - 1; i++) {
    if (ratio < colors[i].pct) break;
  }
  const lower = colors[i - 1];
  const upper = colors[i];
  const range = upper.pct - lower.pct;
  const rangePct = (ratio - lower.pct) / range;

  const r = Math.round(lower.r + (upper.r - lower.r) * rangePct);
  const g = Math.round(lower.g + (upper.g - lower.g) * rangePct);
  const b = Math.round(lower.b + (upper.b - lower.b) * rangePct);

  return `rgba(${r}, ${g}, ${b}, 0.8)`; 
}

const PlantaSVG = ({ roomName }) => {
  const roomNum = roomName.split(' ')[1] || '2';
  return (
    <svg className="absolute inset-0 w-full h-full z-0 opacity-40" viewBox="0 0 340 450" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="340" height="450" fill="#1e1e1e" />
      <path d="M 10 10 L 330 10 L 330 440 L 10 440 Z" fill="none" stroke="#fff" strokeWidth="4"/>
      
      <rect x="25" y="0" width="80" height="20" fill="#1e1e1e"/>
      <path d="M 105 10 A 80 80 0 0 0 25 90" fill="none" stroke="#aaa" strokeWidth="2" strokeDasharray="5,5"/>
      
      <rect x="0" y="340" width="20" height="70" fill="#1e1e1e"/>
      <path d="M 10 340 A 70 70 0 0 1 80 410" fill="none" stroke="#aaa" strokeWidth="2" strokeDasharray="5,5"/>
      
      <rect x="260" y="90" width="60" height="60" fill="none" stroke="#fff" strokeWidth="2"/>
      <rect x="260" y="160" width="60" height="60" fill="none" stroke="#fff" strokeWidth="2"/>
      <rect x="260" y="230" width="60" height="60" fill="none" stroke="#fff" strokeWidth="2"/>
      <rect x="260" y="300" width="60" height="60" fill="none" stroke="#fff" strokeWidth="2"/>
      <rect x="260" y="370" width="60" height="60" fill="none" stroke="#fff" strokeWidth="2"/>

      <rect x="20" y="140" width="40" height="80" fill="none" stroke="#fff" strokeWidth="2"/>
      <rect x="20" y="240" width="40" height="80" fill="none" stroke="#fff" strokeWidth="2"/>
      
      <text x="160" y="140" fontFamily="sans-serif" fontSize="60" textAnchor="middle" fill="#555" fontWeight="bold">{roomNum}</text>
      <text x="160" y="170" fontFamily="sans-serif" fontSize="10" textAnchor="middle" fill="#888">SALA DE CRIAÇÃO {roomNum}</text>
      <text x="160" y="185" fontFamily="sans-serif" fontSize="10" textAnchor="middle" fill="#888">25,79 m²</text>
    </svg>
  );
};

export default function Heatmap({ data, type, hasData, roomName }) {
  const minVal = type === 'temp' ? 20 : 40;
  const maxVal = type === 'temp' ? 30 : 80;

  // Valor principal que guia as CORES do heatmap
  const vFocus = data.map(n => type === 'temp' ? n.temp : n.umid);

  const bgGradient = hasData ? `
    radial-gradient(circle at 15% 10%, ${getColorForValue(vFocus[0], minVal, maxVal)} 0%, transparent 45%),
    radial-gradient(circle at 50% 10%, ${getColorForValue(vFocus[1], minVal, maxVal)} 0%, transparent 45%),
    radial-gradient(circle at 85% 10%, ${getColorForValue(vFocus[2], minVal, maxVal)} 0%, transparent 45%),
    radial-gradient(circle at 15% 35%, ${getColorForValue(vFocus[3], minVal, maxVal)} 0%, transparent 45%),
    radial-gradient(circle at 85% 35%, ${getColorForValue(vFocus[4], minVal, maxVal)} 0%, transparent 45%),
    radial-gradient(circle at 50% 50%, ${getColorForValue(vFocus[5], minVal, maxVal)} 0%, transparent 50%),
    radial-gradient(circle at 15% 65%, ${getColorForValue(vFocus[6], minVal, maxVal)} 0%, transparent 45%),
    radial-gradient(circle at 85% 65%, ${getColorForValue(vFocus[7], minVal, maxVal)} 0%, transparent 45%),
    radial-gradient(circle at 20% 90%, ${getColorForValue(vFocus[8], minVal, maxVal)} 0%, transparent 45%),
    radial-gradient(circle at 80% 90%, ${getColorForValue(vFocus[9], minVal, maxVal)} 0%, transparent 45%)
  ` : 'none';

  const nodeClass = "absolute bg-black/85 px-1.5 py-1 rounded-md text-center border border-gray-600 shadow-md backdrop-blur-sm z-20 transition-all";

  const pos = [
    { top: '5%', left: '10%' }, 
    { top: '5%', left: '50%', transform: 'translateX(-50%)' }, 
    { top: '5%', right: '10%' }, 
    { top: '28%', left: '10%' }, 
    { top: '28%', right: '10%' }, 
    { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', isCenter: true }, 
    { top: '65%', left: '10%' }, 
    { top: '65%', right: '10%' }, 
    { bottom: '5%', left: '15%' }, 
    { bottom: '5%', right: '15%' }  
  ];

  return (
    <div className="relative w-full max-w-[340px] h-[450px] mx-auto overflow-hidden bg-[#121212]">
      
      <PlantaSVG roomName={roomName} />
      
      {hasData && (
        <div 
          className="absolute inset-0 z-10 opacity-60 mix-blend-screen transition-all duration-700" 
          style={{ background: bgGradient }}
        />
      )}

      {/* Grid simulando ausência de dados */}
      {!hasData && (
        <div className="absolute inset-0 z-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGgyMHYyMEgwVjB6bTEgMWgxOHYxOEgxVjF6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=')] opacity-50" />
      )}

      {pos.map((p, i) => (
        <div key={i} className={nodeClass + (p.isCenter ? " border-[#4ade80]" : "")} style={p}>
          {p.isCenter && <div className="text-[8px] text-[#4ade80] font-bold mb-0.5 tracking-widest leading-none">CENTRO</div>}
          
          {/* Exibição combinada de Temperatura e Umidade */}
          <div className={`font-bold leading-tight ${p.isCenter ? 'text-xs' : 'text-[9px]'}`}>
            <div className={type === 'temp' ? 'text-white' : 'text-gray-400'}>
              {hasData ? formatarNumeroBR(data[i].temp) : '--'} °C
            </div>
            <div className={type === 'umid' ? 'text-blue-300' : 'text-gray-400'}>
              {hasData ? formatarNumeroBR(data[i].umid) : '--'} %
            </div>
          </div>
          
          {p.isCenter && (
            <div className="text-[#facc15] text-[9px] mt-0.5 border-t border-gray-600 pt-0.5 leading-none">
              {hasData ? formatarNumeroBR(data[i].press, 1) : '--'} hPa
            </div>
          )}
        </div>
      ))}
    </div>
  );
}