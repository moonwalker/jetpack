const fs = require('fs');
const os = require('os');
const url = require('url');
const path = require('path');
const request = require('request');
const fastify = require('fastify');
const serveStatic = require('serve-static');
const Sentry = require('@sentry/node');

const {
  debug,
  getEnvMiddleware,
  hasLocale,
  hasTrailingSlash,
  stripUndefined
} = require('../utils');
const { checkBuildArtifacts, processAssets } = require('../prerender/run');
const { paths } = require('../webpack/defaults');
const {
  BUILT,
  CACHE_TAG_CONTENT,
  CACHE_TAG_STATIC,
  CACHE_TAG_STATIC_VERSIONED,
  COMMIT,
  CONTENT_SVC,
  DEFAULT_ERROR_MESSAGE,
  DEFAULT_LOCALES,
  ENV,
  HEADER_CACHE_TAG,
  HOST,
  NAMESPACE,
  PORT,
  SENTRY_DSN,
  STATIC_FILE_PATTERN,
  SVCNAME
} = require('../constants');

const log = debug('render');

if (SENTRY_DSN) {
  log('Sentry init');
  Sentry.init({ dsn: SENTRY_DSN, release: COMMIT, environment: ENV });
} else {
  log('Sentry skipped');
}

const [assetsFilepath, renderFilepath] = checkBuildArtifacts(
  path.join(paths.assets.path, paths.assets.filename),
  paths.render.file
);

const assets = processAssets(assetsFilepath);
const render = require(renderFilepath).default; // eslint-disable-line import/no-dynamic-require

let ERROR_MESSAGE = '';
const errorHandler = (err, req, reply) => {
  if (!ERROR_MESSAGE) {
    try {
      ERROR_MESSAGE = fs.readFileSync(path.join(paths.output.path, '500.html'), 'utf-8');
    } catch (missingFileErr) {
      ERROR_MESSAGE = DEFAULT_ERROR_MESSAGE;
    }
  }

  console.error(err.message); // eslint-disable-line no-console

  Sentry.withScope((scope) => {
    scope.addEventProcessor((event) => Sentry.Handlers.parseRequest(event, req.raw));
    scope.setTag('namespace', NAMESPACE);
    Sentry.captureException(err);
  });

  reply
    .code(500)
    .type('text/html')
    .send(ERROR_MESSAGE);
};

const sitemapHandler = () => (_, reply) => {
  request(`http://${CONTENT_SVC}/sitemap.xml`)
    .on('error', () => {
      return reply.code(404).send('sitemap.xml not found');
    })
    .pipe(reply.res);
};

const sitemapMarketHandler = () => (req, reply) => {
  const { market } = req.params;
  request(`http://${CONTENT_SVC}/sitemap-${market}.xml`)
    .on('error', () => {
      return reply.code(404).send(`sitemap-${market}.xml not found`);
    })
    .pipe(reply.res);
};

const healthzHandler = (worker, started) => {
  const data = {
    service: SVCNAME,
    version: COMMIT,
    built: BUILT,
    namespace: NAMESPACE,
    runtime: `node${process.versions.node}`,
    platform: `${os.platform()}/${os.arch()}`,
    host: os.hostname(),
    status: 'healthy',
    started,
    worker
  };

  return (_, reply) => {
    reply.header('Content-Type', 'application/json').send(data);
  };
};

const permanentRedirect = (to) => (_, reply) => {
  reply
    .header('Cache-Control', 'no-store, no-cache, must-revalidate')
    .header('Expires', 'Thu, 01 Jan 1970 00:00:00 GMT')
    .redirect(301, to);
};

const renderRouteHandler = (localesRegex, defaultLocale) => async (req, reply) => {
  const u = url.parse(req.raw.url);

  if (STATIC_FILE_PATTERN.test(u.pathname)) {
    return reply.callNotFound();
  }

  if (!hasTrailingSlash(u.pathname)) {
    return permanentRedirect(`${u.pathname}/${u.search || ''}`)(req, reply);
  }

  const locale = hasLocale(u.pathname, localesRegex);

  if (!locale) {
    return permanentRedirect(`/${defaultLocale}${u.path}`)(req, reply);
  }

  const undef = stripUndefined(u.pathname);

  if (undef) {
    return permanentRedirect(`${undef}/${u.search || ''}`)(req, reply);
  }

  let data;

  try {
    data = await render({ path: u.pathname, assets });
  } catch (err) {
    throw new Error(err);
  }

  return reply
    .header('Content-Type', 'text/html')
    .header(HEADER_CACHE_TAG, CACHE_TAG_CONTENT)
    .send(data);
};

const getSpaceLocales = () => {
  return new Promise((resolve) => {
    request(`http://${CONTENT_SVC}/space`, (error, response, body) => {
      let defaultLocaleCode = DEFAULT_LOCALES[0];
      let localeCodes = DEFAULT_LOCALES;
      if (!error && response.statusCode === 200) {
        const space = JSON.parse(body);
        if (space && space.locales && space.locales.length) {
          const defaultLocale = space.locales.find((l) => l.default);
          localeCodes = space.locales.map((l) => l.code);
          if (defaultLocale) {
            defaultLocaleCode = defaultLocale.code;
          } else {
            [defaultLocaleCode] = localeCodes;
          }
        }
      }
      resolve({
        localesRegex: new RegExp(`^/(${localeCodes.join('|')})/.*`, 'i'),
        defaultLocale: defaultLocaleCode
      });
    });
  });
};

module.exports.serve = async ({ worker }) => {
  const started = new Date().toISOString();
  const server = fastify({ logger: true });

  const { localesRegex, defaultLocale } = await getSpaceLocales();

  // Versioned static files
  server.use(
    '/static',
    serveStatic(path.join(paths.output.path, 'static'), {
      fallthrough: false,
      maxAge: '1y',
      setHeaders: (res) => {
        res.setHeader(HEADER_CACHE_TAG, CACHE_TAG_STATIC_VERSIONED);
      }
    })
  );
  // Standard static files (favicons, etc)
  server.use(
    serveStatic(paths.output.path, {
      setHeaders: (res) => {
        res.setHeader(HEADER_CACHE_TAG, CACHE_TAG_STATIC);
      }
    })
  );

  server.get('/sitemap.xml', sitemapHandler());
  server.get('/sitemap-:market([a-z]{2,3}).xml', sitemapMarketHandler());
  server.get('/healthz', healthzHandler(worker, started));
  server.get('/env.js', getEnvMiddleware());
  server.get('/', permanentRedirect(`/${defaultLocale}/`));
  server.get('*', renderRouteHandler(localesRegex, defaultLocale));

  server.setErrorHandler(errorHandler);

  server.listen(PORT, HOST, (err) => {
    if (err) throw err;
  });
};
