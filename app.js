const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const app = express();
const port = process.env.PORT || 5000; // Heroku/Render provides a dynamic port

// PostgreSQL connection settings
const pool = new Pool({
  host: 'localhost', // Replace with your database URL on Render (if hosted there)
  user: 'postgres',
  port: 5432,
  password: 'ANuradha#24',
  database: 'fileDirectory',
});

// CORS configuration to allow frontend's domain
app.use(cors({
  origin: 'https://file-directory-frontend.onrender.com', // Replace with your frontend URL
}));

app.use(express.json()); // To parse JSON requests

// API endpoints for folder and file management

// Get all folders
app.get('/api/folders', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM folders');
    const folders = result.rows;
    res.json(folders);
  } catch (error) {
    console.error('Error fetching folders:', error);
    res.status(500).json({ error: 'Error fetching folders' });
  }
});

// Create a new folder
app.post('/api/folders', async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Folder name is required' });
  }

  try {
    const result = await pool.query('INSERT INTO folders (name) VALUES ($1) RETURNING *', [name]);
    const newFolder = result.rows[0];
    res.status(201).json(newFolder);
  } catch (error) {
    console.error('Error creating folder:', error);
    res.status(500).json({ error: 'Error creating folder' });
  }
});

// Update folder name
app.put('/api/folders/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'New folder name is required' });
  }

  try {
    const result = await pool.query('UPDATE folders SET name = $1 WHERE id = $2 RETURNING *', [name, id]);
    const updatedFolder = result.rows[0];
    if (!updatedFolder) {
      return res.status(404).json({ error: 'Folder not found' });
    }
    res.json(updatedFolder);
  } catch (error) {
    console.error('Error updating folder:', error);
    res.status(500).json({ error: 'Error updating folder' });
  }
});

// Delete a folder
app.delete('/api/folders/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM folders WHERE id = $1 RETURNING *', [id]);
    const deletedFolder = result.rows[0];
    if (!deletedFolder) {
      return res.status(404).json({ error: 'Folder not found' });
    }
    res.json({ message: 'Folder deleted successfully' });
  } catch (error) {
    console.error('Error deleting folder:', error);
    res.status(500).json({ error: 'Error deleting folder' });
  }
});

// Get all files in a folder
app.get('/api/folders/:folderId/files', async (req, res) => {
  const { folderId } = req.params;

  try {
    const result = await pool.query('SELECT * FROM files WHERE folder_id = $1', [folderId]);
    const files = result.rows;
    res.json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ error: 'Error fetching files' });
  }
});

// Create a new file in a folder
app.post('/api/files', async (req, res) => {
  const { folderId, name } = req.body;
  if (!folderId || !name) {
    return res.status(400).json({ error: 'Folder ID and file name are required' });
  }

  try {
    const result = await pool.query('INSERT INTO files (folder_id, name) VALUES ($1, $2) RETURNING *', [folderId, name]);
    const newFile = result.rows[0];
    res.status(201).json(newFile);
  } catch (error) {
    console.error('Error creating file:', error);
    res.status(500).json({ error: 'Error creating file' });
  }
});

// Update file name
app.put('/api/files/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'New file name is required' });
  }

  try {
    const result = await pool.query('UPDATE files SET name = $1 WHERE id = $2 RETURNING *', [name, id]);
    const updatedFile = result.rows[0];
    if (!updatedFile) {
      return res.status(404).json({ error: 'File not found' });
    }
    res.json(updatedFile);
  } catch (error) {
    console.error('Error updating file:', error);
    res.status(500).json({ error: 'Error updating file' });
  }
});

// Delete a file
app.delete('/api/files/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM files WHERE id = $1 RETURNING *', [id]);
    const deletedFile = result.rows[0];
    if (!deletedFile) {
      return res.status(404).json({ error: 'File not found' });
    }
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Error deleting file' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on https://file-directory-2l36.onrender.com`);
});
