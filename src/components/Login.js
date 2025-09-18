import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/api/login', { email, password });
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      window.location.href = 'http://localhost:3000/api/auth/google';
    } catch (error) {
      console.error(error);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      window.location.href = 'http://localhost:3000/api/auth/facebook';
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>{t('login')}</h1>
      <form onSubmit={handleLogin}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">{t('login')}</button>
      </form>
      <button onClick={handleGoogleLogin}>{t('googleLogin')}</button>
      <button onClick={handleFacebookLogin}>{t('facebookLogin')}</button>
    </div>
  );
};

export default Login;