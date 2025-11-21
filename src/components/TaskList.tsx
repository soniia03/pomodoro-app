import { useState, useMemo } from 'react';
import './History.css';

interface Session {
  id: number;
  taskName: string;
  duration: number;
  completedAt: string;
  date: string;
  status: 'completed' | 'interrupted' | 'cancelled';
  pomodoros: number;
}

interface HistoryProps {
  sessions: Session[];
  onClearHistory: () => void;
  onDeleteSession: (sessionId: number) => void;
}

function History({ 
  sessions, 
  onClearHistory,
  onDeleteSession 
}: HistoryProps) {
  const [filter, setFilter] = useState<'all' | 'completed' | 'interrupted' | 'cancelled'>('all');
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  // Filtrar sesiones
  const filteredSessions = useMemo(() => {
    if (filter === 'all') return sessions;
    return sessions.filter(session => session.status === filter);
  }, [sessions, filter]);

  // Estadísticas
  const stats = useMemo(() => {
    const totalSessions = sessions.length;
    const completedSessions = sessions.filter(s => s.status === 'completed').length;
    const totalPomodoros = sessions.reduce((sum, session) => sum + session.pomodoros, 0);

    return {
      totalSessions,
      completedSessions,
      totalPomodoros,
      completionRate: totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0
    };
  }, [sessions]);

  const getStatusIcon = (status: Session['status']): string => {
    switch (status) {
      case 'completed': return '✅';
      case 'interrupted': return '⏸️';
      case 'cancelled': return '❌';
      default: return '❓';
    }
  };

  const getStatusText = (status: Session['status']): string => {
    switch (status) {
      case 'completed': return 'Completada';
      case 'interrupted': return 'Interrumpida';
      case 'cancelled': return 'Cancelada';
      default: return 'Desconocida';
    }
  };

  const handleSessionClick = (session: Session) => {
    setSelectedSession(session);
  };

  const closeModal = () => {
    setSelectedSession(null);
  };

  return (
    <div className="history">
      <div className="history-header">
        <h3>📊 Historial de Sesiones</h3>
        <div className="history-actions">
          <button 
            onClick={onClearHistory}
            className="clear-btn"
            disabled={sessions.length === 0}
          >
            🗑️ Limpiar
          </button>
        </div>
      </div>

      {/* Panel de Estadísticas */}
      <div className="stats-panel">
        <div className="stat-card">
          <div className="stat-value">{stats.totalSessions}</div>
          <div className="stat-label">Total Sesiones</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.completedSessions}</div>
          <div className="stat-label">Completadas</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalPomodoros}</div>
          <div className="stat-label">Pomodoros</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{Math.round(stats.completionRate)}%</div>
          <div className="stat-label">Tasa de Éxito</div>
        </div>
      </div>

      {/* Filtro simple */}
      <div className="filter-controls">
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value as any)}
          className="filter-select"
        >
          <option value="all">Todas las sesiones</option>
          <option value="completed">Completadas</option>
          <option value="interrupted">Interrumpidas</option>
          <option value="cancelled">Canceladas</option>
        </select>
      </div>

      {/* Lista de Sesiones */}
      <div className="sessions-list">
        {filteredSessions.length === 0 ? (
          <div className="no-sessions">
            <p>📝 Comienza tu primera sesión Pomodoro</p>
            <small>Tu historial se llenará aquí automáticamente</small>
          </div>
        ) : (
          filteredSessions.map(session => (
            <div 
              key={session.id} 
              className={`session-item ${session.status}`}
              onClick={() => handleSessionClick(session)}
            >
              <div className="session-header">
                <div className="session-task">{session.taskName}</div>
                <div className="session-status">
                  <span className="status-icon">{getStatusIcon(session.status)}</span>
                  <span className="status-text">{getStatusText(session.status)}</span>
                </div>
              </div>
              
              <div className="session-details">
                <div className="session-info">
                  <span className="info-item">
                    <strong>Duración:</strong> {session.duration}min
                  </span>
                  <span className="info-item">
                    <strong>Pomodoros:</strong> {session.pomodoros}
                  </span>
                </div>
                <div className="session-time">
                  {session.completedAt}
                </div>
              </div>

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSession(session.id);
                }}
                className="delete-session-btn"
                title="Eliminar sesión"
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>

      {/* Modal de Detalles */}
      {selectedSession && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4>Detalles de la Sesión</h4>
              <button onClick={closeModal} className="close-modal">✕</button>
            </div>
            
            <div className="modal-body">
              <div className="detail-row">
                <strong>Tarea:</strong>
                <span>{selectedSession.taskName}</span>
              </div>
              <div className="detail-row">
                <strong>Estado:</strong>
                <span className={`status-badge ${selectedSession.status}`}>
                  {getStatusIcon(selectedSession.status)} {getStatusText(selectedSession.status)}
                </span>
              </div>
              <div className="detail-row">
                <strong>Duración:</strong>
                <span>{selectedSession.duration} minutos</span>
              </div>
              <div className="detail-row">
                <strong>Pomodoros completados:</strong>
                <span>{selectedSession.pomodoros}</span>
              </div>
              <div className="detail-row">
                <strong>Fecha y hora:</strong>
                <span>{selectedSession.completedAt}</span>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                onClick={() => {
                  onDeleteSession(selectedSession.id);
                  closeModal();
                }}
                className="delete-btn"
              >
                🗑️ Eliminar Sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default History;