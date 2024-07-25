import dotenv from 'dotenv';
dotenv.config();

export const config = {
    google: {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:5000/auth/google/callback'
    },
    geocodify: {
        geocodifyApiKey: process.env.GEOCODIFY_API_KEY
    },
    database: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432, // Default PostgreSQL port
        dialect: 'postgres'
    }
};
