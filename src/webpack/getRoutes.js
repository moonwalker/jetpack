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
        return sitemap.reduce(reducer, [])
      })
      .catch(err => {
        console.log('>>> ERR:', err)
      })
  }
}
