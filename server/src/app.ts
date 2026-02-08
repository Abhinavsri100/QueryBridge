import dotenv from 'dotenv';
dotenv.config();

import express, { type Application, type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import dbRoutes from './routes/dbRoutes.js';

const app: Application = express();

// 1. Request Logger (MOVE TO TOP)
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.method === 'OPTIONS') {
    console.log('Preflight request received');
  }
  next();
});

// 2. CORS
app.use(cors({
  origin: "http://query-bridge.vercel.app/",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// 3. Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Basic Route
app.get('/', (req: Request, res: Response) => {
  res.send('TalkWithDatabase API is running');
});

// 5. App Routes
app.use('/api/auth', authRoutes);
app.use('/api/db', dbRoutes);

// 6. Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

export default app;
