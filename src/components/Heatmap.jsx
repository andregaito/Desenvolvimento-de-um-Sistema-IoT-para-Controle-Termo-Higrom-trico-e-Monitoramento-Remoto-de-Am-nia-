import React from 'react';
import { formatarNumeroBR } from '../App';

function getColorForValue(value, min, max) {
  let ratio = (value - min) / (max - min);
  if (ratio < 0) ratio = 0;
  if (ratio > 1) ratio = 1;

  const colors = [
    { pct: 0.00, r: 0, g: 0, b: 255 },     // Azul
    { pct: 0.25, r: 0, g: 255, b: 255 },   // Ciano
    { pct: 0.50, r: 0, g: 255, b: 0 },     // Verde
    { pct: 0.75, r: 255, g: 255, b: 0 },   // Amarelo
    { pct: 1.00, r: 255, g: 0, b: 0 }      // Vermelho
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

  return `rgba(${r}, ${g}, ${b}, 0.5)`;
}

export default function Heatmap({ data, type }) {
  const minVal = type === 'temp' ? 20 : 40;
  const maxVal = type === 'temp' ? 30 : 80;
  const unidade = type === 'temp' ? '°C' : '%';

  const v = data.map(n => type === 'temp' ? n.temp : n.umid);

  const bgGradient = `
    radial-gradient(circle at 10% 10%, ${getColorForValue(v[0], minVal, maxVal)} 0%, transparent 60%),
    radial-gradient(circle at 90% 10%, ${getColorForValue(v[1], minVal, maxVal)} 0%, transparent 60%),
    radial-gradient(circle at 50% 50%, ${getColorForValue(v[2], minVal, maxVal)} 0%, transparent 70%),
    radial-gradient(circle at 10% 90%, ${getColorForValue(v[3], minVal, maxVal)} 0%, transparent 60%),
    radial-gradient(circle at 90% 90%, ${getColorForValue(v[4], minVal, maxVal)} 0%, transparent 60%)
  `;

  const nodeClass = "absolute bg-black/85 px-2 py-1 rounded-lg text-sm text-center border border-gray-600 shadow-md backdrop-blur-sm transition-all";

  return (
    <div 
      className="relative w-full max-w-[340px] h-[450px] border-2 border-gray-600 rounded-lg mx-auto overflow-hidden transition-all duration-500"
      style={{ background: bgGradient }}
    >
      {/* Nó 1: Canto Superior Esquerdo */}
      <div className={`${nodeClass} top-4 left-4`}>
        <div className="font-bold text-base">{formatarNumeroBR(v[0])} {unidade}</div>
      </div>
      
      {/* Nó 2: Canto Superior Direito */}
      <div className={`${nodeClass} top-4 right-4`}>
        <div className="font-bold text-base">{formatarNumeroBR(v[1])} {unidade}</div>
      </div>
      
      {/* Nó 3: Centro */}
      <div className={`${nodeClass} top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] border-[#4ade80] z-10`}>
        <div className="text-[10px] text-[#4ade80] font-bold mb-1 tracking-widest">CENTRO</div>
        <div className="font-bold text-lg">{formatarNumeroBR(v[2])} {unidade}</div>
        <div className="text-[#facc15] text-[11px] mt-1 border-t border-gray-600 pt-1">
          {formatarNumeroBR(data[2].press, 1)} hPa
        </div>
      </div>
      
      {/* Nó 4: Canto Inferior Esquerdo */}
      <div className={`${nodeClass} bottom-4 left-4`}>
        <div className="font-bold text-base">{formatarNumeroBR(v[3])} {unidade}</div>
      </div>
      
      {/* Nó 5: Canto Inferior Direito */}
      <div className={`${nodeClass} bottom-4 right-4`}>
        <div className="font-bold text-base">{formatarNumeroBR(v[4])} {unidade}</div>
      </div>
    </div>
  );
}