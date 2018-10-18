const async = require('async');
const fetch = require('isomorphic-fetch');
const xmlbuilder = require('xmlbuilder');

const { debug } = require('../utils');

const log = debug('sitemap');

// add all routes per locale and alternates from routelocale
const addLocale = (xml, topLoc, routes, routeLocales) => (l, lCb) => {
  process.nextTick(() => {
    async.forEach(routes, addUrls(xml, topLoc, l.toLowerCase(), routeLocales), lCb);
  });
};

const addUrls = (xml, topLoc, locale, routeLocales) => (route, rCb) => {
  const loc = `${topLoc}${locale}${route.toLowerCase()}`;
  const url = xml.ele('url')
    .ele('loc', loc).up();
  async.forEach((routeLocales[route] || []), addLink(url, topLoc, route), () => {
    url.up();
    rCb();
  });
};

const addLink = (url, topLoc, route) => (l, lCb) => {
  const altLoc = `${topLoc}${l.toLowerCase()}${route.toLowerCase()}`;
  url.ele('xhtml:link')
    .att('rel', 'alternate')
    .att('hreflang', l)
    .att('href', altLoc);
  lCb();
};

const getSitemaps = (apiUrl, product) => {
  const payload = {
    query: `{
      sitemap(product: "${product}") {
        sitemaps {
          market,
          domain,
          routes,
          locales
        }
        routeLocales {
          route,
          locales
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

const generateMainSitemap = (sitemap) => {
  if (!(sitemap.sitemaps && sitemap.sitemaps.length)) return '';

  const mainXml = xmlbuilder.create('sitemapindex', { version: '1.0', encoding: 'utf-8' })
    .att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
    .att('xmlns:xhtml', 'http://www.w3.org/1999/xhtml');
  const lastmod = new Date().toISOString().replace('Z', '+00:00');

  sitemap.sitemaps.forEach((market) => {
    mainXml.ele('sitemap')
      .ele('loc', `https://${market.domain.toLowerCase()}/sitemap-${market.market.toLowerCase()}.xml`).up()
      .ele('lastmod', lastmod)
      .up()
      .up();
  });

  return mainXml.end({ pretty: true });
};

const generateMarketSitemap = (market, sitemapRouteLocales, callback) => {
  const routeLocales = {};

  sitemapRouteLocales.forEach((rl) => {
    routeLocales[rl.route] = rl.locales;
  });

  const topLoc = `https://${market.domain.toLowerCase()}/`;

  const xml = xmlbuilder.create('urlset', { version: '1.0', encoding: 'utf-8' })
    .att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
    .att('xmlns:xhtml', 'http://www.w3.org/1999/xhtml');

  async.forEach(market.locales, addLocale(xml, topLoc, market.routes, routeLocales), () => {
    callback(null, xml.end({ pretty: true }));
  });
};

module.exports = {
  getSitemaps,
  generateMainSitemap,
  generateMarketSitemap
};
