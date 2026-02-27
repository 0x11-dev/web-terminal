import { X, Terminal } from 'lucide-react';
import { TerminalSession } from '../../store/terminalStore';
import { useTerminalStore } from '../../store/terminalStore';

interface TabProps {
  session: TerminalSession;
  isActive: boolean;
  onSelect: () => void;
}

export function Tab({ session, isActive, onSelect }: TabProps) {
  const { destroySession } = useTerminalStore();

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    destroySession(session.id);
  };

  return (
    <div
      onClick={onSelect}
      className={`flex items-center gap-2 px-3 py-2 cursor-pointer border-r border-[var(--tab-border)] min-w-[120px] max-w-[200px] ${
        isActive
          ? 'bg-[var(--tab-active-bg)] text-[var(--foreground)]'
          : 'bg-[var(--tab-inactive-bg)] text-[var(--muted-foreground)] hover:bg-[var(--accent)]'
      }`}
    >
      <Terminal size={14} />
      <span className="flex-1 truncate text-sm">{session.name}</span>
      {session.exitCode !== undefined && (
        <span className="text-xs text-[var(--destructive)]">Exit: {session.exitCode}</span>
      )}
      <button
        onClick={handleClose}
        className="p-0.5 rounded hover:bg-[var(--destructive)] hover:text-[var(--destructive-foreground)] transition-colors"
        title="Close Tab (Ctrl+Shift+W)"
      >
        <X size={14} />
      </button>
    </div>
  );
}
