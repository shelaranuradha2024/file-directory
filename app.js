const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const app = express();
require('dotenv').config();

// Use CORS middleware
app.use(cors({ origin: '*' }));
app.use(express.json()); // Parse JSON request bodies

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Test database connection
pool.connect((err) => {
  if (err) {
    console.error('Database connection error:', err.stack);
  } else {
    console.log('Connected to the database');
  }
});

// Root route for testing server
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Fetch folders and nested data
app.get('/api/folders', async (req, res) => {
  try {
    const foldersResult = await pool.query(
      `SELECT * FROM folders WHERE parent_folder_id IS NULL;`
    );
    const folders = foldersResult.rows;

    // Fetch files and subfolders for each folder
    for (const folder of folders) {
      const filesResult = await pool.query(
        `SELECT * FROM files WHERE folder_id = $1;`,
        [folder.id]
      );
      folder.files = filesResult.rows;

      const subfoldersResult = await pool.query(
        `SELECT * FROM folders WHERE parent_folder_id = $1;`,
        [folder.id]
      );
      folder.children = subfoldersResult.rows;
    }

    res.json(folders);
  } catch (err) {
    console.error('Error fetching folders:', err);
    res.status(500).json({ message: 'Error fetching folders' });
  }
});

// Start the server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
