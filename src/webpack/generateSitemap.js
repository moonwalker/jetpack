const fetch = require('isomorphic-fetch')

module.exports = (apiUrl) => {
  return () => {
    const query = encodeURIComponent(`query{{generateSitemap(market:"all"){sitemaps}}}`)
    console.log('>>> GET:', `${apiUrl}?query=${query}`)
    return fetch(`${apiUrl}?query=${query}`)
      .then(res => {
        if (res.ok) {
          return res.json()
        }
        console.log('>>> ERR:', res.status, res.statusText)
      })
      .then(json => {
        if (json && json.data && json.data.generatedSitemap) {
          return json.data.generatedSitemap
        }
        console.log('>>> ERR:', json)
        throw new Error('invalid response format')
      })
      .then(generatedSitemap => {
        return generatedSitemap
      })
      .catch(err => {
        console.log('>>> ERR:', err)
      })
  }
}
