require('dotenv').config();

const http = require('http');
const path = require('path');
const router = require('find-my-way')();

const { debug } = require('../utils');
const { checkBuildArtifacts, processAssets } = require('../prerender/run');
const { paths, config } = require('../webpack/defaults');
const getRoutes = require('../webpack/getRoutes');
const { getSitemaps, generateMarketSitemap, generateMainSitemap } = require('../sitemap');

const PORT = process.env.JETPACK_PRERENDER_PORT || 9002;
const NAMESPACE = 'prerender-server';

const log = debug(NAMESPACE);

// @TODO: extract
log('ENV:', process.env.ENV);
log('API:', config.queryApiUrl);
log('PRD:', config.productName);

const [assetsFilepath, renderFilepath] = checkBuildArtifacts(
  path.join(paths.assets.path, paths.assets.filename),
  paths.render.file
);

const assets = processAssets(assetsFilepath);
const render = require(renderFilepath).default;

const getSitemapHandler = sitemap => (req, res, params) => {
  const routeNamespace = `sitemap:${req.url}`;
  const routeLog = debug(routeNamespace);
  routeLog('Start');

  const data = generateMainSitemap(sitemap);

  routeLog('Done');

  res.setHeader('Content-Type', 'application/xml');
  res.end(data);
};

const getSitemapMarketHandler = sitemap => (req, res, params) => {
  const routeNamespace = `sitemap:${req.url}`;
  const routeLog = debug(routeNamespace);
  routeLog('Start');

  const marketId = params.market.toUpperCase();
  const market = sitemap.sitemaps.find(entry => entry.market === marketId);

  if (!market || !market.domain) {
    // @TODO log + tracking
    res.statusCode = 404;
    return res.end('Page not found');
  }

  generateMarketSitemap(market, sitemap.routeLocales, (err, data) => {
    routeLog('Done');

    if (err) {
      res.statusCode = 500;
      return res.end(err.message);
    }

    res.setHeader('Content-Type', 'application/xml');
    return res.end(data);
  });
};

const getPrerenderRouteHandler = routes => (req, res) => {
  const { url } = req;
  const route = routes.find(item => item.path === url);

  const routeNamespace = `${NAMESPACE}:${url}`;
  const routeLog = debug(routeNamespace);

  routeLog('Start');

  if (!route) {
    routeLog('Done', 'Page not found');
    res.statusCode = 404;
    res.end('Page not found.');
    return;
  }

  render({ route, assets })
    .then((data) => {
      routeLog('Done');
      res.setHeader('Content-Type', 'text/html');
      res.end(data);
    });
};

module.exports.prerenderServer = async () => {
  log('Starting');

  log('Start fetching data.');
  const [routes, sitemap] = await Promise.all([
    getRoutes(config.queryApiUrl, config.productName),
    getSitemaps(config.queryApiUrl, config.productName)
  ]);
  log('Done fetching data.');

  router.on('GET', '/sitemap.xml', getSitemapHandler(sitemap));
  router.on('GET', '/sitemap-:market([a-z]{2,3}).xml', getSitemapMarketHandler(sitemap));
  router.on('GET', '*', getPrerenderRouteHandler(routes));

  const server = http.createServer((req, res) => {
    router.lookup(req, res);
  });

  server.on('clientError', (err, socket) => {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
  });

  server.listen(PORT, () => {
    log('Listening on port ', PORT);
  });
};
