const fetch = require('isomorphic-fetch')

module.exports = (launchpadUrl, launchpadToken, product) => {
  const url = `${launchpadUrl}/sitemap/generate/${product}`

  const params = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${launchpadToken}`,
    }
  }

  console.log('>>>', params.method, url)
  return fetch(url, params)
    .then(res => {
      if (res.ok) {
        return res.json()
      }
      console.log('>>> ERR:', res.status, res.statusText)
      throw new Error('faulty response')
    })
    .then(json => {
      if (json && json.sitemaps) {
        return json.sitemaps
      }
      console.log('>>> ERR:', json)
      throw new Error('invalid response format')
    })
    .catch(err => {
      console.log('>>> ERR:', err)
    })
}
