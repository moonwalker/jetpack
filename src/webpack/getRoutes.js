const async = require('async')
const fetch = require('isomorphic-fetch')
const log = require('debug')('jetpack:build:app');

const getSitemapRoutes = ({ pathLocales, canonicalLocales }, product) => {
  const localeRegexp = new RegExp('^/([a-z]{2}(-[a-z]{2})?)(.*)');
  return function(sitemap, cb) {
    async.map(sitemap.localeRoutes, (r, rCb) => {
      const localeMatch = r.match(localeRegexp);
      const locale = localeMatch[1];
      const path = `/${localeMatch[3]}/`.replace(/\/\//g, '\/');
      const locales = pathLocales[path].filter(l => (!canonicalLocales[l]));
      const canonicalLocale = canonicalLocales[locale];
      rCb(null, { path: r, market: sitemap.marketObj, pathLocales: locales, domain: sitemap.domain, title: sitemap.title, description: sitemap.description, apiKeys: JSON.parse(product.apiKeys), canonicalLocale });
    }, (_, routes) => {
      cb(null, routes);
    })
  }
}
const reduceAsync = (items, key, value) => {
  return (cb) => {
    const result = {};
    async.forEach(items, (i, aCb) => {
      result[i[key]] = i[value];
      aCb();
    }, () => {
      cb(null, result);
    })
  }
}

module.exports = (apiUrl, product) => {
  const payload = {
    query: `{ sitemap(product: "${product}", includeLocale: true, includeNotfound: true, includeExcluded: true) { sitemaps { marketObj { code, defaultLocale } localeRoutes } product { apiKeys } routeLocales { route, locales } canonicalLocales { locale, canonicalLocale } } }`
  }

  const params = {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json'
    }
  }

  log(params.method, params.body)

  return fetch(apiUrl, params)
    .then(res => {
      if (res.ok) {
        return res.json()
      }
      log('ERR:', res.status, res.statusText)
      throw new Error('faulty response')
    })
    .then(json => {
      if (json && json.data && json.data.sitemap) {
        return json.data.sitemap
      }
      log('ERR:', json)
      throw new Error('invalid response format')
    })
    .then(sitemap => {
      return new Promise(resolve => {
        async.parallel({
          pathLocales: reduceAsync(sitemap.routeLocales, 'route', 'locales'),
          canonicalLocales: reduceAsync(sitemap.canonicalLocales, 'locale', 'canonicalLocale')
        }, (_, res) => {
          async.concat(sitemap.sitemaps, getSitemapRoutes(res, sitemap.product), (_, routes) => {
            resolve(routes);
          })
        })
      })
    })
}
