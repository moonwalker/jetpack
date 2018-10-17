require('dotenv').config();

const http = require('http');
const path = require('path');

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

module.exports.prerenderServer = async () => {
  log('Starting');

  const routes = await getRoutes(config.queryApiUrl, config.productName);

  const server = http.createServer((req, res) => {
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
      })
      .catch((err) => {
        routeLog('Err', err.message);
        console.error(err);

        res.statusCode = 500;
        res.end('Error');
      });
  });

  server.on('clientError', (err, socket) => {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
  });

  server.listen(PORT, () => {
    log('Listening on port ', PORT);
  });
};
