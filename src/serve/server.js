require('dotenv').config();

const http = require('http');
const path = require('path');
const fastify = require('fastify');

const { debug } = require('../utils');
const { checkBuildArtifacts, processAssets } = require('../prerender/run');
const { paths, config } = require('../webpack/defaults');
const getRoutes = require('../webpack/getRoutes');
const { getSitemaps, generateMarketSitemap, generateMainSitemap } = require('../sitemap');

const PORT = process.env.JETPACK_PRERENDER_PORT || 9002;
const NAMESPACE = 'serve';

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

const getSitemapHandler = sitemap => (req, reply) => {
  const routeNamespace = `sitemap:${req.url}`;
  const routeLog = debug(routeNamespace);
  routeLog('Start');

  const data = generateMainSitemap(sitemap);

  routeLog('Done');

  reply
    .header('Content-Type', 'application/xml')
    .send(data);
};

const getSitemapMarketHandler = sitemap => (req, reply) => {
  const routeNamespace = `sitemap:${req.url}`;
  const routeLog = debug(routeNamespace);
  routeLog('Start');

  const marketId = req.params.market.toUpperCase();
  const market = sitemap.sitemaps.find(entry => entry.market === marketId);

  if (!market || !market.domain) {
    // @TODO log + tracking
    reply
      .code(404)
      .send('Page not found');
  }

  generateMarketSitemap(market, sitemap.routeLocales, (err, data) => {
    routeLog('Done');

    if (err) {
      reply
        .code(500)
        .send(err.message);
    }

    reply
      .header('Content-Type', 'application/xml')
      .send(data);
  });
};

const getPrerenderRouteHandler = routes => (req, reply) => {
  let { url } = req.raw;
  if (url.substr(-1) == '/' && url.length > 1) {
    url = url.slice(0, -1);
  }

  const route = routes.find(item => item.path === url);

  const routeNamespace = `${NAMESPACE}:${url}`;
  const routeLog = debug(routeNamespace);

  routeLog('Start');

  if (!route) {
    routeLog('Done', 'Page not found');
    reply
      .code(404)
      .send('Page not found.');
    return;
  }

  render({ route, assets })
    .then((data) => {
      routeLog('Done');
      reply
        .header('Content-Type', 'text/html')
        .send(data);
    });
};

module.exports.serve = async ({ worker }) => {
  log('Starting');

  log('Start fetching data.');
  const [routes, sitemap] = await Promise.all([
    getRoutes(config.queryApiUrl, config.productName),
    getSitemaps(config.queryApiUrl, config.productName)
  ]);
  log('Done fetching data.');

  const server = fastify({
    logger: true,
    ignoreTrailingSlash: true,
    caseSensitive: false
  });

  server.register(require('fastify-static'), {
    root: path.join(process.cwd(), 'build', 'static'),
    prefix: '/static/'
  });

  server.get('/sitemap.xml', getSitemapHandler(sitemap));
  server.get('/sitemap-:market([a-z]{2,3}).xml', getSitemapMarketHandler(sitemap));
  server.get('*', getPrerenderRouteHandler(routes));

  server.listen(PORT, (err, address) => {
    if (err) throw err;
  });
};
