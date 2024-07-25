import dotenv from 'dotenv';

dotenv.config();

// get all listings 
export async function getAllListings(pool) {
  try {
    const query = "SELECT listings.*, users.* FROM listings JOIN users ON listings.user_id = users.id";
    const result = await pool.query(query);
    console.table(result.rows);
    return result.rows;
  } catch (error) {
    console.error("Error executing query:", error);
    return null;
  }
}


// // get my listings
// export async function getMyListings(pool, user_id) {
//   try {
//     const query =
//       'SELECT listings.*, users.* FROM listings JOIN users ON listings.user_id = users.id WHERE listings.user_id = $1;';
//     const result = await pool.query(query, [user_id]);
//     console.table(result.rows);
//     return result.rows;
//   } catch (error) {
//     console.error("Error executing query:", error);
//     return null;
//   }
// }

// // get others' listings
// export async function getOthersListings(pool, user_id) {
//   try {
//     const query =
//       'SELECT listings.*, users.* FROM listings JOIN users ON listings.user_id = users.id WHERE listings.user_id != $1;';
//     const result = await pool.query(query, [user_id]);
//     console.table(result.rows);
//     return result.rows;
//   } catch (error) {
//     console.error("Error executing query:", error);
//     return null;
//   }
// }


// post a new listing into the database
export async function postListing(pool, newListing) {
  try {
    
    const values = [
      newListing.title,
      newListing.author,
      newListing.isbn,
      newListing.cover_img,
      newListing.condition,
      newListing.notes,
      newListing.user_id,
    ];

    console.log("Helper.js: ", values)

    const postQuery =
      "INSERT INTO listings (title, author, isbn, cover_img, condition, notes, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7)";
    const result = await pool.query(postQuery, values);
    console.table(result.rows);
    return result.rows;
  } catch (error) {
    console.error("Error executing query:", error);
    return null;
  }
}