# @jumu/web-terminal

A web-based terminal with multi-tab support. Run it with a single command.

## Quick Start

```bash
npx @jumu/web-terminal
```

This will:
1. Start the web terminal server on port 3000
2. Automatically open your browser

## Options

```
Usage: jumu-terminal [options]

Options:
  -p, --port <port>  Port to run the server on (default: 3000)
  --no-open          Don't open browser automatically
  -h, --help         Show this help message

Examples:
  jumu-terminal              Start on default port (3000)
  jumu-terminal -p 8080      Start on port 8080
  jumu-terminal --no-open    Don't open browser
```

## Features

- **Multi-tab support**: Create, close, and switch between multiple terminal tabs
- **Shell profile selection**: Choose between zsh, bash, sh, and other available shells
- **Keyboard shortcuts**:
  - `Ctrl+Shift+T` - New tab
  - `Ctrl+Shift+W` - Close tab
  - `Ctrl+Tab` - Next tab
  - `Ctrl+Shift+Tab` - Previous tab
  - `Ctrl+Shift+C` - Copy
  - `Ctrl+Shift+V` - Paste
- **Tokyo Night theme**: Beautiful dark and light themes
- **xterm.js powered**: Full terminal emulation with GPU acceleration

## Requirements

- Node.js 18 or higher
- macOS or Linux

## Development

```bash
# Clone the repository
git clone <repo-url>
cd web-terminal

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Build CLI for distribution
pnpm build:cli

# Development mode
pnpm dev
```

## License

MIT
