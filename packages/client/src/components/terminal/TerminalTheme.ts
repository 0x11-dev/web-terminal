import { ITheme } from '@xterm/xterm';

// Tokyo Night theme (dark) - 精致的深色主题
const darkTheme: ITheme = {
  background: '#1a1b26',
  foreground: '#a9b1d6',
  cursor: '#c0caf5',
  cursorAccent: '#1a1b26',
  selectionBackground: 'rgba(65, 75, 106, 0.5)',
  selectionForeground: '#a9b1d6',
  black: '#15161e',
  red: '#f7768e',
  green: '#9ece6a',
  yellow: '#e0af68',
  blue: '#7aa2f7',
  magenta: '#bb9af7',
  cyan: '#7dcfff',
  white: '#a9b1d6',
  brightBlack: '#414868',
  brightRed: '#f7768e',
  brightGreen: '#9ece6a',
  brightYellow: '#e0af68',
  brightBlue: '#7aa2f7',
  brightMagenta: '#bb9af7',
  brightCyan: '#7dcfff',
  brightWhite: '#c0caf5',
  // 扩展 ANSI 颜色
  extendedAnsi: [
    '#15161e', '#f7768e', '#9ece6a', '#e0af68',
    '#7aa2f7', '#bb9af7', '#7dcfff', '#a9b1d6',
    '#414868', '#f7768e', '#9ece6a', '#e0af68',
    '#7aa2f7', '#bb9af7', '#7dcfff', '#c0caf5',
  ],
};

// Tokyo Night Light theme (light) - 精致的浅色主题
const lightTheme: ITheme = {
  background: '#d5d6db',
  foreground: '#343b58',
  cursor: '#34548a',
  cursorAccent: '#d5d6db',
  selectionBackground: 'rgba(52, 84, 138, 0.3)',
  selectionForeground: '#343b58',
  black: '#0f0f14',
  red: '#8c4351',
  green: '#33635c',
  yellow: '#8f5e15',
  blue: '#34548a',
  magenta: '#5a4a78',
  cyan: '#0f4b6e',
  white: '#343b58',
  brightBlack: '#96999e',
  brightRed: '#8c4351',
  brightGreen: '#33635c',
  brightYellow: '#8f5e15',
  brightBlue: '#34548a',
  brightMagenta: '#5a4a78',
  brightCyan: '#0f4b6e',
  brightWhite: '#565a6e',
  extendedAnsi: [
    '#0f0f14', '#8c4351', '#33635c', '#8f5e15',
    '#34548a', '#5a4a78', '#0f4b6e', '#343b58',
    '#96999e', '#8c4351', '#33635c', '#8f5e15',
    '#34548a', '#5a4a78', '#0f4b6e', '#565a6e',
  ],
};

export function getTerminalTheme(): ITheme {
  const isDark = document.body.classList.contains('dark');
  return isDark ? darkTheme : lightTheme;
}

export { darkTheme, lightTheme };
