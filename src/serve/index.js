const { cpus } = require('os')
const cluster = require('cluster')
const { serve } = require('./server')

const maxWorkers = parseInt(process.env['MAX_WORKERS']) || cpus().length

const start = () => {
  if (process.env.CLUSTERING != 'true') {
    serve({ worker: 1 })
  } else {
    if (cluster.isMaster) {
      for (let i = 0; i < maxWorkers; i += 1) {
        cluster.fork()
      }
    } else {
      serve({ worker: cluster.worker.id })
    }
  }
}

start()
