import dotenv from 'dotenv';

// Load environment variables from .env file immediately
dotenv.config();

import app from './app';
import { connectDB } from './config/db';

const PORT = Number(process.env.PORT) || 5000;
const HOST = process.env.HOST || '0.0.0.0';

const startServer = async () => {
  try {
    // 1. Connect to Database first
    await connectDB();

    // 2. Start Express Server only after DB connects
    app.listen(PORT, HOST, () => {
      console.log(`Server is running on http://${HOST}:${PORT} (http://localhost:${PORT})`);
      console.log(`Health check: http://localhost:${PORT}/api/v1/health`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();