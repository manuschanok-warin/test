import express from 'express';
import cors from 'cors';

import { config } from './config.js';
import { ensureSeedData } from './db/schema.js';
import patientRoutes from './routes/patientRoutes.js';
import staffRoutes from './routes/staffRoutes.js';
import { AuthService } from './services/authService.js';

const app = express();
app.use(cors());
app.use(express.json());

app.locals.tokens = {} as Record<string, any>;
app.use('/staff', staffRoutes);
app.use('/patient', patientRoutes);

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

ensureSeedData();

const PORT = config.port;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Hospital middleware running on http://localhost:${PORT}`);
  });
}

export { app, AuthService };
