const React = window.React;
const ReactDOM = window.ReactDOM;
const axios = window.axios;
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    lng: 'en',
    resources: {
      en: {
        translation: {
          hello: 'Hello',
          crudOperations: 'CRUD Operations',
          name: 'Name:',
          email: 'Email:',
          create: 'Create',
          update: 'Update',
          delete: 'Delete',
        },
      },
      fr: {
        translation: {
          hello: 'Bonjour',
          crudOperations: 'Opérations CRUD',
          name: 'Nom:',
          email: 'Courriel:',
          create: 'Créer',
          update: 'Mettre à jour',
          delete: 'Supprimer',
        },
      },
    },
  });

const socket = new WebSocket('ws://localhost:8080');

socket.onmessage = (event) => {
  console.log(`Received message => ${event.data}`);
  // Update the UI with the received message
};

socket.onopen = () => {
  console.log('Connected to the WebSocket server');
};

socket.onclose = () => {
  console.log('Disconnected from the WebSocket server');
};

socket.onerror = (error) => {
  console.log('Error occurred');
};

const linkedinLogin = () => {
  window.location.href = '/auth/linkedin';
};

const googleLogin = () => {
  window.location.href = '/auth/google';
};

const Crud = () => {
  const [users, setUsers] = React.useState([]);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [language, setLanguage] = React.useState('en');
  const [highContrastMode, setHighContrastMode] = React.useState(false);

  React.useEffect(() => {
    axios.get('/api/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const createUser = (e) => {
    e.preventDefault();
    const nameValue = document.getElementById('name').value;
    const emailValue = document.getElementById('email').value;
    axios.post('/api/users', { name: nameValue, email: emailValue })
      .then(response => {
        setUsers([...users, response.data]);
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
      })
      .catch(error => {
        console.error(error);
      });
  };

  const updateUser = (id) => {
    const nameValue = document.getElementById(`name-${id}`).value;
    const emailValue = document.getElementById(`email-${id}`).value;
    console.log('Updating user with ID:', id);
    console.log('Name:', nameValue);
    console.log('Email:', emailValue);
    axios.put(`/api/users/${id}`, { name: nameValue, email: emailValue })
      .then(response => {
        console.log('Update response:', response);
        setUsers(users.map(user => user._id === id ? response.data : user));
      })
      .catch(error => {
        console.error('Update error:', error);
      });
  };

  const deleteUser = (id) => {
    console.log('Deleting user with ID:', id);
    axios.delete(`/api/users/${id}`)
      .then(response => {
        console.log('Delete response:', response);
        setUsers(users.filter(user => user._id !== id));
      })
      .catch(error => {
        console.error('Delete error:', error);
      });
  };

  const translateToFrench = () => {
    setLanguage('fr');
  };

  const toggleHighContrastMode = () => {
    setHighContrastMode(!highContrastMode);
  };

  return React.createElement(
    'div',
    { style: highContrastMode ? { backgroundColor: 'black', color: 'white' } : {} },
    React.createElement(
      'button',
      { onClick: translateToFrench },
      i18n.t('translation.translateToFrench')
    ),
    React.createElement(
      'button',
      { onClick: toggleHighContrastMode },
      i18n.t('translation.toggleHighContrastMode')
    ),
    React.createElement('h1', null, i18n.t('translation.crudOperations')),
    React.createElement('form', { onSubmit: createUser }, 
      React.createElement('label', null, i18n.t('translation.name')),
      React.createElement('input', { type: 'text', id: 'name' }),
      React.createElement('br', null),
      React.createElement('label', null, i18n.t('translation.email')),
      React.createElement('input', { type: 'email', id: 'email' }),
      React.createElement('br', null),
      React.createElement('button', { type: 'submit' }, i18n.t('translation.create'))
    ),
    React.createElement('ul', null,
      users.map(user => React.createElement('li', { key: user._id },
        React.createElement('span', null, `${user.name} (${user.email})`),
        React.createElement('form', { onSubmit: e => {
          e.preventDefault();
          updateUser(user._id);
        } },
          React.createElement('input', { type: 'text', id: `name-${user._id}`, defaultValue: user.name }),
          React.createElement('input', { type: 'email', id: `email-${user._id}`, defaultValue: user.email }),
          React.createElement('button', { type: 'submit' }, i18n.t('translation.update'))
        ),
        React.createElement('button', { onClick: () => deleteUser(user._id) }, i18n.t('translation.delete'))
      ))
    )
  );
};

const App = () => {
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
};

ReactDOM.render(React.createElement(
  App,
  null
), document.getElementById('root'));
