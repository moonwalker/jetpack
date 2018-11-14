require('dotenv').config()

const os = require('os')
const url = require('url')
const path = require('path')
const fastify = require('fastify')
const serveStatic = require('serve-static')

const { hasTrailingSlash, stripTrailingSlash } = require('../utils')
const { checkBuildArtifacts, processAssets } = require('../prerender/run')
const { paths, config } = require('../webpack/defaults')

const getRoutes = require('../webpack/getRoutes')
const { getSitemap, generateMarketSitemap, generateMainSitemap } = require('../sitemap')

const PORT = parseInt(process.env.JETPACK_SERVER_PORT) || 9002
const HOST = process.env.JETPACK_SERVER_HOST || '0.0.0.0'
const CONTENT_SVC = process.env.CONTENT_SVC || '127.0.0.1:50051'

const BUILD_DIR = 'build'
const DEFAULT_PATH = '/en/'

const [assetsFilepath, renderFilepath] = checkBuildArtifacts(
  path.join(paths.assets.path, paths.assets.filename),
  paths.render.file
)

const assets = processAssets(assetsFilepath)
const render = require(renderFilepath).default

const sitemapHandler = sitemap => (req, reply) => {
  // req.pipe(request(`http://${CONTENT_SVC}`)).pipe(reply)

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

const healthzHandler = (worker, started) => {
  const data = {
    service: process.env.SVCNAME || 'jetpack-server',
    version: (process.env.COMMIT || 'dev').substring(0, 7),
    built: process.env.BUILT || 'n/a',
    namespace: process.env.NAMESPACE || 'default',
    runtime: `node${process.versions.node}`,
    platform: `${os.platform()}/${os.arch()}`,
    host: os.hostname(),
    status: 'healthy',
    started,
    worker
  }

  return (_, reply) => {
    reply
      .header('Content-Type', 'application/json')
      .send(data)
  }
}

const permanentRedirect = to => (_, reply) => {
  reply
    .header('Cache-Control', 'no-store, no-cache, must-revalidate')
    .header('Expires', 'Thu, 01 Jan 1970 00:00:00 GMT')
    .redirect(301, to)
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

const envHandler = () => (_, reply) => {
  reply
    .header('Cache-Control', 'no-store, no-cache, must-revalidate')
    .header('Expires', 'Thu, 01 Jan 1970 00:00:00 GMT')
    .header('Content-Type', 'application/javascript')
    .send(`
window.APP_CONFIG = {
  ENV: "${process.env.ENV || process.env.env || ''}",
  NAMESPACE: "${process.env.NAMESPACE || 'default'}"
}`)
}

module.exports.serve = async ({ worker }) => {
  const [routes, sitemap] = await Promise.all([
    getRoutes(config),
    getSitemap(config)
  ])

  const started = new Date().toISOString()
  const server = fastify({ logger: true })

  server.use(serveStatic(path.join(process.cwd(), BUILD_DIR)))
  server.get('/sitemap.xml', sitemapHandler(sitemap))
  server.get('/sitemap-:market([a-z]{2,3}).xml', sitemapMarketHandler(sitemap))
  server.get('/healthz', healthzHandler(worker, started))
  server.get('/env.js', envHandler())
  server.get('/', permanentRedirect(DEFAULT_PATH))
  server.get('*', rerenderRouteHandler(routes))

  server.listen(PORT, HOST, (err) => {
    if (err) throw err
  })
}
