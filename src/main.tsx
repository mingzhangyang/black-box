import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import PrivacyPolicy from './PrivacyPolicy.tsx';
import { getInitialLanguage } from './browserI18n';
import { parseRoute } from './siteLanguage';
import './index.css';

const route = parseRoute(window.location.pathname);
const initialLang = getInitialLanguage(window.location.pathname);
const isPrivacy = route?.page === 'privacy';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isPrivacy
      ? <PrivacyPolicy initialLang={initialLang} />
      : <App initialLang={initialLang} initialShareId={route?.page === 'share' ? route.shareId : undefined} />}
  </StrictMode>,
);
