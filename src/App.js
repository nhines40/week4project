import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ApiCrud from './components/ApiCrud';
import { useTranslation } from 'react-i18next';
import './App.css';

function App() {
  const { t } = useTranslation();
  return (
        <div className="container">
            <h1>Social Media Login</h1>
            <button className="button" onClick={() => window.location.href = '/auth/linkedin'}>Login with LinkedIn</button>
            <button className="button" onClick={() => window.location.href = '/auth/google'}>Login with Google</button>
        </div>
  );
}

export default App;