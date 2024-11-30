const express = require('express');
const cors = require('cors');
const app = express();

// Use CORS middleware first, before any routes
app.use(cors());
app.use(express.json()); // to parse JSON request bodies

// Example route
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Your other routes
app.get('/api/folders', (req, res) => {
  // Handle fetching folders
});

// Listen on a port
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

require('dotenv').config(); // Load environment variables from .env file

// Log the database URL for debugging purposes (do this in local development only)
console.log("Connecting to database with URL:", process.env.DATABASE_URL);

// PostgreSQL connection settings using the external URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Use environment variable
  ssl: {
    rejectUnauthorized: false,
  },
});

// Test the connection to the database
pool.connect((err, client, done) => {
  if (err) {
    console.error('Database connection error', err.stack);
  } else {
    console.log('Connected to the database');
  }
});

app.use(cors({
  origin: 'https://file-directory-frontend.onrender.com',  // Your frontend URL on Render
}));

app.use(express.json()); // To parse JSON requests

// Root route to test the server is running
app.get('/', (req, res) => {
  res.send('Server is running!');
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
app.get("/api/folders", (req, res) => {
  // Assuming your folders are stored in an array or database
  console.log("Request received for folders");
  // Add more debugging logic here if needed
  res.json(folders);  // Ensure that folders is the correct data to return
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
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
