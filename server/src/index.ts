import express from "express";
import logger from "morgan";
import pool from "./config/connection.js";

const app = express();

const PORT = process.env.PORT || 3001;

app.use(logger("dev"));
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("../client/dist"));
}

app.get("/api/users/:id", (req, res) => {
  const { id } = req.params;
  pool.query(
    "SELECT users.id, users.username, tweets.id, tweets.body FROM users JOIN tweets ON users.id = tweets.user_id WHERE users.id = $1 ORDER BY tweets.id DESC",
    [id],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err });
        return;
      }
      if (result.rows.length) {
        const preformattedData = {
          id: result.rows[0].id,
          username: result.rows[0].username,
          tweets: result.rows.map((tweet) => {
            return {
              id: tweet.id,
              body: tweet.body,
              user_id: tweet.user_id,
            };
          }),
        };

        res.status(200).json([preformattedData]);
        return;
      }
      res.status(200).json(result.rows);
    }
  );
});

app.get("/api/users", (req, res) => {
  pool.query("SELECT id, username FROM users", [], (err, result) => {
    if (err) {
      res.status(500).json({ error: err });
      return;
    }
    res.status(200).json(result.rows);
  });
});

app.post("/api/users", (req, res) => {
  const { username, email, password } = req.body;
  pool.query(
    "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
    [username, email, password],
    (err, result) => {
      if (err) {
        res.status(500).redirect("/");
        return;
      }
      res.status(201).redirect("/");
    }
  );
});

app.post("/api/tweets", (req, res) => {
  const { user_id, body } = req.body;
  pool.query(
    "INSERT INTO tweets (user_id, body) VALUES ($1, $2)",
    [user_id, body],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err });
        return;
      }
      res.status(201).redirect("/tweets");
    }
  );
});

app.get("/api/tweets", (req, res) => {
    pool.query("SELECT users.username, tweets.user_id, tweets.body FROM users JOIN tweets ON users.id = tweets.user_id ORDER BY tweets.id DESC", (err, result) => {
        if (err) {
        res.status(500).json({ error: err });
        return;
        }
        res.status(200).json(result.rows);
    });
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
