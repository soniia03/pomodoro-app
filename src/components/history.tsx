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
  // ✅ ESTADO PARA ORDENAR (Avanzado)
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  // ✅ REORDENAR LISTA (Avanzado)
  const sortedSessions = [...sessions].sort((a, b) => {
    return sortBy === 'newest' ? b.id - a.id : a.id - b.id;
  });

  return (
    <div className="history">
      <h3>📊 Historial de Sesiones</h3>
      
      {/* ✅ INPUT CONTROLADO PARA BÚSQUEDA */}
      <div className="history-controls">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar en historial..."
          className="search-input"
        />
        
        {/* ✅ SELECT CONTROLADO (Básico) */}
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
          className="sort-select"
        >
          <option value="newest">Más recientes primero</option>
          <option value="oldest">Más antiguos primero</option>
        </select>
      </div>

      {/* ✅ CONTADOR DE ELEMENTOS */}
      <div className="history-stats">
        <span>
          Mostrando {sortedSessions.length} de {totalSessions} sesiones
        </span>
      </div>

      {/* ✅ LISTA DINÁMICA CON RENDERIZADO CONDICIONAL */}
      <div className="sessions-list">
        {sortedSessions.length === 0 ? (
          <p className="no-sessions">
            {totalSessions === 0 
              ? 'Aún no hay sesiones completadas' 
              : 'No se encontraron sesiones que coincidan con la búsqueda'
            }
          </p>
        ) : (
          sortedSessions.map(session => (
            <div key={session.id} className={`session-item ${session.mode}`}>
              <div className="session-mode">
                {session.mode === 'work' ? '🎯 Trabajo' : '☕ Descanso'}
              </div>
              <div className="session-duration">
                {session.duration} min
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