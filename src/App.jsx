import React, { useState, useEffect } from 'react';
import Gauge from './components/Gauge';
import Heatmap from './components/Heatmap';
import NH3Chart from './components/NH3Chart';

// Função de formatação exigida para compatibilidade com planilhas BR
export const formatarNumeroBR = (num, casasDecimais = 1) => {
  return Number(num).toFixed(casasDecimais).replace('.', ',');
};

export default function App() {
  const [currentTab, setCurrentTab] = useState('temp');
  const [showChart, setShowChart] = useState(false);
  const [historicoNH3, setHistoricoNH3] = useState([]);
  const [labelsTempo, setLabelsTempo] = useState([]);
  const [sensorData, setSensorData] = useState({
    nh3: 0,
    nos: Array(5).fill({ temp: 0, umid: 0, press: 0 })
  });

  // Simulação de recebimento de dados da API da Orange Pi
  useEffect(() => {
    const interval = setInterval(() => {
      const novoNH3 = 14 + Math.random() * 14; // Varia de 14 a 28
      const novosNos = [
        { temp: 22.5 + Math.random(), umid: 55.2 + Math.random(), press: 1013 },
        { temp: 23.1 + Math.random(), umid: 54.8 + Math.random(), press: 1013 },
        { temp: 24.2 + Math.random(), umid: 56.1 + Math.random(), press: 1012.8 + Math.random() }, // Centro
        { temp: 28.8 + Math.random(), umid: 70.5 + Math.random(), press: 1013 },
        { temp: 21.3 + Math.random(), umid: 45.2 + Math.random(), press: 1013 }
      ];

      setSensorData({ nh3: novoNH3, nos: novosNos });

      // Atualiza histórico do gráfico
      const agora = new Date();
      const horaStr = `${String(agora.getHours()).padStart(2, '0')}:${String(agora.getMinutes()).padStart(2, '0')}:${String(agora.getSeconds()).padStart(2, '0')}`;
      
      setHistoricoNH3(prev => [...prev.slice(-14), novoNH3]);
      setLabelsTempo(prev => [...prev.slice(-14), horaStr]);

    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 sm:p-6 max-w-md mx-auto relative min-h-screen">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">ClimaTech Monitor</h1>
        <span className="text-xs bg-green-600 text-white px-3 py-1 rounded-full font-semibold tracking-wider">SALA 1</span>
      </header>

      {/* Cartão de Amônia */}
      <div className="card relative">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-gray-300 font-bold tracking-wide">Nível Amônia (NH₃)</h2>
          <button 
            onClick={() => setShowChart(true)} 
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </button>
        </div>
        
        <Gauge value={sensorData.nh3} />
        
        <div className="text-[11px] sm:text-xs font-medium text-gray-400 mt-4 border-t border-gray-700 pt-3 text-center">
          Status: <span className="text-[#4ade80]">Seguro (&lt;20 ppm)</span>{' '}
          <span className="text-[#facc15]">AVISO (20 a 25)</span>{' '}
          <span className="text-[#ef4444]">ALERTA (&gt;25)</span>
        </div>
      </div>

      {/* Controles de Aba */}
      <div className="flex mb-4 border-b border-gray-700">
        <button 
          onClick={() => setCurrentTab('temp')} 
          className={`flex-1 py-3 text-sm text-center transition-all ${currentTab === 'temp' ? 'border-b-2 border-white text-white font-bold' : 'text-gray-400'}`}
        >
          TEMPERATURA
        </button>
        <button 
          onClick={() => setCurrentTab('umid')} 
          className={`flex-1 py-3 text-sm text-center transition-all ${currentTab === 'umid' ? 'border-b-2 border-white text-white font-bold' : 'text-gray-400'}`}
        >
          UMIDADE
        </button>
      </div>

      {/* Cartão do Mapa */}
      <div className="card">
        <Heatmap data={sensorData.nos} type={currentTab} />
      </div>

      {/* Modal do Gráfico */}
      {showChart && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1e1e1e] border border-gray-700 rounded-xl w-full max-w-md p-4 relative">
            <button 
              onClick={() => setShowChart(false)} 
              className="absolute top-2 right-2 text-gray-400 hover:text-white p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-lg font-bold mb-4 text-center">Histórico de Amônia (NH₃)</h3>
            <NH3Chart labels={labelsTempo} data={historicoNH3} />
          </div>
        </div>
      )}
    </div>
  );
}