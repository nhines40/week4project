import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ApiCrud from './components/ApiCrud';
import { useTranslation } from 'react-i18next';


function App() {
    const { t } = useTranslation();
  return (
    <BrowserRouter>
      <div>
        <h1>{t('hello')}</h1>
        <button onClick={() => console.log('Switch to French')}>{t('switchToFrench')}</button>
      </div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/api" element={<ApiCrud />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
