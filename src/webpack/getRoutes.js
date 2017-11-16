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
    console.log('>>> GET:', `${apiUrl}?query=${query}`)
    return fetch(`${apiUrl}?query=${query}`)
      .then(res => res.json())
      .then(json => json.data.sitemap)
      .then(sitemap => {
        if (!sitemap) {
          console.log('>>> RES:', JSON.stringify(json))
          throw new Error('sitemap is empty!')
        }
        return sitemap.reduce(reducer, [])
      })
  }
}
