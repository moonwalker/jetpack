import React from 'react';
import { hydrate } from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter as Router } from 'react-router-dom';

import config from './config';
import store from './core/store';
import initApollo from './core/apolloClient';
import regSvcWorker from './core/svcworker-handler';

const initState = window.__INIT_STATE__ || {}

store.init(initState[config.appStateKey], {
  market: config.defaultMarket,
  siteSettingId: config.defaultSiteSettingId
})

const client = initApollo(initState[config.apolloStateKey])

const Main = () => {
  const { App } = require('./app');
  return (
    <ApolloProvider client={client}>
      <Router>
        <App />
      </Router>
    </ApolloProvider>
  )
}

const init = () => {
  hydrate(<Main />, document.getElementById('root'));
}

if (module.hot) {
  module.hot.accept('./app', () => requestAnimationFrame(init));
}

init();
regSvcWorker();
