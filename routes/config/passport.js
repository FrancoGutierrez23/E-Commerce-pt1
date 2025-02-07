const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const authModel = require('../../models/authModel');
require('dotenv').config();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails[0].value;
                const username = profile.displayName;

                // Check if user exists
                let user = await authModel.getUserByUsername(username);
                if (!user.rows.length) {
                    // Create a new user if not exists
                    const result = await authModel.createUser(username, email, null);
                    user = result.rows[0];
                } else {
                    user = user.rows[0];
                }
                done(null, user);
            } catch (error) {
                done(error, null);
            }
        }
    )
);

// Serialize user for session management
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user for session management
passport.deserializeUser(async (id, done) => {
    try {
        const user = await authModel.getUserById(id); // Add `getUserById` to `authModel`
        done(null, user.rows[0]);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;
