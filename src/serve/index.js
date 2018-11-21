const { cpus } = require('os')
const cluster = require('cluster')
const { serve } = require('./server')
const { config } = require('../webpack/defaults')
const getRoutes = require('../webpack/getRoutes')

const maxWorkers = parseInt(process.env['MAX_WORKERS']) || cpus().length

const start = routes => {
  if (process.env.CLUSTERING != 'true') {
    serve({ worker: 1, routes })
  } else {
    if (cluster.isMaster) {
      for (let i = 0; i < maxWorkers; i += 1) {
        cluster.fork()
      }
    } else {
      serve({ worker: cluster.worker.id, routes })
    }
  }
}

getRoutes(config).then(start)
