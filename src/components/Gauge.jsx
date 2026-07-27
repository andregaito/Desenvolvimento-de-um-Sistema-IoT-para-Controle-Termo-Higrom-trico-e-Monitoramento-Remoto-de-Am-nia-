import React from 'react';
import { formatarNumeroBR } from '../App';

export default function Gauge({ value }) {
  // Limites do Gauge
  const MAX_PPM = 40;
  const clampedValue = Math.min(Math.max(value, 0), MAX_PPM);
  
  // O semi-círculo em SVG. Um círculo completo tem 360 graus. 
  // O raio é 80, logo a circunferência completa é 2 * PI * 80 = 502.65
  // O semi-círculo visível tem 251.32 de comprimento.
  const circumference = 2 * Math.PI * 80;
  const semiCircumference = circumference / 2;
  
  // Porcentagens de cada área
  // Verde (0 a 20) = 50%
  // Amarelo (20 a 25) = 12.5%
  // Vermelho (25 a 40) = 37.5%
  const greenLength = semiCircumference * 0.50;
  const yellowLength = semiCircumference * 0.625; // Acumulado Verde + Amarelo
  const fullLength = semiCircumference; // Fundo vermelho (base)

  // Rotação do ponteiro: de -90 graus (0 ppm) até +90 graus (40 ppm)
  const angle = (clampedValue / MAX_PPM) * 180 - 90;

  return (
    <div className="flex flex-col items-center justify-center relative w-full pt-4">
      <svg viewBox="0 0 200 110" className="w-full max-w-[220px]">
        {/* Usamos rotação 180 para que o início do stroke (dasharray) comece pela esquerda */}
        <g transform="translate(100, 100) rotate(180)">
          {/* Base Vermelha (cobre os 180 graus) */}
          <circle 
            cx="0" cy="0" r="80" 
            fill="none" stroke="#ef4444" strokeWidth="20" 
            strokeDasharray={`${fullLength} ${circumference}`} 
          />
          {/* Base Amarela (cobre até o limite do amarelo, sobrepondo o vermelho) */}
          <circle 
            cx="0" cy="0" r="80" 
            fill="none" stroke="#facc15" strokeWidth="20" 
            strokeDasharray={`${yellowLength} ${circumference}`} 
          />
          {/* Base Verde (cobre o início, sobrepondo o amarelo) */}
          <circle 
            cx="0" cy="0" r="80" 
            fill="none" stroke="#4ade80" strokeWidth="20" 
            strokeDasharray={`${greenLength} ${circumference}`} 
          />
        </g>
        
        {/* Ponteiro */}
        <g transform={`translate(100, 100) rotate(${angle})`}>
          <polygon points="-4,-10 4,-10 0,-75" fill="#ffffff" />
          <circle cx="0" cy="-10" r="4" fill="#ffffff" />
        </g>
      </svg>
      
      {/* Textos no centro do Gauge */}
      <div className="absolute top-[50%] flex flex-col items-center">
        <span className="text-5xl font-bold">{formatarNumeroBR(value, 0)}</span>
        <span className="text-gray-400 text-sm">ppm</span>
      </div>
    </div>
  );
}