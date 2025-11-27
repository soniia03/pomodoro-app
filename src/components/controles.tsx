import { useState } from "react";

function Controls({ 
  isRunning, 
  onStartStop, 
  onReset, 
  onShowSettings 
}: { 
  isRunning: boolean; 
  onStartStop: () => void; 
  onReset: () => void; 
  onShowSettings: () => void; 
}) {

  const [isHovered, setIsHovered] = useState('');

  return (
    <div className="controls">
      <button 
        className={`control-btn ${isRunning ? 'stop' : 'start'} ${isHovered === 'start' ? 'hover' : ''}`}
        onClick={onStartStop}
        onMouseEnter={() => setIsHovered('start')}
        onMouseLeave={() => setIsHovered('')}
      >
        {isRunning ? '⏸️ Pausar' : '▶️ Comenzar'}
      </button>
      
      <button 
        className={`control-btn reset ${isHovered === 'reset' ? 'hover' : ''}`}
        onClick={onReset}
        onMouseEnter={() => setIsHovered('reset')}
        onMouseLeave={() => setIsHovered('')}
      >
        🔄 Reiniciar
      </button>
      
      <button 
        className={`control-btn settings ${isHovered === 'settings' ? 'hover' : ''}`}
        onClick={onShowSettings}
        onMouseEnter={() => setIsHovered('settings')}
        onMouseLeave={() => setIsHovered('')}
      >
        ⚙️ Configuración
      </button>
    </div>
  );
}

export default Controls;