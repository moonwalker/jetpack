const fetch = require('isomorphic-fetch')		
		
module.exports = (launchpadUrl, launchpadToken) => {		
  const endpoint = encodeURIComponent(`/sitemap/generate/all`)		
  
  const token = `BEARER:${launchpadToken}`

  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    }
  }

  return fetch(`${launchpadUrl}${endpoint}`, config)
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