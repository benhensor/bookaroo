import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { loginUser, checkUser, createUser } from "./helper.js";

 


export function usersRoutes(app, pool, secretKey) {


// Login route
app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists in the database
    const user = await loginUser(pool, email);

    if (user.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id }, secretKey );

    // Return the user data as a response
    return res.status(200).json({ user, token });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});





// Register route
app.post('/api/users/register', async (req, res) => {

  const {
    email,
    password_hash,
    first_name,
    last_name,
    addressOne,
    addressTwo,
    city,
    postcode,
    phone,
  } = req.body;

  try {
    

    

    // Check if user with the provided email already exists
    const existingUser = await checkUser(pool, email);
    //console.log("Route.js", password_hash) // correctedly logged
    if (existingUser && existingUser.length > 0) {
      return res.status(400).json({ message: 'User with the provided email already exists' });
    }

    // Create the user data object
    const userDataToAdd = {
      email,
      password_hash,
      first_name,
      last_name,
      addressOne,
      addressTwo,
      city,
      postcode,
      phone,
    };

    // Insert the user into the database
    const { token, user: newUser } = await createUser(pool, userDataToAdd, secretKey);
    

    console.log("Return of Routes.js: ", newUser)

    // Return the token as a response
    return res.status(201).json({ token, user: newUser });
  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});







// Logout route
// app.post('api/users/logout', (req, res) => {
//   // Perform any necessary cleanup or invalidation of the token
//   return res.status(200).json({ message: 'Logged out successfully' });
// });


// Get a user from users by email
// app.get("/api/users/:email", async (req, res) => {
//   try {
//     const email = req.params.email;
//     console.log("Routes file Email:", email);
//     const result = await getAllUsers(pool, email);
//       if (result) {
//         res.json({ status: true, payload: result });
//         console.log(result);
//       } else {
//         res.status(404).json({ status: false, error: "No user found" });
//       }
//         } catch (err) {
//         console.error("Error executing query:", err);
//         res.status(500).json({ status: false, error: "Internal server error" });
//   }
// });





// Update a user from users by email
// app.put("/api/users/:email", async (req, res) => {
//   try {
//     const result = await updateUser(pool, req.body);
//       if (result) {
//         res.json({ status: true, payload: result.rows });
//       } else {
//         res.json({ status: false, error: "No user found" });
//       }
//         } catch (err) {
//         console.error("Error executing query:", err);
//         res.status(500).json({ status: false, error: "Internal server error" });
//   }
// });





// Delete a user from users by email
// app.delete("/api/users/:email", async (req, res) => {
//   try {
//     const email = req.params.email;
//     const result = await deleteUser(pool, email);
//       if (result) {
//         res.json({ status: true, payload: result.rows });
//       } else {
//         res.json({ status: false, error: "No user found" });
//       }
//         } catch (err) {
//         console.error("Error executing query:", err);
//         res.status(500).json({ status: false, error: "Internal server error" });
//   }
// });

 
}
