# File Directory - Backend

## Overview

This project is a **File Directory Backend** built with **Node.js**, **Express.js**, and **PostgreSQL**. It allows users to manage a file directory system by interacting with folders and files through a set of API endpoints. The backend supports operations such as creating, renaming, deleting, and fetching folders and files.

This backend can be integrated with a **React.js** frontend for a complete file management system.

## Features

- **Create Folder**: Users can create new folders in the file directory.
- **Create File**: Users can create new files within folders.
- **Rename Folder/File**: Users can rename folders and files.
- **Delete Folder/File**: Users can delete folders and files.
- **Dynamic Folder Structure**: Folders can be expanded or collapsed to show or hide their contents.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **State Management**: React State Hooks (`useState`, `useEffect`) for the frontend

## Requirements

Before running the project, ensure you have the following installed:

- **Node.js**: [Download Node.js](https://nodejs.org/), version 18.x.x or higher.
- **npm**: npm is included with Node.js, but you can install it separately via [npm](https://www.npmjs.com/).
- **PostgreSQL**: [Download PostgreSQL](https://www.postgresql.org/download/).
-**PostMan**

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/shelaranuradha2024/file-directory.git
cd file-directory-backend

npm install


##  Create a PostgreSQL database 

CREATE TABLE folders (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  parent_folder_id INTEGER REFERENCES folders(id) ON DELETE CASCADE
);

CREATE TABLE files (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  folder_id INTEGER REFERENCES folders(id) ON DELETE CASCADE
);

##  Configure the database connection
host: 'host_name',
  user: 'postgres_username',
  port: 5432,
  password: 'your-password',
  database: 'DatabaseName',

  ## start Sever
  npm start
#  accessible at http://localhost:5000.

## API Endpoints to test on Postman ,CRUD operation

GET /api/folders — Fetches the list of folders, subfolders, and files.
POST /api/folders — Creates a new folder.
POST /api/files — Creates a new file within a folder.
PUT /api/folders/:id — Renames a folder.
DELETE /api/folders/:id — Deletes a folder.
PUT /api/files/:id — Renames a file.
DELETE /api/files/:id — Deletes a file.




####Frontend Integration
The React.js frontend interacts with this backend API to allow users to create, rename, delete, and organize folders and files. The frontend uses React State Hooks (useState, useEffect) to manage state and dynamically reflect changes without page refresh.