import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import jwt from "jsonwebtoken";
 
dotenv.config();


// Log in user
export async function loginUser(pool, email) {
  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return user.rows[0] || null;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};
 

// Check if user exists
export async function checkUser(pool, email) {
  try {
    const query = 'SELECT * FROM users WHERE email = $1';
    const values = [email]; // Pass the email as an array
    const result = await pool.query(query, values);
    console.log('Helper user:', result)
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};
 


// Function to get all users from users
// export async function getAllUsers(pool) {
//   try {
//     const query = 'SELECT * FROM users';
//     const result = await pool.query(query);
//     console.table(result.rows);
//     if (result.rows.length > 0) {
//       return { status: true, payload: result.rows };
//     } else {
//       return { status: false, error: 'No users found' };
//     }
//   } catch (err) {
//     console.error(err);
//     return { status: false, error: 'Internal server error' };
//   }
// }


// Function to get a user from users by email
// export async function getUserByEmail(pool, email) {
//   try {
//     console.log('Helper Email:', email);
//     const query = 'SELECT * FROM users WHERE email = $1';
//     const values = [email];
//     const result = await pool.query(query, values);
//     return result.rows[0];
//   } catch (error) {
//     console.error('Error while retrieving user data from the database:', error);
//     throw error;
//   }
// };


export async function createUser(pool, userDataToAdd, secretKey) {
  try {
    const id = uuidv4();
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
    } = userDataToAdd;

    console.log('Helper.js', userDataToAdd);

    // Call OpenWeather API to get latitude and longitude
    const weatherAPIKey = process.env.OWM_KEY;
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city},GB&appid=${weatherAPIKey}`;
    const weatherResponse = await fetch(weatherURL);

    if (!weatherResponse.ok) {
      throw new Error('Error fetching weather data');
    }

    const weatherData = await weatherResponse.json();

    let latitude = null;
    let longitude = null;

    if (weatherData && weatherData.coord) {
      const { lat, lon } = weatherData.coord;
      latitude = lat;
      longitude = lon;
    }

    const query =
      'INSERT INTO users (id, email, first_name, last_name, address_line_1, address_line_2, city, postcode, latitude, longitude, phone, password_hash) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)';
    const values = [
      id,
      email,
      first_name,
      last_name,
      addressOne,
      addressTwo,
      city,
      postcode,
      latitude,
      longitude,
      phone,
      password_hash,
    ];

    const result = await pool.query(query, values);
    console.log('result created:', result);

    const newUser = {
      id,
      email,
      first_name,
      last_name,
      addressOne,
      addressTwo,
      city,
      postcode,
      latitude,
      longitude,
      phone,
    };

    console.log('newUser created:', newUser);

    const token = jwt.sign({ id: newUser.id }, secretKey);

    console.log("HELPER - NEW USER", newUser, token);
    return { token, user: newUser };
  } catch (err) {
    console.error(err);
    throw err;
  }
}






// Update a user from users by email
// export async function updateUser(pool, updatedUserData) {
//   try {
  
//     const {
//       email,
//       name,
//       addressOne,
//       addressTwo,
//       city,
//       postcode,
//       phone,
//     } = updatedUserData;

//   const [first_name, last_name] = name.split(' ');

//   // Call OpenWeather API to get latitude and longitude
//   const weatherAPIKey = process.env.OWM_KEY;
//   const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city},GB&appid=${weatherAPIKey}`;
//   const weatherResponse = await fetch(weatherURL);
//   const weatherData = await weatherResponse.json();

//   let latitude = null;
//   let longitude = null;

//   if (weatherData && weatherData.coord) {
//     const { lat, lon } = weatherData.coord;
//     latitude = lat;
//     longitude = lon;
//   }

//   const query = 'UPDATE users SET email = $1, first_name = $2, last_name = $3, address_line_1 = $4, address_line_2 = $5, city = $6, postcode = $7, latitude = $8, longitude = $9 WHERE phone = $10';
//   const values = [ email, first_name, last_name, addressOne, addressTwo, city, postcode, latitude, longitude, phone ];
//   const result = await pool.query(query, values);
//   console.table(result.rows);
//   return result.rows;
//   } catch (err) {
//   console.error(err);
//   }
// }





// // Delete a user from users by email
// export async function deleteUser(pool, email) {
//   try {
//     const query = 'DELETE FROM users WHERE email = $1';
//     const values = [email];
//     const result = await pool.query(query, values);
//     console.table(result.rows);
//     return result.rows;
//     } catch (err) {
//     console.error(err);
//   }
// }
