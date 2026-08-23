import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { applyOemBrandMetadata } from './config/oem-brand';
import { I18nProvider } from './i18n';
import './styles.css';

applyOemBrandMetadata();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </React.StrictMode>,
);
