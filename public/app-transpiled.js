(() => {
  // public/app.js
  var React = window.React;
  var ReactDOM = window.ReactDOM;
  var axios = window.axios;
  var i18n = window.i18next;
  var { initReactI18next } = window.reactI18next;
  i18n.use(initReactI18next).init({
    lng: "en",
    resources: {
      en: {
        translation: {
          hello: "Hello",
          crudOperations: "CRUD Operations",
          name: "Name:",
          email: "Email:",
          create: "Create",
          update: "Update",
          delete: "Delete",
          translateToFrench: "Translate to French",
          toggleHighContrastMode: "Toggle High Contrast Mode"
        }
      },
      fr: {
        translation: {
          hello: "Bonjour",
          crudOperations: "Op\xE9rations CRUD",
          name: "Nom:",
          email: "Courriel:",
          create: "Cr\xE9er",
          update: "Mettre \xE0 jour",
          delete: "Supprimer",
          translateToFrench: "Traduire en fran\xE7ais",
          toggleHighContrastMode: "Activer/d\xE9sactiver le contraste \xE9lev\xE9"
        }
      }
    }
  });
  var socket = new WebSocket("ws://localhost:8080");
  socket.onmessage = (event) => {
    console.log(`Received message => ${event.data}`);
  };
  socket.onopen = () => {
    console.log("Connected to the WebSocket server");
  };
  socket.onclose = () => {
    console.log("Disconnected from the WebSocket server");
  };
  socket.onerror = (error) => {
    console.log("Error occurred");
  };
  var linkedinLogin = () => {
    window.location.href = "/auth/linkedin";
  };
  var googleLogin = () => {
    window.location.href = "/auth/google";
  };
  var Crud = () => {
    const [users, setUsers] = React.useState([]);
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [language, setLanguage] = React.useState("en");
    const [highContrastMode, setHighContrastMode] = React.useState(false);
    React.useEffect(() => {
      axios.get("/api/users").then((response) => {
        setUsers(response.data);
      }).catch((error) => {
        console.error(error);
      });
    }, []);
    const createUser = (e) => {
      e.preventDefault();
      const nameValue = document.getElementById("name").value;
      const emailValue = document.getElementById("email").value;
      axios.post("/api/users", { name: nameValue, email: emailValue }).then((response) => {
        setUsers([...users, response.data]);
        document.getElementById("name").value = "";
        document.getElementById("email").value = "";
      }).catch((error) => {
        console.error(error);
      });
    };
    const updateUser = (id) => {
      const nameValue = document.getElementById(`name-${id}`).value;
      const emailValue = document.getElementById(`email-${id}`).value;
      console.log("Updating user with ID:", id);
      console.log("Name:", nameValue);
      console.log("Email:", emailValue);
      axios.put(`/api/users/${id}`, { name: nameValue, email: emailValue }).then((response) => {
        console.log("Update response:", response);
        setUsers(users.map((user) => user._id === id ? response.data : user));
      }).catch((error) => {
        console.error("Update error:", error);
      });
    };
    const deleteUser = (id) => {
      console.log("Deleting user with ID:", id);
      axios.delete(`/api/users/${id}`).then((response) => {
        console.log("Delete response:", response);
        setUsers(users.filter((user) => user._id !== id));
      }).catch((error) => {
        console.error("Delete error:", error);
      });
    };
    const translateToFrench = () => {
      i18n.changeLanguage("fr");
    };
    const toggleHighContrastMode = () => {
      setHighContrastMode(!highContrastMode);
    };
    return React.createElement(
      "div",
      { style: highContrastMode ? { backgroundColor: "black", color: "white" } : {} },
      React.createElement(
        "button",
        { onClick: translateToFrench },
        i18n.t("translation.translateToFrench")
      ),
      React.createElement(
        "button",
        { onClick: toggleHighContrastMode },
        i18n.t("translation.toggleHighContrastMode")
      ),
      React.createElement("h1", null, i18n.t("translation.crudOperations")),
      React.createElement(
        "form",
        { onSubmit: createUser },
        React.createElement("label", null, i18n.t("translation.name")),
        React.createElement("input", { type: "text", id: "name" }),
        React.createElement("br", null),
        React.createElement("label", null, i18n.t("translation.email")),
        React.createElement("input", { type: "email", id: "email" }),
        React.createElement("br", null),
        React.createElement("button", { type: "submit" }, i18n.t("translation.create"))
      ),
      React.createElement(
        "ul",
        null,
        users.map((user) => React.createElement(
          "li",
          { key: user._id },
          React.createElement("span", null, `${user.name} (${user.email})`),
          React.createElement(
            "form",
            { onSubmit: (e) => {
              e.preventDefault();
              updateUser(user._id);
            } },
            React.createElement("input", { type: "text", id: `name-${user._id}`, defaultValue: user.name }),
            React.createElement("input", { type: "email", id: `email-${user._id}`, defaultValue: user.email }),
            React.createElement("button", { type: "submit" }, i18n.t("translation.update"))
          ),
          React.createElement("button", { onClick: () => deleteUser(user._id) }, i18n.t("translation.delete"))
        ))
      )
    );
  };
  var App = () => {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [loginCode, setLoginCode] = React.useState(null);
    React.useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("code")) {
        setLoginCode(urlParams.get("code"));
        setIsLoggedIn(true);
      }
    }, []);
    return React.createElement(
      "div",
      null,
      !isLoggedIn && React.createElement(
        "div",
        { className: "container" },
        React.createElement("h1", null, "Social Media Login"),
        React.createElement("button", { id: "linkedin-login", onClick: linkedinLogin }, "Login with LinkedIn"),
        React.createElement("button", { id: "google-login", onClick: googleLogin }, "Login with Google")
      ),
      isLoggedIn && loginCode === "linkedin" && React.createElement(Crud, null),
      isLoggedIn && loginCode === "google" && React.createElement(Crud, null)
    );
  };
  ReactDOM.render(React.createElement(
    App,
    null
  ), document.getElementById("root"));
})();
