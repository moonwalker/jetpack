require('dotenv').config();

module.exports.NODE_ENV = process.env.NODE_ENV || 'development';
module.exports.PORT = parseInt(process.env.JETPACK_SERVER_PORT, 10) || 9002;
module.exports.HOST = process.env.JETPACK_SERVER_HOST || '0.0.0.0';
module.exports.SENTRY_DSN = process.env.JETPACK_SERVER_SENTRY;
module.exports.ENV = process.env.ENV || process.env.env || '';

module.exports.CONTENT_SVC = process.env.CONTENT_SVC || '127.0.0.1:51051';
module.exports.SVCNAME = process.env.SVCNAME || 'jetpack-server';
module.exports.COMMIT = (process.env.COMMIT || 'dev').substring(0, 7);
module.exports.BUILT = process.env.BUILT || 'n/a';
module.exports.NAMESPACE = process.env.NAMESPACE || 'default';
module.exports.API_HOST = process.env.API_HOST || 'http://127.0.0.1:50050';
module.exports.TRACK_HOST = process.env.TRACK_HOST || 'http://127.0.0.1:50049';

// Env specific releases
module.exports.RELEASE = module.exports.COMMIT;

// Static files
module.exports.STATIC_FILE_PATTERN = /\.(css|bmp|tif|ttf|docx|woff2|js|pict|tiff|eot|xlsx|jpg|csv|eps|woff|xls|jpeg|doc|ejs|otf|pptx|gif|pdf|swf|svg|ps|ico|pls|midi|svgz|class|png|ppt|mid|webp|jar|mp4|mp3)$/;
module.exports.DEFAULT_LOCALES = [
  'en',
  'sv',
  'fi',
  'no',
  'de',
  'en-gb',
  'en-se',
  'en-eu',
  'en-ca',
  'en-nz'
];

// Caching
module.exports.HEADER_CACHE_TAG = 'Cache-Tag';
module.exports.CACHE_TAG_STATIC = 'static';
module.exports.CACHE_TAG_STATIC_VERSIONED = 'static-versioned';
module.exports.CACHE_TAG_CONTENT = 'content';
module.exports.HEADER_SURROGATE_CONTROL = 'Surrogate-Control';
module.exports.HEADER_SURROGATE_CONTROL_VALUE = 'max-age=86400';

// Others
module.exports.DEFAULT_ERROR_MESSAGE = 'Something went wrong, please try again!';
