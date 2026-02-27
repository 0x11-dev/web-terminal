import { useTerminalStore } from '../../store/terminalStore';
import { Tab } from './Tab';

export function TabBar() {
  const { sessions, activeSessionId, setActiveSession } = useTerminalStore();

  return (
    <div className="flex items-center">
      {sessions.map((session) => (
        <Tab
          key={session.id}
          session={session}
          isActive={session.id === activeSessionId}
          onSelect={() => setActiveSession(session.id)}
        />
      ))}
    </div>
  );
}
