const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true });

// Define the User model
const userSchema = new mongoose.Schema({
  facebookId: { type: String, required: true },
  googleId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Configure Passport strategies
passport.use(new FacebookStrategy({
  clientID: 'YOUR_APP_ID',
  clientSecret: 'YOUR_APP_SECRET',
  callbackURL: 'http://localhost:3000/auth/facebook/callback',
}, async (accessToken, refreshToken, profile, cb) => {
  try {
    const user = await User.findOne({ facebookId: profile.id });
    if (!user) {
      const newUser = new User({ facebookId: profile.id, name: profile.displayName });
      await newUser.save();
      return cb(null, newUser);
    } else {
      return cb(null, user);
    }
  } catch (err) {
    console.error(err);
  }
}));

passport.use(new GoogleStrategy({
  clientID: 'YOUR_APP_ID',
  clientSecret: 'YOUR_APP_SECRET',
  callbackURL: 'http://localhost:3001/auth/google/callback',
}, async (accessToken, refreshToken, profile, cb) => {
  try {
    const user = await User.findOne({ googleId: profile.id });
    if (!user) {
      const newUser = new User({ googleId: profile.id, name: profile.displayName });
      await newUser.save();
      return cb(null, newUser);
    } else {
      return cb(null, user);
    }
  } catch (err) {
    console.error(err);
  }
}));

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// Routes
app.post('/api/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).send({ message: 'Invalid email or password' });
    }
    if (user.password !== req.body.password) {
      return res.status(401).send({ message: 'Invalid email or password' });
    }
    return res.send({ message: 'Login successful' });
  } catch (err) {
    console.error(err);
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    return res.send({ message: 'Registration successful' });
  } catch (err) {
    console.error(err);
  }
});

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  res.redirect('/api');
});

app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
  res.redirect('/api');
});

app.listen(3001, () => {
  console.log('Server listening on port 3001');
});
