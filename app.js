const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const app = express();
require('dotenv').config(); // Load environment variables from .env file

// Use CORS middleware first, before any routes
app.use(cors());
app.use(express.json()); // to parse JSON request bodies

// Example route
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Set up database connection pool for production
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Use the DATABASE_URL environment variable from Render
  ssl: {
    rejectUnauthorized: false, // Render requires SSL connection
  },
});

// Log the database URL for debugging purposes (only useful in development)
if (process.env.NODE_ENV !== 'production') {
  console.log("Connecting to database with URL:", process.env.DATABASE_URL);
}

// Test the connection to the database
pool.connect((err, client, done) => {
  if (err) {
    console.error('Database connection error', err.stack);
  } else {
    console.log('Connected to the database');
  }
});

// Fetch the list of folders and files
app.get('/api/folders', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM folders WHERE parent_folder_id IS NULL;`
    );
    const folders = result.rows;

    for (const folder of folders) {
      const subfoldersResult = await pool.query(
        `SELECT * FROM folders WHERE parent_folder_id = $1;`,
        [folder.id]
      );
      folder.children = subfoldersResult.rows;

      const filesResult = await pool.query(
        `SELECT * FROM files WHERE folder_id = $1;`,
        [folder.id]
      );
      folder.files = filesResult.rows;

      for (const subfolder of folder.children) {
        const subfolderFiles = await pool.query(
          `SELECT * FROM files WHERE folder_id = $1;`,
          [subfolder.id]
        );
        subfolder.files = subfolderFiles.rows;
      }
    }

    res.json(folders);
  } catch (err) {
    console.error('Error fetching folders:', err);
    res.status(500).send('Error fetching folders');
  }
});

// Create a folder
app.post('/api/folders', async (req, res) => {
  const { name, parent_folder_id } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO folders (name, parent_folder_id) VALUES ($1, $2) RETURNING *;`,
      [name, parent_folder_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating folder:', err);
    res.status(500).send('Error creating folder');
  }
});

// Start the server
const PORT = process.env.PORT || 10000; // Use the port from environment variables, or default to 10000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
