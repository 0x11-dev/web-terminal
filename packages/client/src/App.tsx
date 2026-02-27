import { useEffect } from 'react';
import { useTerminalStore } from './store/terminalStore';
import { MainLayout } from './components/layout/MainLayout';
import { KeybindingsManager } from './keybindings';

function App() {
  const { initialize, cleanup } = useTerminalStore();

  useEffect(() => {
    initialize();

    // Initialize keybindings
    const keybindings = new KeybindingsManager();

    return () => {
      cleanup();
      keybindings.destroy();
    };
  }, [initialize, cleanup]);

  return <MainLayout />;
}

export default App;
