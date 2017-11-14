const fetch = require('isomorphic-fetch')

const reducer = (acc, val) => {
  const routes = val.routes.map(r => {
    return { path: r, market: val.market, domain: val.domain, title: val.title, description: val.description }
  })
  return acc.concat(routes)
}

module.exports = (apiUrl, product) => {
  return () => {
    const query = encodeURIComponent(`{sitemap(product:"${product}",includeLocale:true){market,routes}}`)
    return fetch(`${apiUrl}?query=${query}`)
      .then(res => res.json())
      .then(json => json.data.sitemap)
      .then(sitemap => {
        if (!sitemap) throw new Error('sitemap is empty!')
        return sitemap.reduce(reducer, [])
      })
  }
}
