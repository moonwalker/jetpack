const { serve } = require('./server');

process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'unhandled rejection at promise', p);
  })
  .on('uncaughtException', (err) => {
    console.error(err, 'uncaught exception thrown');
    process.exit(1);
  });

serve();
