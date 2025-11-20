import { useState, useEffect } from 'react';

function Settings({ 
  workTime, 
  breakTime, 
  onSave, 
  onClose 
}: { 
  workTime: number; 
  breakTime: number; 
  onSave: (workTime: number, breakTime: number) => void; 
  onClose: () => void; 
}) {
  const [localWorkTime, setLocalWorkTime] = useState(workTime);
  const [localBreakTime, setLocalBreakTime] = useState(breakTime);
  // ✅ MENSAJE TEMPORAL (Medio)
  const [message, setMessage] = useState('');

  useEffect(() => {
    setLocalWorkTime(workTime);
    setLocalBreakTime(breakTime);
  }, [workTime, breakTime]);

  const handleSave = () => {
    if (localWorkTime < 1 || localBreakTime < 1) {
      // ✅ VALIDACIÓN DE FORMULARIO (Medio)
      setMessage('❌ Los tiempos deben ser de al menos 1 minuto');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    
    onSave(localWorkTime, localBreakTime);
    setMessage('✅ Configuración guardada!');
    setTimeout(() => setMessage(''), 2000);
  };

  return (
    <div className="settings-overlay">
      <div className="settings-modal">
        <h3>⚙️ Configuración del Pomodoro</h3>
        
        {/* ✅ MENSAJE TEMPORAL */}
        {message && (
          <div className={`message ${message.includes('❌') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}
        
        <div className="setting-group">
          <label>
            🎯 Tiempo de trabajo (minutos):
            <input
              type="number"
              min="1"
              max="60"
              value={localWorkTime}
              onChange={(e) => setLocalWorkTime(Number(e.target.value))}
              className="setting-input"
            />
          </label>
        </div>

        <div className="setting-group">
          <label>
            ☕ Tiempo de descanso (minutos):
            <input
              type="number"
              min="1"
              max="30"
              value={localBreakTime}
              onChange={(e) => setLocalBreakTime(Number(e.target.value))}
              className="setting-input"
            />
          </label>
        </div>

        <div className="settings-buttons">
          <button onClick={handleSave} className="save-btn">
            💾 Guardar
          </button>
          <button onClick={onClose} className="cancel-btn">
            ❌ Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;