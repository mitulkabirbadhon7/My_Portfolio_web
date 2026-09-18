import app from './app';
import dotenv from 'dotenv';
import { connectDB } from './config/db';

// Load environment variables from .env file
dotenv.config();

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