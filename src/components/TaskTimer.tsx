import { useState, useEffect } from 'react';
import './TaskTimer.css';

interface Task {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
  timeSpent: number;
  isTracking?: boolean;
  completedAt?: string;
}

interface TaskTimerProps {
  timeLeft: number;
  mode: 'work' | 'break';
  completedSessions: number;
  isRunning: boolean;
  tasks: Task[];
  onAddTask: (taskText: string) => void;
  onToggleTask: (taskId: number) => void;
  onDeleteTask: (taskId: number) => void;
  onToggleTaskTracking: (taskId: number) => void;
  onStartStop: () => void;
  onReset: () => void;
  currentTask?: Task | null;
  onTimeUpdate?: (taskId: number, timeSpent: number) => void;
  totalTimeSpent: number;
  completedTasksWithTime: number;
  onTaskCompleteToHistory?: (task: Task) => void;
}

function TaskTimer({
  timeLeft,
  mode,
  completedSessions,
  isRunning,
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onToggleTaskTracking,
  onStartStop,
  onReset,
  currentTask,
  onTimeUpdate,
  totalTimeSpent,
  completedTasksWithTime,
  onTaskCompleteToHistory
}: TaskTimerProps) {
  const [isTimeLow, setIsTimeLow] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  useEffect(() => {
    let interval: number;
    
    if (currentTask && mode === 'work' && isRunning) {
      interval = window.setInterval(() => {
        setElapsedTime(prev => {
          const newTime = prev + 1;
          if (onTimeUpdate && currentTask) {
            onTimeUpdate(currentTask.id, currentTask.timeSpent + newTime);
          }
          return newTime;
        });
      }, 1000);
    } else {
      setElapsedTime(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentTask, mode, isRunning, onTimeUpdate]);

  useEffect(() => {
    if (timeLeft <= 60 && timeLeft > 0) {
      setIsTimeLow(true);
    } else {
      setIsTimeLow(false);
    }

    if (timeLeft <= 30 && timeLeft > 0) {
      const pulseInterval = setInterval(() => {
        setPulse(prev => !prev);
      }, 1000);
      
      return () => clearInterval(pulseInterval);
    } else {
      setPulse(false);
    }
  }, [timeLeft]);

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

  const formatTotalTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return `${seconds}s`;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      onAddTask(newTask);
      setNewTask('');
    }
  };

  const handleToggleTaskWithHistory = (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const newCompletedState = !task.completed;
      
      if (newCompletedState && task.timeSpent > 0 && onTaskCompleteToHistory) {
        onTaskCompleteToHistory(task);
      }
      
      onToggleTask(taskId);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDrop = (index: number) => {
    if (dragIndex === null || dragIndex === index) return;
    setDragIndex(null);
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;

  const modeText = mode === 'work' ? '🎯 Tiempo de Trabajo' : '☕ Descanso';
  const totalTime = mode === 'work' ? 25 * 60 : 5 * 60;
  const progress = (totalTime - timeLeft) / totalTime * 100;

  const timeClass = `time ${isTimeLow ? 'time-low' : ''} ${pulse ? 'time-pulse' : ''}`;
  const timerDisplayClass = `timer-display ${mode === 'work' ? 'timer-work' : 'timer-break'} ${isTimeLow ? 'timer-alert' : ''}`;
  const totalTaskTime = currentTask ? currentTask.timeSpent + elapsedTime : 0;

  return (
    <div className="task-timer-container">
      {/* Sección del Timer */}
      <div className="timer-section">
        <div className={timerDisplayClass}>
          {/* Información de la tarea en tracking */}
          {currentTask && (
            <div className="current-task-info">
              <div className="task-tracking-header">
                <span className="tracking-badge">
                  {mode === 'work' ? '🎯 TRABAJANDO EN' : '☕ DESCANSO CON'}
                </span>
                <span className="task-name">{currentTask.text}</span>
              </div>
              <div className="task-time-spent">
                ⏱️ Tiempo invertido: <strong>{formatTaskTime(totalTaskTime)}</strong>
              </div>
            </div>
          )}

          <h2 className="timer-title">{modeText}</h2>
          
          <div className={timeClass}>
            {formatTime(timeLeft)}
            {isTimeLow && <span className="warning-icon"> ⚠️</span>}
          </div>
          
          <div className="progress-bar">
            <div 
              className={`progress-fill ${mode === 'work' ? 'progress-work' : 'progress-break'}`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="session-info">
            <div className="sessions-counter">
              Sesiones completadas: <strong>{completedSessions}</strong>
            </div>
            
            {isTimeLow && (
              <div className="time-warning">
                {timeLeft <= 30 ? '¡Poco tiempo! ⏰' : 'Último minuto 🎯'}
              </div>
            )}
          </div>

          <div className="timer-controls">
            <button 
              onClick={onStartStop}
              className={`control-btn ${isRunning ? 'pause-btn' : 'start-btn'}`}
            >
              {isRunning ? '⏸️ Pausar' : '▶️ Iniciar'}
            </button>
            <button 
              onClick={onReset}
              className="control-btn reset-btn"
            >
              🔄 Reiniciar
            </button>
          </div>
        </div>
      </div>

      {/* Sección de Tareas */}
      <div className="tasks-section">
        <h3 className="task-title">📝 Lista de Tareas</h3>
        
        {/* Estadísticas de tiempo */}
        <div className="time-stats">
          <div className="time-stat-item">
            <span className="time-label">⏱️ Tiempo total invertido:</span>
            <span className="time-value">{formatTotalTime(totalTimeSpent)}</span>
          </div>
          <div className="time-stat-item">
            <span className="time-label">✅ Tareas con tiempo registrado:</span>
            <span className="time-value">{completedTasksWithTime}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="task-form">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="¿Qué necesitas hacer?..."
            className="task-input"
          />
          <button type="submit" className="add-btn">
            ➕ Agregar
          </button>
        </form>

        <div className="task-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'filter-btn-active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Todas ({totalTasks})
          </button>
          <button 
            className={`filter-btn ${filter === 'active' ? 'filter-btn-active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Pendientes ({totalTasks - completedTasks})
          </button>
          <button 
            className={`filter-btn ${filter === 'completed' ? 'filter-btn-active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completadas ({completedTasks})
          </button>
        </div>

        <div className="progress">
          {totalTasks > 0 ? (
            <div className="progress-info">
              <span>
                {completedTasks} de {totalTasks} tareas completadas
              </span>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
                ></div>
              </div>
              <span className="progress-percent">
                {Math.round((completedTasks / totalTasks) * 100)}%
              </span>
            </div>
          ) : (
            <p className="no-progress">¡Agrega tu primera tarea!</p>
          )}
        </div>

        <div className="tasks">
          {filteredTasks.length === 0 ? (
            <p className="no-tasks">
              {filter === 'all' 
                ? '🎉 ¡No hay tareas! Agrega una para comenzar.' 
                : filter === 'active' 
                  ? '✅ ¡No hay tareas pendientes!' 
                  : '📝 No hay tareas completadas'
              }
            </p>
          ) : (
            filteredTasks.map((task, index) => (
              <div 
                key={task.id} 
                className={`task-item ${task.completed ? 'task-item-completed' : ''} ${task.isTracking ? 'task-tracking-active' : ''} ${dragIndex === index ? 'dragging' : ''}`}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={() => handleDrop(index)}
              >
                <span className="drag-handle">⠿</span>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleTaskWithHistory(task.id)}
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
                    {task.completed && task.completedAt && (
                      <small className="task-completed-at">
                        ✅ Completada: {task.completedAt}
                      </small>
                    )}
                  </div>
                </div>

                <div className="task-actions">
                  <button 
                    onClick={() => onToggleTaskTracking(task.id)} 
                    className={`track-btn ${task.isTracking ? 'tracking-active' : ''}`}
                    title={task.isTracking ? 'Detener tracking' : 'Iniciar tracking'}
                    disabled={task.completed}
                  >
                    {task.isTracking ? '⏸️' : '⏱️'}
                  </button>
                  <button 
                    onClick={() => onDeleteTask(task.id)} 
                    className="delete-btn"
                    title="Eliminar tarea"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* {filteredTasks.length > 0 && (
          <div className="drag-instructions">
            <small>💡 Arrastra las tareas para reordenarlas</small>
          </div>
        )} */}
      </div>
    </div>
  );
}

export default TaskTimer;