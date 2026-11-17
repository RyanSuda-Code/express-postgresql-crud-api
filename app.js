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

app.use(express.json()); // parse the incoming data so that JS can read it and we can access the data using req.body.
//express.json() parses incoming JSON request bodies into JavaScript objects.

app.get("/spots", async (req, res) => {
  try {
    // contains the code we want to execute if it succeeds.
    const result = await pool.query("SELECT * FROM spots"); //pool.query() lets us send an SQL query directly to PostgreSQL through our connection pool.
    res.json(result.rows); //result.rows the actual records returned by the query. Using result only will return the entire query result object, including metadata.
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
  // Destructuring. Unpack the three values from req.body
  // Use them directly without typing req.body every time

  if (
    typeof name !== "string" ||
    typeof description !== "string" ||
    typeof location !== "string" ||
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
    // RETURNING *, the FE receives the complete saved record, inclusding the ID. While also telling PostgreSQL to send back a copy of the row it just created.
    // The node-postgres library uses numbered dollar signs ($1, $2, etc.) as placeholders and accepts an array of values.
    //It's to prevent user input from being interpreted as executable SQL code.

    return res.status(201).json(result.rows[0]); //result.rows[0] returns only the newly saved data with
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
