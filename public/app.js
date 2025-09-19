import axios from 'axios';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom';

// LinkedIn and Google OAuth credentials
const linkedinClientId = '<linkedin-client-id>';
const googleClientId = '<google-client-id>';

// redirect URLs
const linkedinRedirectUrl = 'http://localhost:3000/auth/linkedin/callback';
const googleRedirectUrl = 'http://localhost:3000/auth/google/callback';

// Function to handle LinkedIn login
function linkedinLogin() {
  const url = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${linkedinClientId}&redirect_uri=${linkedinRedirectUrl}&state=foobar&scope=liteprofile%20emailaddress%20w_member_social`;
  window.location.href = url;
}

// Function to handle Google login
function googleLogin() {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${googleClientId}&redirect_uri=${googleRedirectUrl}&scope=profile%20email`;
  window.location.href = url;
}

// Create a React app
const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/crud" component={Crud} />
      </Switch>
    </BrowserRouter>
  );
};

// Login component
const Login = () => {
  return (
    <div>
      <h1>Login</h1>
      <button id="linkedin-login" onClick={linkedinLogin}>Login with LinkedIn</button>
      <button id="google-login" onClick={googleLogin}>Login with Google</button>
    </div>
  );
};

// Crud component
const Crud = () => {
  const [users, setUsers] = React.useState([]);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');

  // Get all users
  React.useEffect(() => {
    axios.get('/api/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  // Create a new user
  const createUser = () => {
    axios.post('/api/users', { name, email })
      .then(response => {
        setUsers([...users, response.data]);
      })
      .catch(error => {
        console.error(error);
      });
  };

  // Update a user
  const updateUser = (id) => {
    axios.put(`/api/users/${id}`, { name, email })
      .then(response => {
        setUsers(users.map(user => user._id === id ? response.data : user));
      })
      .catch(error => {
        console.error(error);
      });
  };

  // Delete a user
  const deleteUser = (id) => {
    axios.delete(`/api/users/${id}`)
      .then(response => {
        setUsers(users.filter(user => user._id !== id));
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <div>
      <h1>CRUD Operations</h1>
      <form>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        <br />
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <br />
        <button onClick={createUser}>Create</button>
      </form>
      <ul>
        {users.map(user => (
          <li key={user._id}>
            {user.name} ({user.email})
            <button onClick={() => updateUser(user._id)}>Update</button>
            <button onClick={() => deleteUser(user._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));