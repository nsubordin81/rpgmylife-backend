const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const characterRoutes = require('./routes/characterRoutes');
const encounterRoutes = require('./routes/encounterRoutes');
const questRoutes = require('./routes/questRoutes');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api/character', characterRoutes);
app.use('/api/encounters', encounterRoutes);
app.use('/api/quests', questRoutes);

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