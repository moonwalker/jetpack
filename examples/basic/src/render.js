import React from 'react';
import { renderToString } from 'react-dom/server';
import { ApolloProvider, getDataFromTree } from 'react-apollo';
import { StaticRouter as Router, matchPath } from 'react-router';

import { App } from './app';
import { flushHead, initApollo, store } from '@moonwalker/lifesupport';
import config from './config'
import routes from './routes';
import views from './views';

export default async ({ route, assets }) => {
  const preState = {
    market: route.market || config.defaultMarket,
    siteSettingId: route.siteSettingId || config.defaultSiteSettingId,
    queryApiUrl:  config.queryApiUrl,
    defaultLocale: config.defaultLocale
  }

  // store
  store.init(preState)

  // apollo
  const client = initApollo();

  // render
  const context = {};
  const appMarkup = await renderToStringWithData(
    <ApolloProvider client={client}>
      <Router location={route.path} context={context}>
        <App />
      </Router>
    </ApolloProvider>
  );

  // state
  const initState = {
    [config.appStateKey]: store.state(), // app
    [config.apolloStateKey]: client.cache.extract() // apollo
  }

  // head
  const head = flushHead();

  // assets
  const view = getRouteView(route);
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
}

const renderToStringWithData = (component) => {
  return getDataFromTree(component).then(() => renderToString(component))
}

const getRouteView = route => {
  for (let r of routes) {
    const match = matchPath(route.path, {
      path: r.path
    });
    if (match) {
      return r.view || ''
    }
  }
}

const getCssChunks = ({ assets, chunkName }) => {
  return Object.keys(assets).reduce((res, key) => {
    if (assets[key].css) {
      res[key] = {
        css: assets[key].css
      }
    }
    return res;
  }, {});
}

const template = ({ head, assets, chunkName, appMarkup, initState, cssChunks }) => {
  return `
    <!doctype html>
    <html amp lang="${head.lang}">
      <head>
        <title>${head.title}</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3bbe21" />
        <meta name="robots" content="index, nofollow" />
        ${head.meta.join('\n')}
        <meta property="og:site_name" content="${head.siteName}" />
        <meta property="og:url" content="${head.url}" />
        <meta property="og:type" content="website" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="icon" sizes="192x192" href="/icons/android-chrome-192x192.png">
        <link rel="canonical" href="${head.url}" />
        <link rel="preload" as="script" href="${assets.manifest.js}">
        <link rel="preload" as="script" href="${assets.vendor.js}">
        <link rel="preload" as="script" href="${assets.main.js}">
        ${!assets[chunkName] ? '' : `<link rel="preload" as="script" href="${assets[chunkName].js}">`}
        <style id="main">${assets.main.style}</style>
        ${!assets[chunkName] ? '' : assets[chunkName].style ? `<style id="${chunkName}.css">${assets[chunkName].style}</style>` : ''}
      </head>
      <body>
        <div id="root">${appMarkup}</div>
        <script>
          window.__INIT_STATE__ = ${stringify(initState)}
          window.__CSS_CHUNKS__ = ${stringify(cssChunks)}
        </script>
        <script defer src="${assets.manifest.js}"></script>
        <script defer src="${assets.vendor.js}"></script>
        <script defer src="${assets.main.js}"></script>
        <script defer>
          WebFontConfig = {
            google: {
              families: ['${config.webfonts}']
            }
          };
          (function (d) {
            var wf = d.createElement('script'), s = d.scripts[0];
            wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js';
            wf.async = true;
            s.parentNode.insertBefore(wf, s);
          })(document);
        </script>
      </body>
    </html>`;
}

const stringify = (value) => {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
