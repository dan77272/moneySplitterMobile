const express = require('express');
const mongoose = require('mongoose');
const groupHandler = require('./api/groups')
const savePageDataHandler = require('./api/savePageData')
const app = express();
require('dotenv').config()
const cors = require('cors');
app.use(cors());

app.use(express.json()); // Middleware for parsing JSON

// Connect to MongoDB
mongoose.connect(process.env.MONGODB)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Define a simple route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/api/groups', groupHandler);

app.post('/api/savePageData', savePageDataHandler)

app.put('/api/savePageData', savePageDataHandler)

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});