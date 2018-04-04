const async = require('async')
const fetch = require('isomorphic-fetch')
const xmlbuilder = require('xmlbuilder')
const log = require('debug')('jetpack:build:sitemap');

module.exports = (apiUrl, product) => {
  const payload = {
    query: `{ sitemap(product: "${product}") { sitemaps { market, domain, routes, locales } routeLocales { route, locales } } }`
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
        smGenerate(sitemap, resolve)
      })
    })
}

const smGenerate = (sitemap, callback) => {

  if (!(sitemap.sitemaps && sitemap.sitemaps.length)) return;

  const domain = sitemap.sitemaps[0].domain;
  const topLoc = `https://${domain}/`;

  let xml = xmlbuilder.create('urlset', { version: '1.0', encoding: 'utf-8' })
    .att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
    .att('xmlns:xhtml', 'http://www.w3.org/1999/xhtml')
    .ele('url')
    .ele('loc', topLoc).up()
    .up();

  async.forEach(sitemap.routeLocales, addRoute(xml, topLoc), () => {
    callback([{
      filename: `sitemap.xml`,
      content: xml.end({ pretty: true })
    }]);
  });
}

const addRoute = (xml, topLoc) => {
  return (rl, rlCb) => {
    async.forEach(rl.locales, addUrl(xml, topLoc, rl), rlCb);
  }
}
const addUrl = (xml, topLoc, rl) => {
  return (locale, locCb) => {
    const loc = `${topLoc}${locale}${rl.route}`
    const url = xml.ele('url')
      .ele('loc', loc).up();
    async.forEach(rl.locales, addLink(url, topLoc, rl.route), () => {
      url.up();
      locCb();
    });
  };
}
const addLink = (url, topLoc, route) => {
  return (l, lCb) => {
    const altLoc = `${topLoc}${l}${route}`;
    url.ele('xhtml:link')
      .att('rel', 'alternate')
      .att('hreflang', l)
      .att('href', altLoc);
    lCb();
  }
}
