const async = require('async')
const fetch = require('isomorphic-fetch')
const xmlbuilder = require('xmlbuilder')

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
        smGenerate(sitemap, resolve)
      })
    })
}

const smGenerate = (sitemap, resolve) => {

  if (!(sitemap.sitemaps && sitemap.sitemaps.length)) return;

  let mainXml = xmlbuilder.create('sitemapindex', { version: '1.0', encoding: 'utf-8' })
    .att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
    .att('xmlns:xhtml', 'http://www.w3.org/1999/xhtml');
  const lastmod = new Date().toISOString().replace('Z', '+00:00');

  const routeLocales = {};
  async.forEach(sitemap.routeLocales, (rl, rlCb) => {
    routeLocales[rl.route] = rl.locales;
    rlCb();
  }, () => {
    async.map(sitemap.sitemaps, (market, mCb) => {
      // append to main xml
      mainXml.ele('sitemap')
        .ele('loc', `https://${market.domain}/sitemap-${market.market}.xml`).up()
        .ele('lastmod', lastmod).up()
        .up();
      //generate market xml
      generateMarket(market, routeLocales, mCb);
    }, (_, xmls) => {
      // add main to results
      xmls.push({
        filename: `sitemap.xml`,
        content: mainXml.end({ pretty: true })
      });
      resolve(xmls);
    })
  })
}
const generateMarket = (sitemap, routeLocales, callback) => {
  const topLoc = `https://${sitemap.domain}/`;

  let xml = xmlbuilder.create('urlset', { version: '1.0', encoding: 'utf-8' })
    .att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
    .att('xmlns:xhtml', 'http://www.w3.org/1999/xhtml');

  async.forEach(sitemap.locales, addLocale(xml, topLoc, sitemap.routes, routeLocales), () => {
    callback(null, {
      filename: `sitemap-${sitemap.market}.xml`,
      content: xml.end({ pretty: true })
    });
  });
}

// add all routes per locale and alternates from routelocale
const addLocale = (xml, topLoc, routes, routeLocales) => {
  return (l, lCb) => {
    process.nextTick(() => {
      async.forEach(routes, addUrls(xml, topLoc, l, routeLocales), lCb);
    });
  }
}
const addUrls = (xml, topLoc, locale, routeLocales) => {
  return (route, rCb) => {
    const loc = `${topLoc}${locale}${route}`;
    const url = xml.ele('url')
      .ele('loc', loc).up();
    async.forEach((routeLocales[route] || []), addLink(url, topLoc, route), () => {
      url.up();
      rCb();
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
