require('dotenv').config();

module.exports.NODE_ENV = process.env.NODE_ENV || 'development';
module.exports.PORT = parseInt(process.env.JETPACK_SERVER_PORT, 10) || 9002;
module.exports.HOST = process.env.JETPACK_SERVER_HOST || '0.0.0.0';
module.exports.SENTRY_DSN = process.env.JETPACK_SERVER_SENTRY;
module.exports.ENV = process.env.ENV || process.env.env || '';

module.exports.CONTENT_SVC = process.env.CONTENT_SVC || '127.0.0.1:51051';
module.exports.SVCNAME = process.env.SVCNAME || 'jetpack-server';
module.exports.PRODUCT = process.env.PRODUCT || 'jetpack';
module.exports.COMMIT = (process.env.COMMIT || 'dev').substring(0, 7);
module.exports.BUILT = process.env.BUILT || 'n/a';
module.exports.NAMESPACE = process.env.NAMESPACE || 'default';
module.exports.API_HOST = process.env.API_HOST || 'http://127.0.0.1:50050';
module.exports.TRACK_HOST = process.env.TRACK_HOST || 'http://127.0.0.1:50049';

// Env specific releases
module.exports.RELEASE = module.exports.COMMIT;

module.exports.DEV_PORT = parseInt(process.env.JETPACK_DEV_PORT, 10) || 9000;
