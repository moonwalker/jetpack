const async = require('async');
const fetch = require('isomorphic-fetch');

const { debug } = require('../utils');

const log = debug('fetch', 'routes');

const getSitemapRoutes = (product) => {
  return function (marketSitemap, cb) {
    async.map(marketSitemap.routes, (route, rCb) => {
      rCb(null, {
        market: marketSitemap.market,
        path: '/' + route.locale + route.path,
        locale: route.locale,
        alternates: route.alternates,
        canonical: route.canonical,
        apiKeys: JSON.parse(product.apiKeys)
      });
    }, (_, routes) => {
      cb(null, routes);
    });
  };
};

module.exports = ({ queryApiUrl, productName }) => {
  const payload = {
    query: `{ sitemap(product: "${productName}", includeLocale: true, includeNotfound: true, includeExcluded: true) { sitemaps { marketObj { code defaultCurrency } localeObjs { code codeAlias } localeRoutes } product { apiKeys } routeLocales { route, locales } canonicalLocales { locale, canonicalLocale } } }`
  };

  const params = {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json'
    }
  };

  log(params.method, params.body);

  return fetch(queryApiUrl, params)
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
      log('ERR:', res.status, res.statusText);
      throw new Error('faulty response');
    })
    .then((json) => {
      if (json && json.data && json.data.sitemap) {
        return json.data.sitemap;
      }
      log('ERR:', json);
      throw new Error('invalid response format');
    })
    .then(sitemap => new Promise((resolve) => {
      async.concat(sitemap.sitemaps, getSitemapRoutes(sitemap.product), (_, routes) => {
        resolve(routes);
      });
    }));
};
