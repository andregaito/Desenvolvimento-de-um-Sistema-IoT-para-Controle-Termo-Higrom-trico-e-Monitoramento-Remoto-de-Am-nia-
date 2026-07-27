import React, { useState, useEffect } from 'react';
import Gauge from './components/Gauge';
import Heatmap from './components/Heatmap';
import NH3Chart from './components/NH3Chart';

export const formatarNumeroBR = (num, casasDecimais = 1) => {
  return Number(num).toFixed(casasDecimais).replace('.', ',');
};

export default function App() {
  const [currentRoom, setCurrentRoom] = useState('Sala 2');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('temp');
  const [showChart, setShowChart] = useState(false);
  
  const [historicoNH3, setHistoricoNH3] = useState([]);
  const [labelsTempo, setLabelsTempo] = useState([]);
  const [sensorData, setSensorData] = useState({
    nh3: 0,
    nos: Array(10).fill({ temp: 0, umid: 0, press: 0 })
  });

  const salas = ['Sala 2', 'Sala 3', 'Sala 4', 'Sala 5'];
  const hasData = currentRoom === 'Sala 2';

  // Simulação de recebimento de dados da API
  useEffect(() => {
    const interval = setInterval(() => {
      const novoNH3 = 14 + Math.random() * 14; 
      
      const novosNos = Array(10).fill(0).map((_, i) => {
        const baseTemp = 22.5 + (i * 0.25); 
        const baseUmid = 56.0 - (i * 0.4);
        return {
          temp: baseTemp + (Math.random() * 1.5 - 0.75),
          umid: baseUmid + (Math.random() * 3 - 1.5),
          press: 1012.5 + (Math.random() * 1)
        };
      });

      setSensorData({ nh3: novoNH3, nos: novosNos });

      const agora = new Date();
      const horaStr = `${String(agora.getHours()).padStart(2, '0')}:${String(agora.getMinutes()).padStart(2, '0')}:${String(agora.getSeconds()).padStart(2, '0')}`;
      
      setHistoricoNH3(prev => [...prev.slice(-14), novoNH3]);
      setLabelsTempo(prev => [...prev.slice(-14), horaStr]);

    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 sm:p-6 max-w-md mx-auto relative min-h-screen">
      <header className="flex justify-between items-center mb-6 relative">
        <div className="flex items-center gap-3">
          {/* Botão Menu Hamburger */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="p-2 bg-[#1e1e1e] border border-[#333] rounded-lg hover:bg-gray-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl sm:text-2xl font-bold">ClimaTech</h1>
        </div>
        
        <span className={`text-xs text-white px-3 py-1 rounded-full font-semibold tracking-wider ${hasData ? 'bg-blue-600' : 'bg-gray-600'}`}>
          {currentRoom.toUpperCase()}
        </span>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute top-12 left-0 w-48 bg-[#1e1e1e] border border-[#333] rounded-xl shadow-2xl z-50 overflow-hidden">
            <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-[#333]">
              Selecionar Ambiente
            </div>
            {salas.map(sala => (
              <button
                key={sala}
                onClick={() => {
                  setCurrentRoom(sala);
                  setIsMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-sm transition-colors ${currentRoom === sala ? 'bg-blue-600/20 text-blue-400 font-bold' : 'text-gray-300 hover:bg-[#2a2a2a]'}`}
              >
                {sala} {sala === 'Sala 2' && <span className="float-right w-2 h-2 rounded-full bg-green-500 mt-1.5"></span>}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Cartão de Amônia */}
      <div className="card relative">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-gray-300 font-bold tracking-wide">Nível Amônia (NH₃)</h2>
          <button 
            onClick={() => setShowChart(true)} 
            disabled={!hasData}
            className={`p-2 rounded-lg transition-colors ${hasData ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-800 opacity-50 cursor-not-allowed'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </button>
        </div>
        
        <Gauge value={sensorData.nh3} hasData={hasData} />
        
        <div className="text-[11px] sm:text-xs font-medium text-gray-400 mt-4 border-t border-gray-700 pt-3 text-center min-h-[32px]">
          {hasData ? (
            <>
              Status: <span className="text-[#4ade80]">Seguro (&lt;20 ppm)</span>{' '}
              <span className="text-[#facc15]">AVISO (20 a 25)</span>{' '}
              <span className="text-[#ef4444]">ALERTA (&gt;25)</span>
            </>
          ) : (
            <span className="text-gray-500 animate-pulse">Aguardando instalação de sensores...</span>
          )}
        </div>
      </div>

      {/* Controles de Aba */}
      <div className="flex mb-4 border-b border-gray-700">
        <button 
          onClick={() => setCurrentTab('temp')} 
          className={`flex-1 py-3 text-sm text-center transition-all ${currentTab === 'temp' ? 'border-b-2 border-white text-white font-bold' : 'text-gray-400'}`}
        >
          MAPA TÉRMICO
        </button>
        <button 
          onClick={() => setCurrentTab('umid')} 
          className={`flex-1 py-3 text-sm text-center transition-all ${currentTab === 'umid' ? 'border-b-2 border-white text-white font-bold' : 'text-gray-400'}`}
        >
          MAPA UMIDADE
        </button>
      </div>

      {/* Cartão do Mapa */}
      <div className="card p-0 overflow-hidden border-2 border-[#333]">
        <Heatmap data={sensorData.nos} type={currentTab} hasData={hasData} roomName={currentRoom} />
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
            <h3 className="text-lg font-bold mb-4 text-center">Histórico de Amônia (NH₃) - {currentRoom}</h3>
            <NH3Chart labels={hasData ? labelsTempo : []} data={hasData ? historicoNH3 : []} />
          </div>
        </div>
      )}
    </div>
  );
}