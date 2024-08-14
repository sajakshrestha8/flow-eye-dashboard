const express = require("express");
const mysql = require("mysql");
const axios = require("axios");
const moment = require("moment");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const SMS_API_URL = "https://sms.aakashsms.com/sms/v3/send";
const AUTH_TOKEN = "5343732da4ddf63f92cf7f02a3ea6d7264d5493fd4af2526156fe4bdc32a63fa";
const ALERT_PHONE_NUMBER = "9869107770";

// Create a connection to the MySQL database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "water_test",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the MySQL database.");
  initDb();
});

// Initialize the database (Create table if not exists)
function initDb() {
  const query = `
        CREATE TABLE IF NOT EXISTS levels (
            id INT AUTO_INCREMENT PRIMARY KEY,
            level INT NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            sms_alert_sent BOOLEAN DEFAULT FALSE,
            flood_alert BOOLEAN DEFAULT FALSE
        )
    `;
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error initializing database:", err);
      return;
    }
    console.log("Database initialized successfully.");
  });
}

// Function to send an SMS alert
function sendSms(message) {
  const payload = new URLSearchParams();
  payload.append("auth_token", AUTH_TOKEN);
  payload.append("to", ALERT_PHONE_NUMBER);
  payload.append("text", message);

  axios
    .post(SMS_API_URL, payload)
    .then((response) => {
      console.log("SMS sent successfully.");
    })
    .catch((error) => {
      console.error("Failed to send SMS:", error.response ? error.response.status : error.message);
    });
}

// Route to handle incoming water level data
app.post("/api/water-level", (req, res) => {
  const { level } = req.body;

  if (level !== undefined) {
    let smsAlert = false;
    let floodAlert = false;

    // Determine if an SMS alert or flood alert should be triggered
    if (level > 25) {
      smsAlert = true;
      const currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
      const message = `चेतावनी: पानीको सतह सुरक्षित सतह भन्दा माथि पुगेको छ। हालको सतह: ${level} से.मि. ${currentTime} मा।`;
      sendSms(message);
    }

    if (level > 70) {
      floodAlert = true;
    }

    const query = "INSERT INTO levels (level, sms_alert_sent, flood_alert) VALUES (?, ?, ?)";
    db.query(query, [level, smsAlert, floodAlert], (err, result) => {
      if (err) {
        console.error("Error inserting data:", err);
        return res.status(500).json({ status: "error", message: err.message });
      }
      res.json({ status: "success", level, smsAlert, floodAlert });
    });
  } else {
    res.status(400).json({ status: "error", message: "No water level provided" });
  }
});

// Route to display the latest water levels
app.get("/", (req, res) => {
  const query = "SELECT * FROM levels ORDER BY id DESC LIMIT 10";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error retrieving data:", err);
      return res.status(500).send("Error retrieving data");
    }
    res.render("index.ejs", { data: results });
  });
});

// Route to get the latest water levels as JSON
app.get("/latest-data", (req, res) => {
  const query = "SELECT * FROM levels ORDER BY id DESC LIMIT 10";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error retrieving latest data:", err);
      return res.status(500).json({ status: "error", message: err.message });
    }
    res.json(results);
  });
});

// Route to get water level data for the chart
app.get("/chart-data", (req, res) => {
  // Query to get every 10th level from the database
  const query = `
    SELECT 
        level, 
        DATE_FORMAT(timestamp, '%H:%i') AS month
    FROM (
        SELECT 
            level, 
            timestamp
        FROM levels
        ORDER BY timestamp DESC
        LIMIT 100 -- Modify this limit as per your requirement
    ) AS latest_entries
    ORDER BY timestamp ASC
    LIMIT 10;
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error retrieving chart data:", err);
      return res.status(500).json({ status: "error", message: err.message });
    }
    res.json(results);
  });
});

// Route to get the latest 7 logs for the dashboard
app.get("/logs", (req, res) => {
  const query = `
    SELECT level, timestamp, sms_alert_sent, flood_alert 
    FROM levels 
    ORDER BY timestamp DESC 
    LIMIT 8;
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error retrieving logs:", err);
      return res.status(500).json({ status: "error", message: err.message });
    }
    res.json(results);
  });
});

// Start the server
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
