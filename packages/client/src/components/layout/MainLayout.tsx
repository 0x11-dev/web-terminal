import { useTerminalStore } from '../../store/terminalStore';
import { TabBar } from '../tabs/TabBar';
import { TerminalPane } from '../terminal/TerminalPane';
import { ProfileSelector } from '../profile/ProfileSelector';
import { Plus, Wifi, WifiOff } from 'lucide-react';

export function MainLayout() {
  const { sessions, activeSessionId, isConnected, createSession, profiles, defaultProfile } =
    useTerminalStore();

  return (
    <div className="flex flex-col h-full bg-[var(--background)]">
      {/* Header / Tab Bar */}
      <header className="flex items-center bg-[var(--tab-inactive-bg)] border-b border-[var(--tab-border)]">
        {/* Tabs */}
        <div className="flex-1 flex items-center tab-scroll overflow-x-auto">
          <TabBar />
        </div>

        {/* New Tab Button */}
        <button
          onClick={() => createSession()}
          className="flex items-center justify-center w-10 h-10 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors"
          title="New Tab (Ctrl+Shift+T)"
        >
          <Plus size={18} />
        </button>

        {/* Profile Selector */}
        <div className="px-2">
          <ProfileSelector />
        </div>

        {/* Connection Status */}
        <div className="px-3 flex items-center">
          {isConnected ? (
            <Wifi size={16} className="text-green-500" />
          ) : (
            <WifiOff size={16} className="text-red-500" />
          )}
        </div>
      </header>

      {/* Terminal Area */}
      <main className="flex-1 overflow-hidden">
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-[var(--muted-foreground)]">
            <p className="text-lg mb-4">No terminal sessions</p>
            <button
              onClick={() => createSession()}
              className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md hover:opacity-90 transition-opacity"
            >
              Create New Terminal
            </button>
            <p className="mt-2 text-sm">or press Ctrl+Shift+T</p>
          </div>
        ) : (
          <div className="h-full relative">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`absolute inset-0 ${session.id === activeSessionId ? 'block' : 'hidden'}`}
              >
                <TerminalPane session={session} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
