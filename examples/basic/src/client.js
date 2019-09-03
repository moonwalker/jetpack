import React from 'react';
import { hydrate } from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter as Router } from 'react-router-dom';
import { initApollo, regSvcWorker, store } from '@moonwalker/lifesupport';
import config from './config';

const initState = window.__INIT_STATE__ || {};

store.init(initState[config.appStateKey], {
  market: config.defaultMarket,
  siteSettingId: config.defaultSiteSettingId,
  queryApiUrl: config.queryApiUrl,
  defaultLocale: config.defaultLocale
});

const client = initApollo(initState[config.apolloStateKey]);

const Main = () => {
  const { App } = require('./app');
  return (
    <ApolloProvider client={client}>
      <Router>
        <App />
      </Router>
    </ApolloProvider>
  );
};

const init = () => {
  hydrate(<Main />, document.getElementById('root'));
};

if (module.hot) {
  module.hot.accept('./app', () => requestAnimationFrame(init));
}

init();
regSvcWorker();
