import mongoose from 'mongoose';
import { Server } from 'http';
import app from './app';
import config from './app/config';

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    console.log('✅ Database connected successfully');

    server = app.listen(config.port, () => {
      console.log(`🚀 Server is running on port ${config.port}`);
    });
  } catch (err) {
    console.error('❌ Failed to connect database', err);
  }

  // Unhandled rejection হলে server গ্রেসফুলি বন্ধ হবে
  process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection detected, shutting down...', err);
    if (server) {
      server.close(() => process.exit(1));
    } else {
      process.exit(1);
    }
  });
}

main();

// Uncaught exception hole server gracefully shutdown hobe
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception detected, shutting down...', err);
  process.exit(1);
});