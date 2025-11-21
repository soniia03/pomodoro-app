import { useState, useEffect } from 'react';
import './App.css';

// Interfaces
interface Task {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
  timeSpent: number;
  isTracking?: boolean;
}

interface Session {
  id: number;
  mode: string;
  duration: number;
  completedAt: string;
}

function App() {
  // Estados del timer
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [completedSessions, setCompletedSessions] = useState(0);
  
  // Estados de tareas
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTrackingTask, setCurrentTrackingTask] = useState<Task | null>(null);
  
  // Estados de la mascota
  const [petMood, setPetMood] = useState<'happy' | 'working' | 'sleeping' | 'excited'>('happy');
  const [petMessage, setPetMessage] = useState('¡Hola! Estoy listo para ayudarte 🍅');

  // Timer principal
  useEffect(() => {
    let interval: any = null;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      handleTimerEnd();
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  // Tracking de tiempo para tarea actual
  useEffect(() => {
    let interval: any = null;
    
    if (currentTrackingTask && mode === 'work' && isRunning) {
      setPetMood('working');
      setPetMessage('¡Sigue así! Trabajando duro 💪');
      
      interval = setInterval(() => {
        setTasks(prev => prev.map(task => 
          task.id === currentTrackingTask.id 
            ? { ...task, timeSpent: task.timeSpent + 1 }
            : task
        ));
        
        setCurrentTrackingTask(prev => 
          prev ? { ...prev, timeSpent: prev.timeSpent + 1 } : null
        );
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentTrackingTask, mode, isRunning]);

  // Efecto para cambios de estado de la mascota
  useEffect(() => {
    if (!isRunning && mode === 'work') {
      setPetMood('happy');
      setPetMessage('¡Hola! ¿Listo para empezar? 🍅');
    } else if (mode === 'break') {
      setPetMood('excited');
      setPetMessage('¡Buen trabajo! Tómate un descanso ☕');
    }
  }, [mode, isRunning]);

  const handleTimerEnd = () => {
    if (mode === 'work') {
      setCompletedSessions(prev => prev + 1);
      setMode('break');
      setTimeLeft(5 * 60);
      setPetMood('excited');
      setPetMessage('¡Sesión completada! ¡Descansa un poco! 🎉');
    } else {
      setMode('work');
      setTimeLeft(25 * 60);
      setPetMood('happy');
      setPetMessage('¡Volvamos al trabajo! 💼');
    }
    setIsRunning(false);
  };

  const handleStartStop = () => {
    setIsRunning(!isRunning);
    if (!isRunning && mode === 'work') {
      setPetMood('working');
      setPetMessage('¡A trabajar! ¡Tú puedes! 🔥');
    } else if (isRunning) {
      setPetMood('sleeping');
      setPetMessage('¡Pausa! Descansemos un momento 😴');
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
    setPetMood('happy');
    setPetMessage('¡Reiniciado! ¿Empezamos de nuevo? 🔄');
  };

  const handleAddTask = (taskText: string) => {
    if (taskText.trim()) {
      const newTask: Task = {
        id: Date.now(),
        text: taskText,
        completed: false,
        createdAt: new Date().toLocaleTimeString(),
        timeSpent: 0,
        isTracking: false
      };
      setTasks(prev => [...prev, newTask]);
      setPetMood('excited');
      setPetMessage('¡Nueva tarea agregada! 📝');
      
      // Reset message after 3 seconds
      setTimeout(() => {
        setPetMessage('¡Sigue agregando tareas! 🎯');
      }, 3000);
    }
  };

  const handleToggleTask = (taskId: number) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId && !task.completed) {
        setPetMood('excited');
        setPetMessage('¡Tarea completada! ¡Genial! ✅');
        
        // Reset message after 3 seconds
        setTimeout(() => {
          setPetMessage('¡Sigue así! 💪');
        }, 3000);
      }
      return task.id === taskId ? { ...task, completed: !task.completed } : task;
    }));
  };

  const handleDeleteTask = (taskId: number) => {
    if (currentTrackingTask?.id === taskId) {
      setCurrentTrackingTask(null);
    }
    setTasks(prev => prev.filter(task => task.id !== taskId));
    setPetMood('happy');
    setPetMessage('¡Tarea eliminada! 🗑️');
    
    // Reset message after 2 seconds
    setTimeout(() => {
      setPetMessage('¿Qué más necesitas hacer? 🤔');
    }, 2000);
  };

  const handleToggleTaskTracking = (taskId: number) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const newTrackingState = !task.isTracking;
        
        if (newTrackingState) {
          setCurrentTrackingTask(task);
          setPetMood('working');
          setPetMessage(`¡Trabajando en: "${task.text}"! 🎯`);
          return { ...task, isTracking: true };
        } else {
          if (currentTrackingTask?.id === taskId) {
            setCurrentTrackingTask(null);
          }
          setPetMood('happy');
          setPetMessage('¡Tracking detenido! ⏸️');
          return { ...task, isTracking: false };
        }
      } else {
        return { ...task, isTracking: false };
      }
    }));
  };

  const handlePetInteraction = () => {
    const messages = [
      '¡Soy tu compañero Pomodoro! 🍅',
      '¡El tiempo vuela cuando trabajas concentrado! ⏰',
      '¡Recuerda tomar agua! 💧',
      '¡Cada pomodoro cuenta! 🎯',
      '¡Tú puedes con todo! 💪',
      '¡Descansa tus ojos cada 20 minutos! 👀'
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setPetMood('excited');
    setPetMessage(randomMessage);
    
    // Reset mood after 2 seconds
    setTimeout(() => {
      if (isRunning && mode === 'work') {
        setPetMood('working');
      } else {
        setPetMood('happy');
      }
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTaskTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const totalTimeSpent = tasks.reduce((total, task) => total + task.timeSpent, 0);
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;

  return (
    <div className={`app ${mode === 'work' ? 'appWork' : 'appBreak'}`}>
      <div className="container">
        {/* Header */}
        <div className="main-header">
          <h1 className="app-title">🍅 Pomodoro 🍅</h1>
        </div>

        {/* Timer y Tareas juntos */}
        <div className="main-content">
          {/* Sección Timer */}
          <div className="timer-section">
            <div className={`timer-display ${mode === 'work' ? 'timer-work' : 'timer-break'}`}>
              {/* Tarea actual en tracking */}
              {currentTrackingTask && (
                <div className="current-task-info">
                  <div className="task-tracking-header">
                    <span className="tracking-badge">
                      {mode === 'work' ? '🎯 TRABAJANDO EN' : '☕ DESCANSO CON'}
                    </span>
                    <span className="task-name">{currentTrackingTask.text}</span>
                  </div>
                  <div className="task-time-spent">
                    ⏱️ Tiempo: <strong>{formatTaskTime(currentTrackingTask.timeSpent)}</strong>
                  </div>
                </div>
              )}

              <h2 className="timer-title">
                {mode === 'work' ? '🎯 Tiempo de Trabajo' : '☕ Descanso'}
              </h2>
              
              <div className="time">
                {formatTime(timeLeft)}
              </div>
              
              <div className="progress-bar">
                <div 
                  className={`progress-fill ${mode === 'work' ? 'progress-work' : 'progress-break'}`}
                  style={{ width: `${((mode === 'work' ? 25 * 60 : 5 * 60) - timeLeft) / (mode === 'work' ? 25 * 60 : 5 * 60) * 100}%` }}
                ></div>
              </div>

              <div className="session-info">
                <div className="sessions-counter">
                  Sesiones completadas: <strong>{completedSessions}</strong>
                </div>
              </div>

              <div className="timer-controls">
                <button 
                  onClick={handleStartStop}
                  className={`control-btn ${isRunning ? 'pause-btn' : 'start-btn'}`}
                >
                  {isRunning ? '⏸️ Pausar' : '▶️ Iniciar'}
                </button>
                <button 
                  onClick={handleReset}
                  className="control-btn reset-btn"
                >
                  🔄 Reiniciar
                </button>
              </div>
            </div>
          </div>

          {/* Sección Tareas */}
          <div className="tasks-section">
            <h3 className="task-title">📝 Lista de Tareas</h3>
            
            {/* Estadísticas */}
            <div className="time-stats">
              <div className="time-stat-item">
                <span className="time-label">⏱️ Tiempo total:</span>
                <span className="time-value">{formatTaskTime(totalTimeSpent)}</span>
              </div>
              <div className="time-stat-item">
                <span className="time-label">✅ Completadas:</span>
                <span className="time-value">{completedTasks}/{totalTasks}</span>
              </div>
            </div>

            {/* Formulario de tareas */}
            <form onSubmit={(e) => {
              e.preventDefault();
              const input = (e.target as any).elements.taskInput;
              handleAddTask(input.value);
              input.value = '';
            }} className="task-form">
              <input
                type="text"
                name="taskInput"
                placeholder="¿Qué necesitas hacer?..."
                className="task-input"
              />
              <button type="submit" className="add-btn">
                ➕ Agregar
              </button>
            </form>

            {/* Lista de tareas */}
            <div className="tasks">
              {tasks.length === 0 ? (
                <p className="no-tasks">🎉 ¡No hay tareas! Agrega una para comenzar.</p>
              ) : (
                tasks.map((task) => (
                  <div 
                    key={task.id} 
                    className={`task-item ${task.completed ? 'task-item-completed' : ''} ${task.isTracking ? 'task-tracking-active' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleTask(task.id)}
                      className="task-checkbox"
                    />
                    
                    <div className="task-content">
                      <span className="task-text">{task.text}</span>
                      <div className="task-meta">
                        <small className="task-time-created">Creada: {task.createdAt}</small>
                        {task.timeSpent > 0 && (
                          <small className="task-time-spent">
                            ⏱️ {formatTaskTime(task.timeSpent)}
                          </small>
                        )}
                      </div>
                    </div>

                    <div className="task-actions">
                      <button 
                        onClick={() => handleToggleTaskTracking(task.id)} 
                        className={`track-btn ${task.isTracking ? 'tracking-active' : ''}`}
                        disabled={task.completed}
                      >
                        {task.isTracking ? '⏸️' : '⏱️'}
                      </button>
                      <button 
                        onClick={() => handleDeleteTask(task.id)} 
                        className="delete-btn"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Mascota Pomodoro */}
        <div className="pet-section">
          <div className="pet-container">
            <div className="pet" onClick={handlePetInteraction}>
              <div className={`pet-face ${petMood}`}>
                <div className="pet-eyes">
                  <div className="pet-eye"></div>
                  <div className="pet-eye"></div>
                </div>
                <div className="pet-mouth"></div>
              </div>
              <div className="pet-body">
                <div className="pet-tomato">🍅</div>
              </div>
            </div>
            <div className="pet-message">
              {petMessage}
            </div>
            <div className="pet-stats">
              <div className="pet-stat">
                <span>🎯 Sesiones: {completedSessions}</span>
              </div>
              <div className="pet-stat">
                <span>✅ Tareas: {completedTasks}/{totalTasks}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;