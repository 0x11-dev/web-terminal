import { ChevronDown, Terminal } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useTerminalStore } from '../../store/terminalStore';
import { ShellProfile } from '@web-terminal/shared';

export function ProfileSelector() {
  const { profiles, defaultProfile, setDefaultProfile } = useTerminalStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectProfile = (profile: ShellProfile) => {
    setDefaultProfile(profile);
    setIsOpen(false);
  };

  if (!defaultProfile) {
    return (
      <div className="flex items-center gap-1 text-[var(--muted-foreground)] text-sm">
        <Terminal size={14} />
        <span>No shells</span>
      </div>
    );
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 py-1 text-sm rounded hover:bg-[var(--accent)] transition-colors"
        title="Select Shell Profile"
      >
        <Terminal size={14} />
        <span className="text-[var(--foreground)]">{defaultProfile.name}</span>
        <ChevronDown size={14} className="text-[var(--muted-foreground)]" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 min-w-[150px] bg-[var(--background)] border border-[var(--border)] rounded-md shadow-lg z-50">
          {profiles.map((profile) => (
            <button
              key={profile.name}
              onClick={() => handleSelectProfile(profile)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-[var(--accent)] transition-colors ${
                profile.name === defaultProfile.name
                  ? 'text-[var(--primary)]'
                  : 'text-[var(--foreground)]'
              }`}
            >
              <Terminal size={14} />
              <span>{profile.name}</span>
              {profile.name === defaultProfile.name && (
                <span className="ml-auto text-xs text-[var(--muted-foreground)]">default</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
