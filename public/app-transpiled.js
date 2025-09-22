"use strict";

function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var axios = window.axios;
var React = window.React;
var ReactDOM = window.ReactDOM;

// Function to handle LinkedIn login
function linkedinLogin() {
  window.location.href = '/auth/linkedin';
}

// Function to handle Google login
function googleLogin() {
  window.location.href = '/auth/google';
}
function Crud() {
  var _React$useState = React.useState([]),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    users = _React$useState2[0],
    setUsers = _React$useState2[1];
  var _React$useState3 = React.useState(''),
    _React$useState4 = _slicedToArray(_React$useState3, 2),
    name = _React$useState4[0],
    setName = _React$useState4[1];
  var _React$useState5 = React.useState(''),
    _React$useState6 = _slicedToArray(_React$useState5, 2),
    email = _React$useState6[0],
    setEmail = _React$useState6[1];
  React.useEffect(function () {
    axios.get('/api/users').then(function (response) {
      setUsers(response.data);
    })["catch"](function (error) {
      console.error(error);
    });
  }, []);
  var createUser = function createUser(e) {
    e.preventDefault();
    var nameValue = document.getElementById('name').value;
    var emailValue = document.getElementById('email').value;
    axios.post('/api/users', {
      name: nameValue,
      email: emailValue
    }).then(function (response) {
      setUsers([].concat(_toConsumableArray(users), [response.data]));
      document.getElementById('name').value = '';
      document.getElementById('email').value = '';
    })["catch"](function (error) {
      console.error(error);
    });
  };
  var updateUser = function updateUser(id) {
    var nameValue = document.getElementById("name-".concat(id)).value;
    var emailValue = document.getElementById("email-".concat(id)).value;
    console.log('Updating user with ID:', id);
    console.log('Name:', nameValue);
    console.log('Email:', emailValue);
    axios.put("/api/users/".concat(id), {
      name: nameValue,
      email: emailValue
    }).then(function (response) {
      console.log('Update response:', response);
      setUsers(users.map(function (user) {
        return user._id === id ? response.data : user;
      }));
    })["catch"](function (error) {
      console.error('Update error:', error);
    });
  };
  var deleteUser = function deleteUser(id) {
    console.log('Deleting user with ID:', id);
    axios["delete"]("/api/users/".concat(id)).then(function (response) {
      console.log('Delete response:', response);
      setUsers(users.filter(function (user) {
        return user._id !== id;
      }));
    })["catch"](function (error) {
      console.error('Delete error:', error);
    });
  };
  return React.createElement('div', null, React.createElement('h1', null, 'CRUD Operations'), React.createElement('form', {
    onSubmit: createUser
  }, React.createElement('label', null, 'Name:'), React.createElement('input', {
    type: 'text',
    id: 'name'
  }), React.createElement('br', null), React.createElement('label', null, 'Email:'), React.createElement('input', {
    type: 'email',
    id: 'email'
  }), React.createElement('br', null), React.createElement('button', {
    type: 'submit'
  }, 'Create')), React.createElement('ul', null, users.map(function (user) {
    return React.createElement('li', {
      key: user._id
    }, React.createElement('span', null, "".concat(user.name, " (").concat(user.email, ")")), React.createElement('form', {
      onSubmit: function onSubmit(e) {
        e.preventDefault();
        updateUser(user._id);
      }
    }, React.createElement('input', {
      type: 'text',
      id: "name-".concat(user._id),
      defaultValue: user.name
    }), React.createElement('input', {
      type: 'email',
      id: "email-".concat(user._id),
      defaultValue: user.email
    }), React.createElement('button', {
      type: 'submit'
    }, 'Update')), React.createElement('button', {
      onClick: function onClick() {
        return deleteUser(user._id);
      }
    }, 'Delete'));
  })));
}
function App() {
  var _React$useState7 = React.useState(false),
    _React$useState8 = _slicedToArray(_React$useState7, 2),
    isLoggedIn = _React$useState8[0],
    setIsLoggedIn = _React$useState8[1];
  var _React$useState9 = React.useState(null),
    _React$useState0 = _slicedToArray(_React$useState9, 2),
    loginCode = _React$useState0[0],
    setLoginCode = _React$useState0[1];
  React.useEffect(function () {
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('code')) {
      setLoginCode(urlParams.get('code'));
      setIsLoggedIn(true);
    }
  }, []);
  return React.createElement('div', null, !isLoggedIn && React.createElement('div', {
    className: 'container'
  }, React.createElement('h1', null, 'Social Media Login'), React.createElement('button', {
    id: 'linkedin-login',
    onClick: linkedinLogin
  }, 'Login with LinkedIn'), React.createElement('button', {
    id: 'google-login',
    onClick: googleLogin
  }, 'Login with Google')), isLoggedIn && loginCode === 'linkedin' && React.createElement(Crud, null), isLoggedIn && loginCode === 'google' && React.createElement(Crud, null));
}
ReactDOM.render(React.createElement(App, null), document.getElementById('root'));
