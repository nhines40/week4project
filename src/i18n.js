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
          login: 'Login',
          register: 'Register',
          api: 'API',
          username: 'Username',
          password: 'Password',
          create: 'Create',
          update: 'Update',
          delete: 'Delete',
          switchToFrench: 'Switch to French',
        },
      },
      fr: {
        translation: {
          hello: 'Bonjour',
          login: 'Connexion',
          register: 'Inscription',
          api: 'API',
          username: 'Nom d\'utilisateur',
          password: 'Mot de passe',
          create: 'Créer',
          update: 'Mettre à jour',
          delete: 'Supprimer',
          switchToFrench: 'Passer en français',
        },
      },
    },
  });

export default i18n;