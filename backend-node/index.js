const express = require("express");
const cors = require("cors");
// const mysql = require("mysql2");
const mysql = require('mysql2/promise');
const redis = require("redis");

const db_config = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_DATABASE || "pouletmayo",
}

const redis_url = process.env.REDIS_URL || "redis://localhost:6379"

const app = express();

app.get("/api/entreesdujour", cors({ origin: ["http://localhost:9000", "https://www.sandwichpouletmayonnaise.com"] }), async (req, res, next) => {
  const d = new Date();
  let day = d.getDay();

  const redis_client = redis.createClient({
    url: redis_url
  });

  try {
    await redis_client.connect();

    const value = await redis_client.get(day);
    if(value) {
      redis_client.disconnect();
      return res.status(200).json(JSON.parse(value));
    }
  } catch (error) {
    console.log(error)
  }

  try {
    const con = await mysql.createConnection(db_config);
    const sql = "SELECT * FROM Entrees WHERE jour = ?";
    const [rows, fields] = await con.execute(sql, [day])

    res.status(200).json(rows); 
    try {
      await redis_client.set(day, JSON.stringify(rows));
      redis_client.disconnect()
    } catch (error) {
      console.log(error)
    }
    con.close(); 
    
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
  
  
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