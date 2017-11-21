const fetch = require('isomorphic-fetch')

module.exports = (apiUrl) => {
  const query = encodeURIComponent(`{generateSitemap(market:"all"){sitemaps}}`)
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
      if (json && json.data && json.data.generatedFiles) {
        return json.data.generatedFiles
      }
      console.log('>>> ERR:', json)
      throw new Error('invalid response format')
    })
    .then(generatedFiles => {
      return generatedFiles
    })
    .catch(err => {
      console.log('>>> ERR:', err)
    })
}
