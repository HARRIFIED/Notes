const express = require('express');
const router = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require("../Models/User");

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK
},
    async function (accessToken, refreshToken, profile, done) {
        const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            profileImage: profile.photos[0].value,
        }
        try {
            let user = await User.findOne({ googleId: profile.id })
            if (user) {
                console.log("user", user)
                done(null, user)
            } else {
                user = await User.create(newUser);
                done(null, user)
            }
        } catch (err) {
            console.log(err)
        }
    }
));

//Login route
router.get('/auth/google',
    passport.authenticate('google', { scope: ['email', 'profile'] }));

//Getting data
router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login-failure',
        successRedirect: '/dashboard'
    }),
);

// Route if something goes wrong
router.get('/login-failure', (req, res) => {
    res.send('Something went wrong...');
});

//Logout
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err)
            res.send("Something went wrong")
        } else {
            res.redirect('/')
        }
    })
})

//Persist user data after success auth
passport.serializeUser(function (user, done) {
    done(null, user.id)
})

//Retreeive data from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});




module.exports = router;
