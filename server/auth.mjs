import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from './models/User.mjs';
import passport from 'passport';
import dotenv from 'dotenv';

dotenv.config();

const configurePassport = () => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:5000/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ where: { googleId: profile.id } });
            if (!user) {
                const userProfile = {
                    googleId: profile.id,
                    email: profile.emails[0].value,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName
                };
                // console.log('Creating new user with profile:', userProfile);
                user = await User.create(userProfile);
            }
            done(null, user);
        } catch (error) {
            console.error('Error during user creation:', error);
            done(error, false);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findByPk(id);
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });
};

export default configurePassport;
