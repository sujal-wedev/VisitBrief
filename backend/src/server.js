import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { handleTriage } from './controllers/triageController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from root or backend
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'VisitBrief Backend API',
    timestamp: new Date().toISOString()
  });
});

// Clinical triage endpoint
app.post('/api/triage', handleTriage);

app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`🚀 VisitBrief Backend Server running on http://localhost:${PORT}`);
  console.log(`🏥 Triage API: http://localhost:${PORT}/api/triage`);
  console.log(`=================================`);
});
