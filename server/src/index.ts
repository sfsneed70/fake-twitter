import express from "express";
import logger from "morgan";
import pool from "./config/connection.js";

const app = express();

const PORT = process.env.PORT || 3001;

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("../client/dist"));
}

app.post("/api/users", (req, res) => {
  console.log(req.body);
  res.end();
});

app.get("/api/health", (req, res) => {
  pool.query("SELECT * FROM users", (error, result) => {
    if (error) {
      res.status(500).json({ error });
      return;
    }
    res.send(result.rows);
  });
});

(async () => {
  try {
    await pool.connect();
    console.log("Connected to the database");
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database", error);
  }
})();
