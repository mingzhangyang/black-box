import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import PrivacyPolicy from './PrivacyPolicy.tsx';
import './index.css';

const isPrivacy = window.location.pathname === '/privacy';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isPrivacy ? <PrivacyPolicy /> : <App />}
  </StrictMode>,
);
