"use strict";

var _react = _interopRequireDefault(require("react"));
var _reactDom = _interopRequireDefault(require("react-dom"));
var _axios = _interopRequireDefault(require("axios"));
var _reactRedux = require("react-redux");
var _store = _interopRequireDefault(require("./store"));
var _i18next = _interopRequireDefault(require("i18next"));
var _reactI18next = require("react-i18next");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
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
_i18next["default"].use(_reactI18next.initReactI18next).init({
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
        "delete": 'Delete'
      }
    },
    fr: {
      translation: {
        hello: 'Bonjour',
        crudOperations: 'Opérations CRUD',
        name: 'Nom:',
        email: 'Courriel:',
        create: 'Créer',
        update: 'Mettre à jour',
        "delete": 'Supprimer'
      }
    }
  }
});
var socket = new WebSocket('ws://localhost:8080');
socket.onmessage = function (event) {
  console.log("Received message => ".concat(event.data));
  // Update the UI with the received message
};
socket.onopen = function () {
  console.log('Connected to the WebSocket server');
};
socket.onclose = function () {
  console.log('Disconnected from the WebSocket server');
};
socket.onerror = function (error) {
  console.log('Error occurred');
};
var linkedinLogin = function linkedinLogin() {
  window.location.href = '/auth/linkedin';
};
var googleLogin = function googleLogin() {
  window.location.href = '/auth/google';
};
var Crud = function Crud() {
  var _React$useState = _react["default"].useState([]),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    users = _React$useState2[0],
    setUsers = _React$useState2[1];
  var _React$useState3 = _react["default"].useState(''),
    _React$useState4 = _slicedToArray(_React$useState3, 2),
    name = _React$useState4[0],
    setName = _React$useState4[1];
  var _React$useState5 = _react["default"].useState(''),
    _React$useState6 = _slicedToArray(_React$useState5, 2),
    email = _React$useState6[0],
    setEmail = _React$useState6[1];
  var _React$useState7 = _react["default"].useState('en'),
    _React$useState8 = _slicedToArray(_React$useState7, 2),
    language = _React$useState8[0],
    setLanguage = _React$useState8[1];
  var _React$useState9 = _react["default"].useState(false),
    _React$useState0 = _slicedToArray(_React$useState9, 2),
    highContrastMode = _React$useState0[0],
    setHighContrastMode = _React$useState0[1];
  _react["default"].useEffect(function () {
    _axios["default"].get('/api/users').then(function (response) {
      setUsers(response.data);
    })["catch"](function (error) {
      console.error(error);
    });
  }, []);
  var createUser = function createUser(e) {
    e.preventDefault();
    var nameValue = document.getElementById('name').value;
    var emailValue = document.getElementById('email').value;
    _axios["default"].post('/api/users', {
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
    _axios["default"].put("/api/users/".concat(id), {
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
    _axios["default"]["delete"]("/api/users/".concat(id)).then(function (response) {
      console.log('Delete response:', response);
      setUsers(users.filter(function (user) {
        return user._id !== id;
      }));
    })["catch"](function (error) {
      console.error('Delete error:', error);
    });
  };
  var translateToFrench = function translateToFrench() {
    setLanguage('fr');
  };
  var toggleHighContrastMode = function toggleHighContrastMode() {
    setHighContrastMode(!highContrastMode);
  };
  return /*#__PURE__*/_react["default"].createElement('div', {
    style: highContrastMode ? {
      backgroundColor: 'black',
      color: 'white'
    } : {}
  }, /*#__PURE__*/_react["default"].createElement('button', {
    onClick: translateToFrench
  }, _i18next["default"].t('translation.translateToFrench')), /*#__PURE__*/_react["default"].createElement('button', {
    onClick: toggleHighContrastMode
  }, _i18next["default"].t('translation.toggleHighContrastMode')), /*#__PURE__*/_react["default"].createElement('h1', null, _i18next["default"].t('translation.crudOperations')), /*#__PURE__*/_react["default"].createElement('form', {
    onSubmit: createUser
  }, /*#__PURE__*/_react["default"].createElement('label', null, _i18next["default"].t('translation.name')), /*#__PURE__*/_react["default"].createElement('input', {
    type: 'text',
    id: 'name'
  }), /*#__PURE__*/_react["default"].createElement('br', null), /*#__PURE__*/_react["default"].createElement('label', null, _i18next["default"].t('translation.email')), /*#__PURE__*/_react["default"].createElement('input', {
    type: 'email',
    id: 'email'
  }), /*#__PURE__*/_react["default"].createElement('br', null), /*#__PURE__*/_react["default"].createElement('button', {
    type: 'submit'
  }, _i18next["default"].t('translation.create'))), /*#__PURE__*/_react["default"].createElement('ul', null, users.map(function (user) {
    return /*#__PURE__*/_react["default"].createElement('li', {
      key: user._id
    }, /*#__PURE__*/_react["default"].createElement('span', null, "".concat(user.name, " (").concat(user.email, ")")), /*#__PURE__*/_react["default"].createElement('form', {
      onSubmit: function onSubmit(e) {
        e.preventDefault();
        updateUser(user._id);
      }
    }, /*#__PURE__*/_react["default"].createElement('input', {
      type: 'text',
      id: "name-".concat(user._id),
      defaultValue: user.name
    }), /*#__PURE__*/_react["default"].createElement('input', {
      type: 'email',
      id: "email-".concat(user._id),
      defaultValue: user.email
    }), /*#__PURE__*/_react["default"].createElement('button', {
      type: 'submit'
    }, _i18next["default"].t('translation.update'))), /*#__PURE__*/_react["default"].createElement('button', {
      onClick: function onClick() {
        return deleteUser(user._id);
      }
    }, _i18next["default"].t('translation.delete')));
  })));
};
var App = function App() {
  var _React$useState1 = _react["default"].useState(false),
    _React$useState10 = _slicedToArray(_React$useState1, 2),
    isLoggedIn = _React$useState10[0],
    setIsLoggedIn = _React$useState10[1];
  var _React$useState11 = _react["default"].useState(null),
    _React$useState12 = _slicedToArray(_React$useState11, 2),
    loginCode = _React$useState12[0],
    setLoginCode = _React$useState12[1];
  _react["default"].useEffect(function () {
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('code')) {
      setLoginCode(urlParams.get('code'));
      setIsLoggedIn(true);
    }
  }, []);
  return /*#__PURE__*/_react["default"].createElement('div', null, !isLoggedIn && /*#__PURE__*/_react["default"].createElement('div', {
    className: 'container'
  }, /*#__PURE__*/_react["default"].createElement('h1', null, 'Social Media Login'), /*#__PURE__*/_react["default"].createElement('button', {
    id: 'linkedin-login',
    onClick: linkedinLogin
  }, 'Login with LinkedIn'), /*#__PURE__*/_react["default"].createElement('button', {
    id: 'google-login',
    onClick: googleLogin
  }, 'Login with Google')), isLoggedIn && loginCode === 'linkedin' && /*#__PURE__*/_react["default"].createElement(Crud, null), isLoggedIn && loginCode === 'google' && /*#__PURE__*/_react["default"].createElement(Crud, null));
};
_reactDom["default"].render(/*#__PURE__*/_react["default"].createElement(_reactRedux.Provider, {
  store: _store["default"]
}, /*#__PURE__*/_react["default"].createElement(App, null)), document.getElementById('root'));
