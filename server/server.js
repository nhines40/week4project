const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const app = express();
const https = require('https');

mongoose.connect('mongodb://localhost:27017/myDatabase', { useNewUrlParser: true, useUnifiedTopology: true });

// Mongoose model to represent the user's information
const User = mongoose.model('loginCredentials', {
  name: String,
  email: String,
  linkedinId: String,
  googleId: String,
});

// OAuth credentials
const linkedinClientId = '<linkedin-client-id>';
const linkedinClientSecret = '<linkedin-client-secret>';
const googleClientId = '';
const googleClientSecret = '';

// redirect URLs
const linkedinRedirectUrl = 'http://localhost:3000/auth/linkedin/callback';
const googleRedirectUrl = 'http://localhost:3000/auth/google/callback';

axios.defaults.httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

// API routes
app.get('/api/users', (req, res) => {
  User.find()
    .then(users => {
      res.json(users);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Error fetching users' });
    });
});

app.post('/api/users', (req, res) => {
  const user = new User(req.body);
  user.save()
    .then(() => {
      res.json(user);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Error creating user' });
    });
});

app.put('/api/users/:id', (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(user => {
      res.json(user);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Error updating user' });
    });
});

app.delete('/api/users/:id', (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then(() => {
      res.json({ message: 'User deleted successfully' });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Error deleting user' });
    });
});

// Authentication routes
app.get('/auth/linkedin', (req, res) => {
  const url = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${linkedinClientId}&redirect_uri=${linkedinRedirectUrl}&state=foobar&scope=liteprofile%20emailaddress%20w_member_social`;
  res.redirect(url);
});

app.get('/auth/linkedin/callback', (req, res) => {
  const code = req.query.code;
  const state = req.query.state;

  axios.post(`https://www.linkedin.com/oauth/v2/accessToken`, {
    grant_type: 'authorization_code',
    code: code,
    client_id: linkedinClientId,
    client_secret: linkedinClientSecret,
    redirect_uri: linkedinRedirectUrl,
  })
    .then(response => {
      const accessToken = response.data.access_token;

      return axios.get(`https://api.linkedin.com/v2/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    })
    .then(response => {
      const userProfile = response.data;

      // Store user's profile information in MongoDB database
      const user = new User({
        name: userProfile.firstName + ' ' + userProfile.lastName,
        email: userProfile.emailAddress,
        linkedinId: userProfile.id,
      });
      return user.save();
    })
    .then(() => {
      res.redirect('/?code=linkedin');
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Error logging in with LinkedIn' });
    });
});

app.get('/auth/google', (req, res) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${googleClientId}&redirect_uri=${googleRedirectUrl}&scope=profile%20email`;
  res.redirect(url);
});

app.get('/auth/google/callback', (req, res) => {
  const code = req.query.code;

  axios.post(`https://oauth2.googleapis.com/token`, {
    grant_type: 'authorization_code',
    code: code,
    client_id: googleClientId,
    client_secret: googleClientSecret,
    redirect_uri: googleRedirectUrl,
  })
    .then(response => {
      const accessToken = response.data.access_token;
      return axios.get(`https://openidconnect.googleapis.com/v1/userinfo`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    })
    .then(response => {
      const userProfile = response.data;

      // Store user's profile information in MongoDB database
      const user = new User({
        name: userProfile.name,
        email: userProfile.email,
        googleId: userProfile.sub,
      });
      return user.save();
    })
    .then(() => {
      res.redirect('/?code=google');
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Error logging in with Google' });
    });
});

// Serve static files from the "public" directory
app.use(express.static('public'));

// Start server
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});