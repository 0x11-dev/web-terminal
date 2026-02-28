import { createServer, ServerOptions } from '../../server/src/server';
import open from 'open';

// Parse command line arguments
function parseArgs(): ServerOptions & { open?: boolean; help?: boolean } {
  const args = process.argv.slice(2);
  const options: ServerOptions & { open?: boolean; help?: boolean } = {
    port: undefined,
    open: true,
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case '-p':
      case '--port':
        const portArg = args[++i];
        if (portArg) {
          const port = parseInt(portArg, 10);
          if (!isNaN(port) && port > 0 && port < 65536) {
            options.port = port;
          }
        }
        break;

      case '--no-open':
        options.open = false;
        break;

      case '-h':
      case '--help':
        options.help = true;
        break;

      default:
        // Check for --port=XXXX format
        if (arg.startsWith('--port=')) {
          const port = parseInt(arg.split('=')[1], 10);
          if (!isNaN(port) && port > 0 && port < 65536) {
            options.port = port;
          }
        }
        break;
    }
  }

  return options;
}

function showHelp() {
  console.log(`
  Usage: jumu-terminal [options]

  Options:
    -p, --port <port>  Port to run the server on (default: 3000)
    --no-open          Don't open browser automatically
    -h, --help         Show this help message

  Examples:
    jumu-terminal              Start on default port (3000)
    jumu-terminal -p 8080      Start on port 8080
    jumu-terminal --no-open    Don't open browser
`);
}

async function main() {
  const options = parseArgs();

  if (options.help) {
    showHelp();
    process.exit(0);
  }

  try {
    // Set production mode for static file serving
    process.env.NODE_ENV = 'production';

    const server = await createServer(options);

    // Open browser if requested
    if (options.open !== false) {
      const url = `http://localhost:${server.port}`;
      // Delay slightly to ensure server is ready
      setTimeout(() => {
        open(url).catch(() => {
          console.log(`  Please open ${url} in your browser`);
        });
      }, 100);
    }
  } catch (err: any) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();
