const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Explicitly serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to get the schedule
app.get('/api/schedule', (req, res) => {
  const schedulePath = path.join(__dirname, 'data', 'schedule.json');
  fs.readFile(schedulePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading schedule file:', err);
      return res.status(500).json({ error: 'Failed to load schedule data' });
    }
    res.json(JSON.parse(data));
  });
});

// Start the server
if (process.env.NODE_ENV !== 'test' && require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

module.exports = app;
