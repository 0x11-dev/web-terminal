import { createServer } from './server';

createServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
