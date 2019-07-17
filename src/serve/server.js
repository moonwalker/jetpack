require('dotenv').config()

const os = require('os')
const url = require('url')
const path = require('path')
const request = require('request')
const fastify = require('fastify')
const serveStatic = require('serve-static')

const { getEnvMiddleware, hasLocale, hasTrailingSlash, stripUndefined } = require('../utils')
const { checkBuildArtifacts, processAssets } = require('../prerender/run')
const { paths } = require('../webpack/defaults')

const PORT = parseInt(process.env.JETPACK_SERVER_PORT) || 9002
const HOST = process.env.JETPACK_SERVER_HOST || '0.0.0.0'
const CONTENT_SVC = process.env.CONTENT_SVC || '127.0.0.1:51051'

const BUILD_DIR = 'build'
const STATIC_FILE_PATTERN = /\.(css|bmp|tif|ttf|docx|woff2|js|pict|tiff|eot|xlsx|jpg|csv|eps|woff|xls|jpeg|doc|ejs|otf|pptx|gif|pdf|swf|svg|ps|ico|pls|midi|svgz|class|png|ppt|mid|webp|jar|mp4|mp3)$/;

const DEFAULT_LOCALES = ['en', 'sv', 'fi', 'no', 'de', 'en-gb', 'en-se', 'en-eu', 'en-ca', 'en-nz']

const HEADER_CACHE_TAG = 'Cache-Tag'
const CACHE_TAG_STATIC = 'static'
const CACHE_TAG_STATIC_VERSIONED = 'static-versioned'
const CACHE_TAG_CONTENT = 'content'

const [assetsFilepath, renderFilepath] = checkBuildArtifacts(
  path.join(paths.assets.path, paths.assets.filename),
  paths.render.file
)

const assets = processAssets(assetsFilepath)
const render = require(renderFilepath).default

const sitemapHandler = () => (_, reply) => {
  request(`http://${CONTENT_SVC}/sitemap.xml`)
    .on('error', err => {
      return reply
        .code(404)
        .send('sitemap.xml not found')
    })
    .pipe(reply.res)
}

const sitemapMarketHandler = () => (req, reply) => {
  const market = req.params.market
  request(`http://${CONTENT_SVC}/sitemap-${market}.xml`)
    .on('error', err => {
      return reply
        .code(404)
        .send(`sitemap-${market}.xml not found`)
    })
    .pipe(reply.res)
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

const renderRouteHandler = (localesRegex, defaultLocale) => (req, reply) => {
  const u = url.parse(req.raw.url)

  if (STATIC_FILE_PATTERN.test(u.pathname)) {
    return reply.callNotFound();
  }

  if (!hasTrailingSlash(u.pathname)) {
    return permanentRedirect(`${u.pathname}/${u.search || ''}`)(req, reply)
  }

  if (!hasLocale(u.pathname, localesRegex)) {
    return permanentRedirect(`/${defaultLocale}${u.path}`)(req, reply)
  }

  const undef = stripUndefined(u.pathname)

  if (!!undef) {
    return permanentRedirect(`${undef}/${u.search || ''}`)(req, reply)
  }

  render({ path: u.pathname, assets })
    .then((data) => {
      reply
        .header('Content-Type', 'text/html')
        .header(HEADER_CACHE_TAG, CACHE_TAG_CONTENT)
        .send(data)
    })
}

const getSpaceLocales = () => {
  return new Promise((resolve) => {
    request(`http://${CONTENT_SVC}/space`, (error, response, body) => {
      var defaultLocaleCode;
      var localeCodes;
      if (!error && response.statusCode == 200) {
        const space = JSON.parse(body);
        if (space && space.locales && space.locales.length) {
          const defaultLocale = space.locales.find(l => (l.default));
          localeCodes = space.locales.map(l => (l.code));
          if (defaultLocale){
            defaultLocaleCode = defaultLocale.code;
          }else{
            defaultLocaleCode = localeCodes[0];
          }
        } else {
          defaultLocaleCode = DEFAULT_LOCALES[0];
          localeCodes = DEFAULT_LOCALES;
        }
      }
      resolve({ localesRegex: new RegExp(`^/(${localeCodes.join('|')})/.*`, 'i'), defaultLocale: defaultLocaleCode });
    })
  })
}

module.exports.serve = async ({ worker }) => {
  const started = new Date().toISOString()
  const server = fastify({ logger: true })

  const { localesRegex, defaultLocale } = await getSpaceLocales();

  // Versioned static files
  server.use('/static', serveStatic(path.join(process.cwd(), BUILD_DIR, 'static'), {
    fallthrough: false,
    maxAge: '1y',
    setHeaders: (res) => {
      res.setHeader(HEADER_CACHE_TAG, CACHE_TAG_STATIC_VERSIONED)
    }
  }))
  // Standard static files (favicons, etc)
  server.use(serveStatic(path.join(process.cwd(), BUILD_DIR), {
    setHeaders: (res) => {
      res.setHeader(HEADER_CACHE_TAG, CACHE_TAG_STATIC)
    }
  }))

  server.get('/sitemap.xml', sitemapHandler())
  server.get('/sitemap-:market([a-z]{2,3}).xml', sitemapMarketHandler())
  server.get('/healthz', healthzHandler(worker, started))
  server.get('/env.js', getEnvMiddleware())
  server.get('/', permanentRedirect(`/${defaultLocale}/`))
  server.get('*', renderRouteHandler(localesRegex, defaultLocale))

  server.listen(PORT, HOST, (err) => {
    if (err) throw err
  })
}
