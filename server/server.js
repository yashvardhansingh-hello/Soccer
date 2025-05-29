// server/server.js
require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Football API configuration
const API_KEY = "249953e90ed047c692040d71c7304ac2";
const API_HOST = "api.football-data.org";

// Proxy endpoint to fetch matches
app.get("/api/matches", async (req, res) => {
  try {
    const response = await axios.get(`https://${API_HOST}/v4/matches`, {
      headers: {
        "X-Auth-Token": API_KEY,
      },
      params: {
        limit: 10,
      },
    });
    console.log(response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching matches:", error);
    res.status(500).json({ error: "Failed to fetch matches" });
  }
});

if (process.env.NODE_ENV === "production") {
  // Serve static files from the React app
  app.use(express.static(path.join(__dirname, "../client/build")));

  // Handle React routing, return all requests to React app
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
  });
}
// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
