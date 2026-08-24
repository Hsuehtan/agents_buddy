import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { applyOemShellTheme } from './config/apply-oem-theme';
import { applyOemBrandMetadata } from './config/oem-brand';
import { I18nProvider } from './i18n';
import './styles.css';
import './oem-shell.css';

applyOemBrandMetadata();
applyOemShellTheme();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </React.StrictMode>,
);
