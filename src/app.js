import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { characterRoutes } from './character/api/characterRoutes.js';

// Legacy routes
import { encounterRoutes } from './legacy/encounters/encounterRoutes.js';
import { questRoutes } from './legacy/quests/questRoutes.js';
import { backupRoutes } from './routes/backupRoutes.js';
import { dataManagementRoutes } from './routes/dataManagementRoutes.js';

dotenv.config()
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Event-sourced routes
app.use('/api/v2/character', characterRoutes);

// Legacy routes
app.use('/api/encounters', encounterRoutes);
app.use('/api/quests', questRoutes);
app.use('/api/backup', backupRoutes);
app.use('/api/data-management', dataManagementRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'RPG My Life API is running' });
});

// Add this debugging middleware after your routes
app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  next();
});

// Add this as the last middleware
app.use((req, res) => {
  console.log(`Route not found: ${req.method} ${req.url}`);
  res.status(404).send('Not Found');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`MongoDB URI: ${process.env.MONGODB_URI}`);
});

export { app };