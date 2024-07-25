import { getAllBooks, getBookByTitle, getBookByIsbn } from "./helper.js";



export function booksRoutes(app, pool) {

  // GET request handler to fetch all books
  app.get("/api/books", async (req, res) => {
    try {
      const books = await getAllBooks( pool );
      if (books.length > 0) {
        res
        .status(200)
        .json({ status: true, payload: books });
      } else {
        res
        .status(404)
        .json({ status: false, error: "No books found" });
      }
    } catch (err) {
      console.error( "Error handling GET request:", err );
      res.status(500).json({ status: false, error: "Internal server error" });
    }
  });




  // Get a single book from books by title 
  app.get("/api/books/:title", async (req, res) => {
      try {
        const result = await getBookByTitle( pool, req.params.title.toLowerCase() );
          if (result.length > 0) {
            // console.log("This is the routes.js ", result)
            res
            .status(200)
            .json({ status: true, payload: result });
          } else {
            res
            .status(404)
            .json({ status: false, error: "No book found" });
          }
            } catch (err) {
            console.error( "Error executing query:", err );
            res.status(500).json({ status: false, error: "Internal server error" });
      }
  });

 
  // Get a single book from books by isbn
  app.get("/api/books/:isbn", async (req, res) => {
      try {
        const result = await getBookByIsbn( pool, req.params.isbn );
          if (result.rows.length > 0) {
            res
            .status(200)
            .json({ status: true, payload: result.rows });
          } else {
            res
            .status(404)
            .json({ status: false, error: "No book found" });
          }
            } catch (err) {
            console.error( "Error executing query:", err );
            res.status(500).json({ status: false, error: "Internal server error" });
      }
  });
  
}