import { useState } from 'react';

function History({ 
  sessions, 
  searchTerm, 
  onSearchChange,
  totalSessions 
}: { 
  sessions: {id: number, mode: string, duration: number, completedAt: string}[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  totalSessions: number;
}) {
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  const sortedSessions = [...sessions].sort((a, b) => {
    return sortBy === 'newest' ? b.id - a.id : a.id - b.id;
  });

  return (
    <div className="history">
      <h3>📊 Historial de Sesiones</h3>
      
      {/* Controles de búsqueda y ordenamiento */}
      <div className="history-controls">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="🔍 Buscar por tipo o fecha..."
          className="search-input"
        />
        
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
          className="sort-select"
        >
          <option value="newest">Más recientes primero</option>
          <option value="oldest">Más antiguos primero</option>
        </select>
      </div>

      {/* Estadísticas */}
      <div className="history-stats">
        <span>
          {sortedSessions.length} de {totalSessions} sesiones
        </span>
      </div>

      {/* Lista de sesiones */}
      <div className="sessions-list">
        {sortedSessions.length === 0 ? (
          <div className="no-sessions">
            <p>
              {totalSessions === 0 
                ? '🎯 Comienza tu primera sesión Pomodoro' 
                : 'No hay sesiones que coincidan con tu búsqueda'
              }
            </p>
            {totalSessions === 0 && (
              <small>Tu historial se llenará aquí automáticamente</small>
            )}
          </div>
        ) : (
          sortedSessions.map(session => (
            <div key={session.id} className={`session-item ${session.mode}`}>
              <div className="session-mode">
                {session.mode === 'work' ? '💼 Sesión de trabajo' : '☕ Descanso'}
              </div>
              <div className="session-duration">
                {session.duration} minutos
              </div>
              <div className="session-time">
                {session.completedAt}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default History;