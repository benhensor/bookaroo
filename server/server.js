import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import pkg from 'pg';
import { listingsRoutes } from './listings/routes.js';
import { booksRoutes } from './books/routes.js';
import { usersRoutes } from './users/routes.js';

export const { Pool } = pkg;
dotenv.config();
 
const app = express();
const port = process.env.PORT || 5432; // default port to listen

const dbConnectionString = process.env.DB_CONNECTION_STRING;
const apiKey = process.env.API_KEY
const secretKey = process.env.SECRET_KEY

// middleware

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Create database client
export const pool = new Pool({
    connectionString: dbConnectionString, // process.env.DB_CONNECTION_STRING,
    ssl: {
        rejectUnauthorized: false
    }
});

// Connect to database
pool.connect();

booksRoutes(app, pool);
usersRoutes(app, pool, secretKey);
listingsRoutes(app, pool);


//Generate secret key
// import crypto from 'crypto';

// const generateSecretKey = () => {
//   const keyLength = 32; // 256 bits
//   return crypto.randomBytes(keyLength).toString('hex');
// }; 

// console.log(generateSecretKey());


 
// Close database connection
process.on("SIGINT", () => {
  pool.end()
    .then(() => { 
      console.log("Database connection closed"); 
      process.exit(0);
    })
    .catch((err) => {
      console.error("Error closing database connection:", err); 
      process.exit(1); 
    });
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello from server!" });
});

// Listen on assigned port 
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});