import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import { Head, fmtLocale, store } from '@moonwalker/lifesupport';
import Layout from './components/layout';

import './styles/html5reset-1.6.1.css';
import './styles/style.css';

import config from './config';
import routes from './routes';
import views from './views';

const routeMap = () => {
  const siteSettingId = store.get('siteSettingId') || '35UnSWWbR6IuywWEKYKMUw';
  const market = store.get('market') || 'SE';
  return routes.map((route, idx) => {
    const View = views[route.view];
    return (
      <Route
        key={idx}
        {...route}
        render={(props) => {
          const locale = fmtLocale(props.match.params.lang);
          const { pathname } = props.location;
          const routeParams = props.match.params || {};
          const routeArgs = route.params || {};
          return (
            <Layout locale={locale} pathname={pathname}>
              <Head
                locale={locale}
                pathname={pathname}
                viewType={route.view}
                siteSettingId={siteSettingId}
                marketCode={market}
              />
              <View locale={locale} pathname={pathname} routeParams={routeParams} {...routeArgs} />
            </Layout>
          );
        }}
      />
    );
  });
};

export class App extends Component {
  render() {
    return <Switch>{routeMap()}</Switch>;
  }
}
