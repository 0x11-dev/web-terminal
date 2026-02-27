# Web Terminal

<p align="center">
  <strong>A modern web-based terminal with multi-tab support</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#options">Options</a> •
  <a href="#development">Development</a> •
  <a href="#license">License</a>
</p>

---

A beautiful, fast, and feature-rich web terminal that runs in your browser. Built with modern technologies including xterm.js, node-pty, React, and TypeScript.

## Features

- 🖥️ **Multi-tab Support** - Create, close, and switch between multiple terminal tabs
- 🐚 **Shell Selection** - Choose between zsh, bash, sh, and other available shells
- ⌨️ **Keyboard Shortcuts** - Full keyboard navigation support
- 🎨 **Tokyo Night Theme** - Beautiful dark theme with syntax highlighting
- ⚡ **GPU Acceleration** - WebGL rendering for smooth performance
- 📦 **Zero Config** - Works out of the box with `npx web-terminal`

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+T` | New tab |
| `Ctrl+Shift+W` | Close tab |
| `Ctrl+Tab` | Next tab |
| `Ctrl+Shift+Tab` | Previous tab |
| `Ctrl+Shift+C` | Copy |
| `Ctrl+Shift+V` | Paste |

## Quick Start

```bash
npx web-terminal
```

This will start the server on port 3000 and automatically open your browser.

## Options

```
Usage: web-terminal [options]

Options:
  -p, --port <port>  Port to run the server on (default: 3000)
  --no-open          Don't open browser automatically
  -h, --help         Show this help message

Examples:
  web-terminal              Start on default port (3000)
  web-terminal -p 8080      Start on port 8080
  web-terminal --no-open    Don't open browser
```

## Requirements

- Node.js 18 or higher
- macOS or Linux

## Development

```bash
# Clone the repository
git clone https://github.com/your-username/web-terminal.git
cd web-terminal

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build all packages
pnpm build

# Build CLI for distribution
pnpm build:cli

# Test CLI locally
npx ./packages/cli
```

## Tech Stack

- **Frontend**: React 18, TypeScript, Zustand, Tailwind CSS, Vite
- **Terminal**: xterm.js with WebGL addon
- **Backend**: Express, node-pty, WebSocket
- **Build**: esbuild, TypeScript

## Project Structure

```
web-terminal/
├── packages/
│   ├── cli/          # CLI entry point for npx
│   ├── client/       # React frontend
│   ├── server/       # Express + WebSocket server
│   └── shared/       # Shared types
├── LICENSE
└── README.md
```

## License

[MIT](LICENSE) © 2025 Levin
