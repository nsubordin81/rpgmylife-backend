const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const encounterRoutes = require('./legacy/encounters/encounterRoutes');
const questRoutes = require('./legacy/quests/questRoutes');

const backupRoutes = require('./routes/backupRoutes');
const dataManagementRoutes = require('./routes/dataManagementRoutes');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Event-sourced routes
app.use('/api/v2/character', require('./character/api/characterRoutes'));

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

module.exports = app;