require('dotenv').config();

const os = require('os');
const path = require('path');
const fastify = require('fastify');
const serveStatic = require('serve-static');

const { debug, stripTrailingSlash } = require('../utils');
const { checkBuildArtifacts, processAssets } = require('../prerender/run');
const { paths, config } = require('../webpack/defaults');
const getRoutes = require('../webpack/getRoutes');
const { getSitemaps, generateMarketSitemap, generateMainSitemap } = require('../sitemap');

const PORT = process.env.JETPACK_PRERENDER_PORT || 9002;
const DEFAULT_PATH = '/en';
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
  const data = generateMainSitemap(sitemap);
  reply
    .header('Content-Type', 'application/xml')
    .send(data);
};

const getSitemapMarketHandler = sitemap => (req, reply) => {
  const marketId = req.params.market.toUpperCase();
  const market = sitemap.sitemaps.find(entry => entry.market === marketId);

  if (!market || !market.domain) {
    reply
      .code(404)
      .send('Page not found');
  }

  generateMarketSitemap(market, sitemap.routeLocales, (err, data) => {
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
  let url = stripTrailingSlash(req.raw.url);
  const route = routes.find(item => item.path === url);
  if (!route) {
    reply
      .code(404)
      .send('Page not found.');
    return;
  }

  render({ route, assets })
    .then((data) => {
      reply
        .header('Content-Type', 'text/html')
        .send(data);
    });
};

const healthzHandler = (worker) => {
  const started = new Date().toISOString()
  const service = process.env.SVCNAME || 'jetpack-server'
  const version = (process.env.COMMIT || 'dev').substring(0, 7)
  const built = process.env.BUILT || 'n/a'
  const runtime = `node${process.versions.node}`
  const platform = `${os.platform()}/${os.arch()}`
  const host = os.hostname()

  return (_, reply) => {
    const status = 'healthy'
    reply.send({
      service,
      version,
      built,
      runtime,
      platform,
      host,
      status,
      started,
      worker
    })
  }
}

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
    ignoreTrailingSlash: true
  });

  server.use(serveStatic(path.join(process.cwd(), 'build')))
  server.get('/sitemap.xml', getSitemapHandler(sitemap));
  server.get('/sitemap-:market([a-z]{2,3}).xml', getSitemapMarketHandler(sitemap));
  server.get('/healthz', healthzHandler(worker));
  server.get('/', (_, reply) => { reply.redirect(301, DEFAULT_PATH) })
  server.get('*', getPrerenderRouteHandler(routes));

  server.listen(PORT, '0.0.0.0', (err, address) => {
    if (err) throw err;
  });
};
