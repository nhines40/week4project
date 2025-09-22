const axios = window.axios;
const React = window.React;
const ReactDOM = window.ReactDOM;

// Function to handle LinkedIn login
function linkedinLogin() {
  window.location.href = '/auth/linkedin';
}

// Function to handle Google login
function googleLogin() {
  window.location.href = '/auth/google';
}

function Crud() {
  const [users, setUsers] = React.useState([]);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [updateName, setUpdateName] = React.useState('');
  const [updateEmail, setUpdateEmail] = React.useState('');

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
    axios.post('/api/users', { name: name, email: email })
      .then(response => {
        setUsers([...users, response.data]);
        setName('');
        setEmail('');
      })
      .catch(error => {
        console.error(error);
      });
  };

  const updateUser = (id) => {
    axios.put(`/api/users/${id}`, { name: updateName, email: updateEmail })
      .then(response => {
        setUsers(users.map(user => user._id === id ? response.data : user));
        setUpdateName('');
        setUpdateEmail('');
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
        React.createElement('form', { onSubmit: e => {
          e.preventDefault();
          setUpdateName(document.getElementById(`name-${user._id}`).value);
          setUpdateEmail(document.getElementById(`email-${user._id}`).value);
          updateUser(user._id);
        } },
          React.createElement('input', { type: 'text', id: `name-${user._id}`, defaultValue: user.name, onChange: e => setUpdateName(e.target.value) }),
          React.createElement('input', { type: 'email', id: `email-${user._id}`, defaultValue: user.email, onChange: e => setUpdateEmail(e.target.value) }),
          React.createElement('button', { type: 'submit' }, 'Update')
        ),
        React.createElement('button', { onClick: () => deleteUser(user._id) }, 'Delete')
      ))
    )
  );
}


function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [loginCode, setLoginCode] = React.useState(null);

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('code')) {
      setLoginCode(urlParams.get('code'));
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
    isLoggedIn && loginCode === 'linkedin' && React.createElement(Crud, null),
    isLoggedIn && loginCode === 'google' && React.createElement(Crud, null)
  );
}

ReactDOM.render(React.createElement(App, null), document.getElementById('root'));