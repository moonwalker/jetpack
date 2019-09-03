import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter as Router, matchPath } from 'react-router';

import {
  ApolloProvider,
  fetchRoutes,
  flushHead,
  getDataFromTree,
  initApollo,
  store
} from '@moonwalker/lifesupport';
import { App } from './app';
import config from './config';
import views from './views';

export default async ({ route, assets }) => {
  const preState = {
    marketCode: route.market.code || config.defaultMarket,
    queryApiUrl: config.queryApiUrl,
    defaultLocale: route.market.defaultLanguage || config.defaultLocale,
    pathLocales: route.pathLocales || config.pathLocales,
    apiKeys: route.apiKeys || { webfontConfig: { google: { families: [`${config.webfonts}`] } } }
  };

  // store
  store.init(preState);

  // apollo
  const client = initApollo(preState);

  // routes
  const routes = await fetchRoutes(
    client,
    route.market.code,
    route.locale || route.market.defaultLanguage
  );
  store.set('routes', routes);

  // render
  const context = {};
  process.stdout.clearLine();
  process.stdout.write(`>>> render: ${route.path}\r`);
  const appMarkup = await renderToStringWithData(
    <ApolloProvider client={client}>
      <Router location={route.path} context={context}>
        <App routes={routes} />
      </Router>
    </ApolloProvider>
  );

  // state
  const initState = {
    [config.appStateKey]: store.state(), // app
    [config.apolloStateKey]: client.cache.extract() // apollo
  };

  // head
  const head = flushHead();

  // assets
  const view = getRouteView(routes, route);
  if (!view || !views[view]) return null;

  const { chunkName } = views[view];
  const cssChunks = getCssChunks({ assets, chunkName });

  return template({
    head,
    assets,
    chunkName,
    appMarkup,
    initState,
    cssChunks
  });
};

const renderToStringWithData = (component) => {
  return getDataFromTree(component).then(() => renderToString(component));
};

const getRouteView = (routes, route) => {
  for (const r of routes) {
    const match = matchPath(route.path, {
      path: r.path,
      exact: true
    });
    if (match) {
      return r.view;
    }
  }
};

const getCssChunks = ({ assets, chunkName }) => {
  return Object.keys(assets).reduce((res, key) => {
    if (assets[key].css) {
      res[key] = {
        css: assets[key].css
      };
    }
    return res;
  }, {});
};

const template = ({ head, assets, chunkName, appMarkup, initState, cssChunks }) => {
  return `
    <!doctype html>
    <html lang="${head.lang}">
      <head>
        <title>${head.title}</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3bbe21" />
        ${head.meta.join('\n')}
        <meta property="og:site_name" content="${head.siteName}" />
        <meta property="og:url" content="${head.url}" />
        <meta property="og:type" content="website" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="icon" sizes="192x192" href="/icons/android-chrome-192x192.png">
        <link rel="preload" as="script" href="${assets.manifest.js}">
        <link rel="preload" as="script" href="${assets.vendor.js}">
        <link rel="preload" as="script" href="${assets.main.js}">
        ${
          !assets[chunkName]
            ? ''
            : `<link rel="preload" as="script" href="${assets[chunkName].js}">`
        }
        <style id="main">${assets.main.style}</style>
        ${
          !assets[chunkName]
            ? ''
            : assets[chunkName].style
            ? `<style id="${chunkName}.css">${assets[chunkName].style}</style>`
            : ''
        }
      </head>
      <body>
        <div id="root">${appMarkup}</div>
        <script>
        !function(){window.PostMessage=window.PostMessage||function(){(window.PostMessage.queue=window.PostMessage.queue||[]).push({message:{type:arguments[0],data:arguments[1]},origin:arguments[2]})},window.addEventListener("message",function(e){var s=function(e){try{var s=JSON.parse(e);if("object"==typeof s)return s}catch(e){}return!1}(e.data);s&&PostMessage(s.type,s.data,e.source)})}();
        </script>
        <script>
          window.__INIT_STATE__ = ${stringify(initState)}
          window.__CSS_CHUNKS__ = ${stringify(cssChunks)}
        </script>
        <script defer src="${assets.manifest.js}"></script>
        <script defer src="${assets.vendor.js}"></script>
        <script defer src="${assets.main.js}"></script>
        <script defer src="${assets.webfonts.js}"></script>
        <script defer src="${assets.segment.js}"></script>
      </body>
    </html>`;
};

const stringify = (value) => {
  return JSON.stringify(value).replace(/</g, '\\u003c');
};
