# Express PostgreSQL API

A small backend practice project using Node.js, Express, and PostgreSQL.

## What I Learned

- **Express Routing:** Handling GET and POST requests.
- **PostgreSQL:** Connecting Node.js to a database using `pg` and `Pool`.
- **SQL Queries:** Using `SELECT` and `INSERT`.
- **Parameterized Queries:** Using `$1`, `$2`, `$3` to prevent SQL injection.
- **Middleware:** Using `express.json()` to parse incoming JSON.
- **Validation:** Checking user input on the backend.
- **HTTP Status Codes:** Using `200`, `201`, `400`, and `500`.

## API Endpoints

| Method | Endpoint | Purpose                    |
| ------ | -------- | -------------------------- |
| GET    | `/spots` | Retrieve all spots as JSON |
| POST   | `/spots` | Create a new spot          |

## Database

PostgreSQL database: `hidden_spots`

The `spots` table contains:

- `id` - Automatically generated ID
- `name` - Spot name
- `location` - Spot location
- `description` - Spot description

## Environment Variables

Database credentials are stored in `.env`:

- `DB_HOST`
- `DB_USER`
- `DB_NAME`
- `DB_PASSWORD`
- `DB_PORT`

**Important:** Never commit your `.env` file to GitHub.

## Run Locally

```bash
npm install
node app.js
```

Server runs at `http://localhost:3000`.

## Testing

Tested GET and POST requests using Thunder Client and verified inserted records using PostgreSQL's `SELECT * FROM spots;`.
