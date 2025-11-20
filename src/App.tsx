import { useState, useEffect } from 'react';
import './App.css';
import Timer from './components/tiempo';
import Controls from './components/controles';
import Settings from './components/settings';
import TaskList from './components/TaskList';
import History from './components/history';

// Definimos las interfaces aquí
interface Task {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
}

interface Session {
  id: number;
  mode: string;
  duration: number;
  completedAt: string;
}

function App() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [workTime, setWorkTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [sessionHistory, setSessionHistory] = useState<Session[]>([]);
  const [searchHistory, setSearchHistory] = useState('');

  useEffect(() => {
    // Usamos 'any' para evitar el problema de NodeJS.Timeout
    let interval: any = null;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      handleTimerEnd();
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  const handleTimerEnd = () => {
    const newSession: Session = {
      id: Date.now(),
      mode: mode,
      duration: mode === 'work' ? workTime : breakTime,
      completedAt: new Date().toLocaleString()
    };
    setSessionHistory(prev => [newSession, ...prev]);
    
    if (mode === 'work') {
      setCompletedSessions(prev => prev + 1);
      setMode('break');
      setTimeLeft(breakTime * 60);
    } else {
      setMode('work');
      setTimeLeft(workTime * 60);
    }
    setIsRunning(false);
  };

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'work' ? workTime * 60 : breakTime * 60);
  };

  const handleAddTask = (taskText: string) => {
    if (taskText.trim()) {
      const newTask: Task = {
        id: Date.now(),
        text: taskText,
        completed: false,
        createdAt: new Date().toLocaleTimeString()
      };
      setTasks(prev => [...prev, newTask]);
    }
  };

  const handleToggleTask = (taskId: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleSaveSettings = (newWorkTime: number, newBreakTime: number) => {
    setWorkTime(newWorkTime);
    setBreakTime(newBreakTime);
    setTimeLeft(newWorkTime * 60);
    setShowSettings(false);
  };

  const filteredHistory = sessionHistory.filter(session =>
    session.mode.toLowerCase().includes(searchHistory.toLowerCase()) ||
    session.completedAt.toLowerCase().includes(searchHistory.toLowerCase())
  );

  return (
    <div className={`app ${mode === 'work' ? 'appWork' : 'appBreak'}`}>
      <div className="container">
        <h1 className="header">🍅 Pomodoro Timer</h1>
        
        <Timer 
          timeLeft={timeLeft} 
          mode={mode}
          completedSessions={completedSessions}
        />
        
        <Controls 
          isRunning={isRunning}
          onStartStop={handleStartStop}
          onReset={handleReset}
          onShowSettings={() => setShowSettings(!showSettings)}
        />
        
        <TaskList 
          tasks={tasks}
          onAddTask={handleAddTask}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
        />
        
        <History 
          sessions={filteredHistory}
          searchTerm={searchHistory}
          onSearchChange={setSearchHistory}
          totalSessions={sessionHistory.length}
        />
        
        {showSettings && (
          <Settings 
            workTime={workTime}
            breakTime={breakTime}
            onSave={handleSaveSettings}
            onClose={() => setShowSettings(false)}
          />
        )}
      </div>
    </div>
  );
}

export default App;