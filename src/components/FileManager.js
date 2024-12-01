import React, { useState, useEffect } from "react";
import "../styles/FileManager.css";
import Folder from "./Folder";

const FileManager = () => {
  const [directories, setDirectories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiBase = process.env.REACT_APP_API_URL || "http://localhost:10000/api";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiBase}/folders`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        setDirectories(data);
      } catch (err) {
        setError(`Failed to load directories: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiBase]);

  if (loading) return <div>Loading directories...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="file-manager">
      <button onClick={() => alert("Create Folder Feature Here!")}>
        Create Folder
      </button>
      <div>
        {directories.map((folder) => (
          <Folder key={folder.id} folder={folder} />
        ))}
      </div>
    </div>
  );
};

export default FileManager;
