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
function linkedinLogin() {
  window.location.href = 'https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=YOUR_LINKEDIN_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&state=foobar&scope=liteprofile%20emailaddress%20w_member_social';
}
function googleLogin() {
  window.location.href = 'https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=YOUR_GOOGLE_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&scope=profile%20email';
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
  var createUser = function createUser() {
    axios.post('/api/users', {
      name: name,
      email: email
    }).then(function (response) {
      setUsers([].concat(_toConsumableArray(users), [response.data]));
    })["catch"](function (error) {
      console.error(error);
    });
  };
  var updateUser = function updateUser(id) {
    axios.put("/api/users/".concat(id), {
      name: name,
      email: email
    }).then(function (response) {
      setUsers(users.map(function (user) {
        return user._id === id ? response.data : user;
      }));
    })["catch"](function (error) {
      console.error(error);
    });
  };
  var deleteUser = function deleteUser(id) {
    axios["delete"]("/api/users/".concat(id)).then(function (response) {
      setUsers(users.filter(function (user) {
        return user._id !== id;
      }));
    })["catch"](function (error) {
      console.error(error);
    });
  };
  return React.createElement('div', null, React.createElement('h1', null, 'CRUD Operations'), React.createElement('form', null, React.createElement('label', null, 'Name:'), React.createElement('input', {
    type: 'text',
    value: name,
    onChange: function onChange(e) {
      return setName(e.target.value);
    }
  }), React.createElement('br', null), React.createElement('label', null, 'Email:'), React.createElement('input', {
    type: 'email',
    value: email,
    onChange: function onChange(e) {
      return setEmail(e.target.value);
    }
  }), React.createElement('br', null), React.createElement('button', {
    onClick: createUser
  }, 'Create')), React.createElement('ul', null, users.map(function (user) {
    return React.createElement('li', {
      key: user._id
    }, React.createElement('span', null, "".concat(user.name, " (").concat(user.email, ")")), React.createElement('button', {
      onClick: function onClick() {
        return updateUser(user._id);
      }
    }, 'Update'), React.createElement('button', {
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
  React.useEffect(function () {
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('code')) {
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
  }, 'Login with Google')), isLoggedIn && React.createElement(Crud, null));
}
ReactDOM.render(React.createElement(App, null), document.getElementById('root'));
