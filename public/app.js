const axios = window.axios;
const React = window.React;
const ReactDOM = window.ReactDOM;

// Function to handle LinkedIn login
function linkedinLogin() {
  window.location.href = ' /auth/linkedin';
}
npx babel --presets @babel/preset-react,@babel/preset-env public/app.js --out-file public/app-transpiled.js


// Function to handle Google login
function googleLogin() {
  window.location.href = '/auth/google';
}

function Crud() {
  const [users, setUsers] = React.useState([]);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');

  React.useEffect(() => {
    axios.get('/api/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const createUser = () => {
    axios.post('/api/users', { name, email })
      .then(response => {
        setUsers([...users, response.data]);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const updateUser = (id) => {
    axios.put(`/api/users/${id}`, { name, email })
      .then(response => {
        setUsers(users.map(user => user._id === id ? response.data : user));
      })
      .catch(error => {
        console.error(error);
      });
  };

  const deleteUser = (id) => {
    axios.delete(`/api/users/${id}`)
      .then(response => {
        setUsers(users.filter(user => user._id !== id));
      })
      .catch(error => {
        console.error(error);
      });
  };

  return React.createElement(
    'div',
    null,
    React.createElement('h1', null, 'CRUD Operations'),
    React.createElement('form', null,
      React.createElement('label', null, 'Name:'),
      React.createElement('input', { type: 'text', value: name, onChange: e => setName(e.target.value) }),
      React.createElement('br', null),
      React.createElement('label', null, 'Email:'),
      React.createElement('input', { type: 'email', value: email, onChange: e => setEmail(e.target.value) }),
      React.createElement('br', null),
      React.createElement('button', { onClick: createUser }, 'Create')
    ),
    React.createElement('ul', null,
      users.map(user => React.createElement('li', { key: user._id },
        React.createElement('span', null, `${user.name} (${user.email})`),
        React.createElement('button', { onClick: () => updateUser(user._id) }, 'Update'),
        React.createElement('button', { onClick: () => deleteUser(user._id) }, 'Delete')
      ))
    )
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('code')) {
      setIsLoggedIn(true);
    }
  }, []);

  return React.createElement(
    'div',
    null,
    !isLoggedIn && React.createElement(
      'div',
      { className: 'container' },
      React.createElement('h1', null, 'Social Media Login'),
      React.createElement('button', { id: 'linkedin-login', onClick: linkedinLogin }, 'Login with LinkedIn'),
      React.createElement('button', { id: 'google-login', onClick: googleLogin }, 'Login with Google')
    ),
    isLoggedIn && React.createElement(Crud, null)
  );
}

ReactDOM.render(React.createElement(App, null), document.getElementById('root'));