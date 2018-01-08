const async = require('async')
const fetch = require('isomorphic-fetch')

const getReducer = (pathLocales, localeRegexp) => {
  return function (acc, val) {
    const routes = val.routes.map(r => {
      const path = r.match(localeRegexp)[3]
      return { path: r, market: val.market, pathLocales: pathLocales[path], domain: val.domain, title: val.title, description: val.description }
    })
    return acc.concat(routes)
  }
}

module.exports = (apiUrl, product) => {
  const payload = {
    query: `{ sitemap(product: "${product}", includeLocale: true, includeNotfound: true) { market, routes } }`
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
        const localeRegexp = new RegExp('^/([a-z]{2}(-[a-z]{2})?)(.*)');
        const pathLocaleMap = {}
        async.forEach(sitemap, (stm, sCb) => {
          async.forEach(stm.routes, (route, rCb) => {
            const localeMatch = route.match(localeRegexp)
            if (!localeMatch || !localeMatch.length) return rCb()
            const locale = localeMatch[1]
            const path = localeMatch[3]
            if (!pathLocaleMap[path])
              pathLocaleMap[path] = []

            if (pathLocaleMap[path].indexOf(locale) === -1)
              pathLocaleMap[path].push(locale)
            rCb()
          }, sCb)
        }, () => {
          resolve(sitemap.reduce(getReducer(pathLocaleMap, localeRegexp), []))
        })
      })
    })
}
