import dotenv from 'dotenv';

dotenv.config();


// Function to retrieve all books from the database
export async function getAllBooks(pool) {
  try {
    const query = "SELECT * FROM books";
    const result = await pool.query(query);
    
    return result.rows;
  } catch (err) {
    console.error("Error executing query:", err);
    throw new Error("Failed to fetch books from the database");
  }
}
  
// Function to retrieve a single book from the database
export async function getBookByTitle(pool, title) {
  try {
    const query = "SELECT * FROM books WHERE LOWER(title) = $1";
    const result = await pool.query(query, [title.toLowerCase()]);
    console.table(result.rows);
    // console.log("This is the helper.js ", result.rows)
    return result.rows;
  } catch (err) {
    console.error("Error executing query:", err);
    throw new Error("Failed to fetch book from the database");
  }
} 

// Function to retreive a single book by isbn
export async function getBookByIsbn(pool, isbn) {
  try {
    const query = "SELECT * FROM books WHERE isbn = $1";
    const result = await pool.query(query, [isbn]);
    return result.rows[0];
  } catch (err) {
    console.error("Error executing query:", err);
    throw new Error("Failed to fetch book from the database");
  }
}  