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

  return `rgba(${r}, ${g}, ${b}, 0.8)`; // Opacidade aumentada para o overlay
}

// Componente SVG que recria fielmente a Planta Baixa da Sala 2
const PlantaSVG = () => (
  <svg className="absolute inset-0 w-full h-full z-0 opacity-40" viewBox="0 0 340 450" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    {/* Fundo da planta */}
    <rect width="340" height="450" fill="#1e1e1e" />
    
    {/* Paredes externas principais */}
    <path d="M 10 10 L 330 10 L 330 440 L 10 440 Z" fill="none" stroke="#fff" strokeWidth="4"/>
    
    {/* Porta Superior Esquerda e marcação de abertura */}
    <rect x="25" y="0" width="80" height="20" fill="#1e1e1e"/>
    <path d="M 105 10 A 80 80 0 0 0 25 90" fill="none" stroke="#aaa" strokeWidth="2" strokeDasharray="5,5"/>
    
    {/* Porta Inferior Esquerda e marcação de abertura */}
    <rect x="0" y="340" width="20" height="70" fill="#1e1e1e"/>
    <path d="M 10 340 A 70 70 0 0 1 80 410" fill="none" stroke="#aaa" strokeWidth="2" strokeDasharray="5,5"/>
    
    {/* Bancadas / Mesas (Lado Direito) */}
    <rect x="260" y="90" width="60" height="60" fill="none" stroke="#fff" strokeWidth="2"/>
    <rect x="260" y="160" width="60" height="60" fill="none" stroke="#fff" strokeWidth="2"/>
    <rect x="260" y="230" width="60" height="60" fill="none" stroke="#fff" strokeWidth="2"/>
    <rect x="260" y="300" width="60" height="60" fill="none" stroke="#fff" strokeWidth="2"/>
    <rect x="260" y="370" width="60" height="60" fill="none" stroke="#fff" strokeWidth="2"/>

    {/* Estruturas Lado Esquerdo (Carrinhos/Armários) */}
    <rect x="20" y="140" width="40" height="80" fill="none" stroke="#fff" strokeWidth="2"/>
    <rect x="20" y="240" width="40" height="80" fill="none" stroke="#fff" strokeWidth="2"/>
    
    {/* Textos da Sala */}
    <text x="160" y="140" fontFamily="sans-serif" fontSize="60" textAnchor="middle" fill="#555" fontWeight="bold">2</text>
    <text x="160" y="170" fontFamily="sans-serif" fontSize="10" textAnchor="middle" fill="#888">SALA DE CRIAÇÃO 2</text>
    <text x="160" y="185" fontFamily="sans-serif" fontSize="10" textAnchor="middle" fill="#888">25,79 m²</text>
  </svg>
);

export default function Heatmap({ data, type }) {
  const minVal = type === 'temp' ? 20 : 40;
  const maxVal = type === 'temp' ? 30 : 80;
  const unidade = type === 'temp' ? '°C' : '%';

  const v = data.map(n => type === 'temp' ? n.temp : n.umid);

  // 10 Pontos de gradiente baseados nas posições lógicas dos sensores
  const bgGradient = `
    radial-gradient(circle at 15% 10%, ${getColorForValue(v[0], minVal, maxVal)} 0%, transparent 45%),
    radial-gradient(circle at 50% 10%, ${getColorForValue(v[1], minVal, maxVal)} 0%, transparent 45%),
    radial-gradient(circle at 85% 10%, ${getColorForValue(v[2], minVal, maxVal)} 0%, transparent 45%),
    radial-gradient(circle at 15% 35%, ${getColorForValue(v[3], minVal, maxVal)} 0%, transparent 45%),
    radial-gradient(circle at 85% 35%, ${getColorForValue(v[4], minVal, maxVal)} 0%, transparent 45%),
    radial-gradient(circle at 50% 50%, ${getColorForValue(v[5], minVal, maxVal)} 0%, transparent 50%),
    radial-gradient(circle at 15% 65%, ${getColorForValue(v[6], minVal, maxVal)} 0%, transparent 45%),
    radial-gradient(circle at 85% 65%, ${getColorForValue(v[7], minVal, maxVal)} 0%, transparent 45%),
    radial-gradient(circle at 20% 90%, ${getColorForValue(v[8], minVal, maxVal)} 0%, transparent 45%),
    radial-gradient(circle at 80% 90%, ${getColorForValue(v[9], minVal, maxVal)} 0%, transparent 45%)
  `;

  const nodeClass = "absolute bg-black/80 px-1.5 py-1 rounded-lg text-center border border-gray-600 shadow-md backdrop-blur-sm z-20 transition-all";

  // Posições dos 10 sensores na planta (26m quadrados distribuidos uniformemente)
  const pos = [
    { top: '5%', left: '10%' }, // 0: Sup Esq
    { top: '5%', left: '50%', transform: 'translateX(-50%)' }, // 1: Sup Centro
    { top: '5%', right: '10%' }, // 2: Sup Dir
    { top: '28%', left: '10%' }, // 3: Meio-Sup Esq
    { top: '28%', right: '10%' }, // 4: Meio-Sup Dir
    { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', isCenter: true }, // 5: Centro Absoluto
    { top: '65%', left: '10%' }, // 6: Meio-Inf Esq
    { top: '65%', right: '10%' }, // 7: Meio-Inf Dir
    { bottom: '5%', left: '15%' }, // 8: Inf Esq
    { bottom: '5%', right: '15%' }  // 9: Inf Dir
  ];

  return (
    <div className="relative w-full max-w-[340px] h-[450px] border-2 border-gray-700 rounded-lg mx-auto overflow-hidden bg-[#1e1e1e]">
      
      {/* Camada 1: O desenho técnico da Planta Baixa gerado em SVG */}
      <PlantaSVG />
      
      {/* Camada 2: O Mapa de Calor sobreposto (Multiply/Opacity) */}
      <div 
        className="absolute inset-0 z-10 opacity-60 mix-blend-screen transition-all duration-700" 
        style={{ background: bgGradient }}
      />

      {/* Camada 3: Os 10 Nós dos Sensores */}
      {pos.map((p, i) => (
        <div key={i} className={nodeClass + (p.isCenter ? " border-[#4ade80]" : "")} style={p}>
          {p.isCenter && <div className="text-[9px] text-[#4ade80] font-bold mb-0.5 tracking-widest">CENTRO / NH₃</div>}
          <div className={`font-bold ${p.isCenter ? 'text-sm' : 'text-[11px]'}`}>
            {formatarNumeroBR(v[i])} {unidade}
          </div>
          {p.isCenter && (
            <div className="text-[#facc15] text-[10px] mt-0.5 border-t border-gray-600 pt-0.5">
              {formatarNumeroBR(data[i].press, 1)} hPa
            </div>
          )}
        </div>
      ))}
    </div>
  );
}