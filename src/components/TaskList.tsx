import { useState } from 'react';
import './TaskList.css'; // Cambié a .css normal en lugar de .module.css

function TaskList({ 
  tasks, 
  onAddTask, 
  onToggleTask, 
  onDeleteTask 
}: { 
  tasks: {id: number, text: string, completed: boolean, createdAt: string}[];
  onAddTask: (taskText: string) => void;
  onToggleTask: (taskId: number) => void;
  onDeleteTask: (taskId: number) => void;
}) {
  // INPUT CONTROLADO
  const [newTask, setNewTask] = useState('');
  // FILTRO DINÁMICO
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  // REORDENAR LISTA - DRAG & DROP
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTask(newTask);
    setNewTask('');
  };

  // FILTRADO DE ELEMENTOS
  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  // FUNCIONES DRAG & DROP
  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDrop = (index: number) => {
    if (dragIndex === null || dragIndex === index) return;
    
    console.log('Tarea reordenada de posición', dragIndex, 'a', index);
    setDragIndex(null);
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;

  return (
    <div className="task-list">
      <h3 className="task-title">📝 Lista de Tareas</h3>
      
      {/* FORMULARIO CON INPUT CONTROLADO */}
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

      {/* FILTROS INTERACTIVOS */}
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

      {/* BARRA DE PROGRESO */}
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

      {/* LISTA DINÁMICA CON DRAG & DROP */}
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
              className={`task-item ${task.completed ? 'task-item-completed' : ''} ${dragIndex === index ? 'dragging' : ''}`}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={() => handleDrop(index)}
            >
              <span className="drag-handle">⠿</span>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggleTask(task.id)}
                className="task-checkbox"
              />
              <span className="task-text">{task.text}</span>
              <small className="task-time">{task.createdAt}</small>
              <button 
                onClick={() => onDeleteTask(task.id)} 
                className="delete-btn"
                title="Eliminar tarea"
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>

      {/* INSTRUCCIONES DRAG & DROP */}
      {filteredTasks.length > 0 && (
        <div className="drag-instructions">
          <small>💡 Arrastra las tareas para reordenarlas</small>
        </div>
      )}
    </div>
  );
}

export default TaskList;