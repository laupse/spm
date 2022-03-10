const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const db_config = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_DATABASE || "pouletmayo",
}

const app = express();

app.get("/api/entreesdujour", cors({ origin: ["http://localhost:9000", "https://www.sandwichpouletmayonnaise.com"] }), (req, res, next) => {
  var con = mysql.createConnection(db_config);
  con.connect((error) => {
    if (error) {
      // Cannot open database
      res.status(400).json({ error: error.message });
    } else {
      console.log("Connected to the mysql database.");
    }
  });

  const d = new Date();
  let day = d.getDay();

  const sql = "SELECT * FROM Entrees WHERE jour = ?";

  con.query(sql, [day], (err, rows) => {
    if (err) res.status(400).json({ error: err.message });
    res.status(200).json(rows);  
    con.close();
  });
});

app.get("/health", (req, res, next) => {
  res.status(200);  
});

// Server port
const HTTP_PORT = 8000;
// Start server
app.listen(HTTP_PORT, () => {
  console.log(
    "CORS-enabled web server listening on port %PORT%".replace(
      "%PORT%",
      HTTP_PORT
    )
  );
});