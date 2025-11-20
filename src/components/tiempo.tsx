import { useState, useEffect } from 'react';
import './tiempo.css'; // CSS normal, no modules

function Timer({ timeLeft, mode, completedSessions }: { 
  timeLeft: number; 
  mode: 'work' | 'break'; 
  completedSessions: number; 
}) {
  // ANIMACIÓN CONTADOR
  const [isTimeLow, setIsTimeLow] = useState(false);
  const [pulse, setPulse] = useState(false);

  // Formatear el tiempo en minutos:segundos
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // EFECTO PARA ANIMACIONES
  useEffect(() => {
    // Animación cuando queda poco tiempo
    if (timeLeft <= 60 && timeLeft > 0) {
      setIsTimeLow(true);
    } else {
      setIsTimeLow(false);
    }

    // Pulse animation cada segundo cuando el tiempo es bajo
    if (timeLeft <= 30 && timeLeft > 0) {
      const pulseInterval = setInterval(() => {
        setPulse(prev => !prev);
      }, 1000);
      
      return () => clearInterval(pulseInterval);
    } else {
      setPulse(false);
    }
  }, [timeLeft]);

  const modeText = mode === 'work' ? '🎯 Tiempo de Trabajo' : '☕ Descanso';
  const modeEmoji = mode === 'work' ? '🎯' : '☕';
  const totalTime = mode === 'work' ? 25 * 60 : 5 * 60;
  const progress = (totalTime - timeLeft) / totalTime * 100;

  // Clases condicionales para animaciones
  const timeClass = `time ${isTimeLow ? 'time-low' : ''} ${pulse ? 'time-pulse' : ''}`;
  const timerDisplayClass = `timer-display ${mode === 'work' ? 'timer-work' : 'timer-break'} ${isTimeLow ? 'timer-alert' : ''}`;
  const mascotClass = `mascot ${pulse ? 'mascot-pulse' : 'mascot-idle'} ${mode === 'work' ? 'mascot-work' : 'mascot-break'}`;

  return (
    <div className="timer">
      <div className={timerDisplayClass}>
        <h2 className="timer-title">{modeText}</h2>
        
        {/* CONTADOR CON ANIMACIÓN */}
        <div className={timeClass}>
          {formatTime(timeLeft)}
          {isTimeLow && <span className="warning-icon"> ⚠️</span>}
        </div>
        
        {/* BARRA DE PROGRESO ANIMADA */}
        <div className="progress-bar">
          <div 
            className={`progress-fill ${mode === 'work' ? 'progress-work' : 'progress-break'}`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* INFORMACIÓN ADICIONAL */}
        <div className="session-info">
          <div className="sessions-counter">
            {modeEmoji} Sesiones completadas: <strong>{completedSessions}</strong>
          </div>
          
          {/* INDICADOR VISUAL DE TIEMPO BAJO */}
          {isTimeLow && (
            <div className="time-warning">
              {timeLeft <= 30 ? '¡Poco tiempo! ⏰' : 'Último minuto 🎯'}
            </div>
          )}
        </div>

        {/* INDICADOR DE MODO ACTUAL */}
        <div className="mode-indicator">
          {mode === 'work' ? (
            <span className="work-indicator">🔴 Trabajando</span>
          ) : (
            <span className="break-indicator">🟢 Descansando</span>
          )}
        </div>
      </div>

      {/* MASCOTA DECORATIVA DEBAJO DEL TIMER */}
      <div className={mascotClass} aria-hidden>
        <svg className="mascot-svg" viewBox="0 0 140 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="gato decorativo">
          {/* cuerpo */}
          <ellipse className="mascot-body" cx={70} cy={72} rx={40} ry={26} fill="var(--work-primary)" opacity={0.98} />
          {/* cabeza */}
          <circle className="mascot-head" cx={70} cy={46} r={20} fill="var(--work-primary)" />
          {/* orejas */}
          <path className="mascot-ear" d="M58 34 L52 18 L66 30 Z" fill="var(--work-primary)" />
          <path className="mascot-ear" d="M82 34 L88 18 L74 30 Z" fill="var(--work-primary)" />
          {/* ojos */}
          <ellipse className="mascot-eye" cx={62} cy={44} rx={4} ry={5} fill="#fff" />
          <ellipse className="mascot-eye" cx={78} cy={44} rx={4} ry={5} fill="#fff" />
          <circle className="mascot-eye-pupil" cx={62} cy={44} r={1.8} fill="#111" />
          <circle className="mascot-eye-pupil" cx={78} cy={44} r={1.8} fill="#111" />
          {/* nariz y boca */}
          <path className="mascot-nose" d="M70 50 Q68 54 70 56 Q72 54 70 50 Z" fill="#f8c3c3" />
          <path className="mascot-mouth" d="M64 58 Q70 62 76 58" stroke="#fff" strokeWidth={1.6} fill="none" strokeLinecap="round" />
          {/* bigotes */}
          <path d="M52 52 H62" stroke="rgba(255,255,255,0.6)" strokeWidth={1} strokeLinecap="round" />
          <path d="M78 52 H88" stroke="rgba(255,255,255,0.6)" strokeWidth={1} strokeLinecap="round" />
          {/* cola (se moverá) */}
          <path className="mascot-tail" d="M108 74 C120 70, 130 60, 126 50" stroke="var(--work-secondary)" strokeWidth={5} strokeLinecap="round" fill="none" />
        </svg>
      </div>
    </div>
  );
}

export default Timer;