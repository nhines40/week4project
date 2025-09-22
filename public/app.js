const React = window.React;
const ReactDOM = window.ReactDOM;
const axios = window.axios;
const i18n = window.i18next;
const { initReactI18next } = window.reactI18next;

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
          translateToFrench: 'Translate to French',
          toggleHighContrastMode: 'Toggle High Contrast Mode',
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
          translateToFrench: 'Traduire en français',
          toggleHighContrastMode: 'Activer/désactiver le contraste élevé',
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

  const translateToFrench = i18n.t('translation.translateToFrench');
  const toggleHighContrastModeText = i18n.t('translation.toggleHighContrastMode');
  const crudOperationsText = i18n.t('translation.crudOperations');
  const nameText = i18n.t('translation.name');
  const emailText = i18n.t('translation.email');
  const createText = i18n.t('translation.create');
  const updateText = i18n.t('translation.update');
  const deleteText = i18n.t('translation.delete');

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

  const translateToFrenchHandler = () => {
    i18n.changeLanguage('fr');
  };

  const toggleHighContrastModeHandler = () => {
    setHighContrastMode(!highContrastMode);
  };

  return React.createElement(
    'div',
    { style: highContrastMode ? { backgroundColor: 'black', color: 'white' } : {} },
    React.createElement(
      'button',
      { onClick: translateToFrenchHandler },
      translateToFrench
    ),
    React.createElement(
      'button',
      { onClick: toggleHighContrastModeHandler },
      toggleHighContrastModeText
    ),
    React.createElement('h1', null, crudOperationsText),
    React.createElement('form', { onSubmit: createUser }, 
      React.createElement('label', null, nameText),
      React.createElement('input', { type: 'text', id: 'name' }),
      React.createElement('br', null),
      React.createElement('label', null, emailText),
      React.createElement('input', { type: 'email', id: 'email' }),
      React.createElement('br', null),
      React.createElement('button', { type: 'submit' }, createText)
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
          React.createElement('button', { type: 'submit' }, updateText)
        ),
        React.createElement('button', { onClick: () => deleteUser(user._id) }, deleteText)
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
