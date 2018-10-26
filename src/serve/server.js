require('dotenv').config()

const os = require('os')
const url = require('url')
const path = require('path')
const fastify = require('fastify')
const serveStatic = require('serve-static')

const { debug, hasTrailingSlash, stripTrailingSlash } = require('../utils')
const { checkBuildArtifacts, processAssets } = require('../prerender/run')
const { paths, config } = require('../webpack/defaults')
const getRoutes = require('../webpack/getRoutes')
const { getSitemaps, generateMarketSitemap, generateMainSitemap } = require('../sitemap')

const PORT = process.env.JETPACK_PRERENDER_PORT || 9002
const NAMESPACE = 'serve'
const BUILD_DIR = 'build'
const DEFAULT_PATH = '/en/'

const log = debug(NAMESPACE)

// @TODO: extract
log('ENV:', process.env.ENV)
log('API:', config.queryApiUrl)
log('PRD:', config.productName)

const [assetsFilepath, renderFilepath] = checkBuildArtifacts(
  path.join(paths.assets.path, paths.assets.filename),
  paths.render.file
)

const assets = processAssets(assetsFilepath)
const render = require(renderFilepath).default

const sitemapHandler = sitemap => (_, reply) => {
  const data = generateMainSitemap(sitemap)
  reply
    .header('Content-Type', 'application/xml')
    .send(data)
}

const sitemapMarketHandler = sitemap => (req, reply) => {
  const marketId = req.params.market.toUpperCase()
  const market = sitemap.sitemaps.find(entry => entry.market === marketId)

  if (!market || !market.domain) {
    return reply
      .code(404)
      .send('Page not found')
  }

  generateMarketSitemap(market, sitemap.routeLocales, (err, data) => {
    if (err) {
      return reply
        .code(500)
        .send(err.message)
    }

    reply
      .header('Content-Type', 'application/xml')
      .send(data)
  })
}

const healthzHandler = (worker) => {
  const started = new Date().toISOString()
  const service = process.env.SVCNAME || 'jetpack-server'
  const version = (process.env.COMMIT || 'dev').substring(0, 7)
  const built = process.env.BUILT || 'n/a'
  const namespace = process.env.NAMESPACE || 'default'
  const runtime = `node${process.versions.node}`
  const platform = `${os.platform()}/${os.arch()}`
  const host = os.hostname()

  return (_, reply) => {
    const status = 'healthy'
    reply.send({
      service,
      version,
      built,
      namespace,
      runtime,
      platform,
      host,
      status,
      started,
      worker
    })
  }
}

const permanentRedirect = to => (_, reply) => {
  reply.redirect(301, to)
}

const rerenderRouteHandler = routes => (req, reply) => {
  const u = url.parse(req.raw.url)

  if (!hasTrailingSlash(u.pathname)) {
    return permanentRedirect(`${u.pathname}/${u.search || ''}`)(req, reply)
  }

  const pathname = stripTrailingSlash(u.pathname)
  const route = routes.find(item => item.path === pathname)
  if (!route) {
    return reply
      .code(404)
      .send('Page not found.')
  }

  render({ route, path: u.path, assets })
    .then((data) => {
      reply
        .header('Content-Type', 'text/html')
        .send(data)
    })
}

const getEnvHandler = () => (_, reply) => {
  reply
    .header('Content-Type', 'application/javascript')
    .send(`
      window.APP_CONFIG = {
        ENV: "${process.env.ENV || process.env.env || ''}"
      }
    `);
};

module.exports.serve = async ({ worker }) => {
  log('Starting')

  log('Start fetching data.')
  const [routes, sitemap] = await Promise.all([
    getRoutes(config.queryApiUrl, config.productName),
    getSitemaps(config.queryApiUrl, config.productName)
  ])
  log('Done fetching data.')

  const server = fastify({ logger: true })

  server.use(serveStatic(path.join(process.cwd(), BUILD_DIR)))
  server.get('/sitemap.xml', sitemapHandler(sitemap))
  server.get('/sitemap-:market([a-z]{2,3}).xml', sitemapMarketHandler(sitemap))
  server.get('/healthz', healthzHandler(worker))
  server.get('/env.js', getEnvHandler());
  server.get('/', permanentRedirect(DEFAULT_PATH))
  server.get('*', rerenderRouteHandler(routes))

  server.listen(PORT, '0.0.0.0', (err) => {
    if (err) throw err
  })
}
