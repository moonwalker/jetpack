const async = require('async')
const fetch = require('isomorphic-fetch')

const getSitemapRoutes = (pathLocales, product) => {
  const localeRegexp = new RegExp('^/([a-z]{2}(-[a-z]{2})?)(.*)');
  return function(sitemap, cb) {
    async.map(sitemap.localeRoutes, (r, rCb) => {
      const localeMatch = r.match(localeRegexp);
      const locale = localeMatch[1];
      const path = `/${localeMatch[3]}/`.replace(/\/\//g, '\/');
      const locales = pathLocales[path].filter(l => (l !== locale));
      rCb(null, { path: r, market: sitemap.marketObj, pathLocales: locales, domain: sitemap.domain, title: sitemap.title, description: sitemap.description, apiKeys: JSON.parse(product.apiKeys) });
    }, (_, routes) => {
      cb(null, routes);
    })
  }
}

module.exports = (apiUrl, product) => {
  const payload = {
    query: `{ sitemap(product: "${product}", includeLocale: true, includeNotfound: true, includeExcluded: true) { sitemaps { marketObj { code, defaultLanguage } localeRoutes } product { apiKeys } routeLocales { route, locales } } }`
  }

  const params = {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json'
    }
  }

  console.log('>>>', params.method, params.body)

  return fetch(apiUrl, params)
    .then(res => {
      if (res.ok) {
        return res.json()
      }
      console.log('>>> ERR:', res.status, res.statusText)
      throw new Error('faulty response')
    })
    .then(json => {
      if (json && json.data && json.data.sitemap) {
        return json.data.sitemap
      }
      console.log('>>> ERR:', json)
      throw new Error('invalid response format')
    })
    .then(sitemap => {
      return new Promise(resolve => {
        const pathLocales = {};
        async.forEach(sitemap.routeLocales, (r, rCb) => {
          pathLocales[r.route] = r.locales;
          rCb();
        }, () => {
          async.concat(sitemap.sitemaps, getSitemapRoutes(pathLocales, sitemap.product), (_, routes) => {
            resolve(routes);
          })
        })
      })
    })
}
