require("dotenv").config();
const express = require("express");
const app = express();
const PORT = 3000;
const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.use(express.json());

app.get("/spots", async (req, res) => {
  try {
    // contains the code we want to execute if it succeeds.
    const result = await pool.query("SELECT * FROM spots"); //pool.query() lets us send an SQL query directly to PostgreSQL through our connection pool.
    res.json(result.rows);
  } catch (error) {
    console.error(error); //logs the error.
    res.status(500).json({ error: "Internal Server Error" }); //res.status(500) sends an HTTP 500 status code. .json() sends an error message to the client.
  }
});
// get retrieves existing data from the database.
//pool.query() sends an SQL query through the connection pool.
//result.rows contains the records returned by PostgreSQL.
//res.json() sends those records to the client as a JSON response.
//Express automatically sets the appropriate Content-Type header.

app.post("/spots", async (req, res) => {
  const { name, description, location } = req.body;

  if (
    !name ||
    !description ||
    !location ||
    name.trim() === "" ||
    description.trim() === "" ||
    location.trim() === ""
  ) {
    return res.status(400).json({
      error: "All fields are required",
    });
  }
  //JavaScript evaluates || from left to right and uses short-circuit evaluation.
  //If !name is true, JavaScript won't evaluate the remaining conditions unnecessarily.

  try {
    const result = await pool.query(
      "INSERT INTO spots (name, location, description) VALUES ($1, $2, $3) RETURNING *",
      [name, location, description],
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`server is running on http://localhost:${PORT}`);
});
