require('dotenv').config();

const http = require('http');
const path = require('path');
const router = require('find-my-way')();

const { debug } = require('../utils');
const { checkBuildArtifacts, processAssets } = require('../prerender/run');
const { paths, config } = require('../webpack/defaults');
const getRoutes = require('../webpack/getRoutes');

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

      res.end(data);
    });
};


module.exports.prerenderServer = async () => {
  log('Starting');

  const routes = await getRoutes(config.queryApiUrl, config.productName);

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
