import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import Layout from './components/layout';
import { fmtLocale } from '@moonwalker/lifesupport';

import './styles/html5reset-1.6.1.css';
import './styles/style.css';

import config from './config'
import routes from './routes';
import views from './views';

const routeMap = () => {
  return routes.map((route, idx) => {
    const View = views[route.view]
    return (
      <Route key={idx} {...route} render={props => {
        const locale = fmtLocale(props.match.params.lang)
        const pathname = props.location.pathname
        const params = props.match.params || {}
        return (
          <Layout locale={locale} pathname={pathname} >
            <View locale={locale} pathname={pathname} params={params}/>
          </Layout>
        )
      }} />
    )
  })
}

export class App extends Component {
  render() {
    return (
      <Switch>
        {routeMap()}
      </Switch>
    )
  }
}