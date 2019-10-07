require('dotenv').config();

module.exports.PORT = parseInt(process.env.JETPACK_SERVER_PORT, 10) || 9002;
module.exports.HOST = process.env.JETPACK_SERVER_HOST || '0.0.0.0';
module.exports.SENTRY_RENDER_DSN = process.env.JETPACK_SENTRY_DSN;

module.exports.CONTENT_SVC = process.env.CONTENT_SVC || '127.0.0.1:51051';
module.exports.SVCNAME = process.env.SVCNAME || 'jetpack-server';
module.exports.COMMIT = (process.env.COMMIT || 'dev').substring(0, 7);
module.exports.BUILT = process.env.BUILT || 'n/a';
module.exports.NAMESPACE = process.env.NAMESPACE || 'default';

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

// Others
module.exports.DEFAULT_ERROR_MESSAGE = 'Something went wrong, please try again!';
