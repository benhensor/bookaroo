import { getAllListings, postListing } from "./helper.js";



export function listingsRoutes(app, pool) {


// Get all books from listings
app.get("/api/listings", async (req, res) => {
  try {
    const result = await getAllListings(pool);
    const body = { status: true, payload: result };
    res.json(body);
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).json({ status: false, error: "Internal server error" });
  }
});







// Get a single book from listings by isbn
app.get("/api/listings/:isbn", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM listings WHERE isbn = $1", [req.params.isbn]);
    const book = result.rows[0];
      if (book) {
        res.json({ status: true, payload: result.rows });
      } else {
        res.json({ status: false, error: "No listing found" });
      }
        } catch (err) {
        console.error("Error executing query:", error);
        res.status(500).json({ status: false, error: "Internal server error" });
  }
});


// Get a single book from listings by title 
app.get("/api/listings/:title", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM listings WHERE title = $1", [req.params.title]);
    const book = result.rows[0];
      if (result.rows.length > 0) {
        res.json({ status: true, payload: result.rows });
      } else {
        res.json({ status: false, error: "No listing found" });
      }
        } catch (err) {
        console.error("Error executing query:", error);
        res.status(500).json({ status: false, error: "Internal server error" });
  }
});



// List a book to Listings
app.post("/api/listings", async (req, res) => {
  try {
    console.log("Routes.js: ", req.body)
    const result = await postListing(pool, req.body);
      if (result) {
        res
        .status(201)
        .json({ status: true, payload: result });
      } else {
        res
        .status(400)
        .json({ status: false, error: "Listing not created" });
      }
        } catch (err) {
          console.error("Error executing query:", err);
          res.status(500).json({ status: false, error: "Internal server error" });
  }
});


// Delete a book from listings by id 
app.delete("/api/listings/:id", async (req, res) => {
  try {
    const result = await client.query("DELETE FROM listings WHERE id = $1", [req.params.id]);
      if (result) {
        res.json({ status: true, payload: result.rows });
      } else {
        res.send( "Listing not deleted" );
      }
        } catch (err) {
        console.error("Error executing query:", error);
        res.status(500).json({ status: false, error: "Internal server error" });
  }
});

}