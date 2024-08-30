\c postgres

DROP DATABASE IF EXISTS fake_twitter_db;
CREATE DATABASE fake_twitter_db;

\c fake_twitter_db

DROP TABLE IF EXISTS tweets;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id SERIAL NOT NULL PRIMARY KEY,
  username VARCHAR(30) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE tweets (
    id SERIAL NOT NULL PRIMARY KEY,
    body VARCHAR(140) NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);