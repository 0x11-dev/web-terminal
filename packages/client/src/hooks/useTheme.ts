import { useEffect, useState } from 'react';

export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    return document.body.classList.contains('dark');
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.body.classList.contains('dark'));
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    document.body.classList.toggle('dark');
    setIsDark(!isDark);
  };

  return { isDark, toggleTheme };
}
