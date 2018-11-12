const async = require('async');
const fetch = require('isomorphic-fetch');
const xmlbuilder = require('xmlbuilder');

const { debug } = require('../utils');

const log = debug('sitemap');


const addUrls = (xml, topLoc) => (route, rCb) => {
  const loc = `${topLoc}${route.locale.toLowerCase()}${route.path.toLowerCase()}`;
  const url = xml.ele('url')
    .ele('loc', loc).up();
  async.forEach((route.alternates || []), addLink(url, topLoc), () => {
    url.up();
    rCb();
  });
};

const addLink = (url, topLoc) => (a, aCb) => {
  const altLoc = `${topLoc}${a.locale.toLowerCase()}${a.path.toLowerCase()}`;
  url.ele('xhtml:link')
    .att('rel', 'alternate')
    .att('hreflang', a.locale)
    .att('href', altLoc);
  aCb();
};

const getSitemaps = (apiUrl, product) => {
  const payload = {
    query: `{
      sitemap(product: "${product}") {
        sitemaps {
          market {
            code
            localizedSiteSetting {
              domain
            }
          }
          routes {
            path
            locale
            alternates {
              path
              locale
            }
          }
        }
      }
    }`
  };

  const params = {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json'
    }
  };

  log(params.method, params.body);

  return fetch(apiUrl, params)
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
      log('ERR:', res.status, res.statusText);
      throw new Error('faulty response');
    })
    .then((json) => {
      if (json && json.data && json.data.sitemap) {
        return json.data.sitemap;
      }
      log('ERR:', json);
      throw new Error('invalid response format');
    });
};

const generateMainSitemap = (productSitemap) => {
  if (!(productSitemap.sitemaps && productSitemap.sitemaps.length)) return '';

  const mainXml = xmlbuilder.create('sitemapindex', { version: '1.0', encoding: 'utf-8' })
    .att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
    .att('xmlns:xhtml', 'http://www.w3.org/1999/xhtml');
  const lastmod = new Date().toISOString().replace('Z', '+00:00');

  productSitemap.sitemaps.forEach(({ market }) => {
    mainXml.ele('sitemap')
      .ele('loc', `https://${market.localizedSiteSetting.domain.toLowerCase()}/sitemap-${market.code.toLowerCase()}.xml`).up()
      .ele('lastmod', lastmod)
      .up()
      .up();
  });

  return mainXml.end({ pretty: true });
};

const generateMarketSitemap = (marketSitemap, callback) => {
  const { market, routes } = marketSitemap;
  const topLoc = `https://${market.localizedSiteSetting.domain.toLowerCase()}/`;

  const xml = xmlbuilder.create('urlset', { version: '1.0', encoding: 'utf-8' })
    .att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
    .att('xmlns:xhtml', 'http://www.w3.org/1999/xhtml');

  async.forEach(routes, addUrls(xml, topLoc), () => {
    callback(null, xml.end({ pretty: true }));
  });
};

module.exports = {
  getSitemaps,
  generateMainSitemap,
  generateMarketSitemap
};
