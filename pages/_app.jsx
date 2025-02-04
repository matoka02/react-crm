import '../styles/globals.css';
import React, { useEffect } from 'react';
import * as Sentry from '@sentry/react';
import i18n from '../i18n';
import 'dotenv/config';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { store } from '@/stores/store';
import themeDefault from '@/theme-default';


Sentry.init({
  dsn: process.env.SENTRY_DSN_KEY,
  integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
  tracePropagationTargets: [process.env.LOCALHOST, /^https:\/\/yourserver\.io\/api/],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

// eslint-disable-next-line react/prop-types
function MyApp({ Component, pageProps }) {
  useEffect(() => {
    document.documentElement.dir = i18n.dir();
  }, []);

  // eslint-disable-next-line react/jsx-props-no-spreading
  return (
    <Provider store={store}>
      <ThemeProvider theme={themeDefault}>
        <CssBaseline />
        <Component {...pageProps} />;
      </ThemeProvider>
    </Provider>
  );
}

export default MyApp;
