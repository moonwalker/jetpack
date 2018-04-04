const { resolve } = require('path');
const getSitemaps = require('./getSitemaps');
const fs = require('fs');
const async = require('async');

module.exports = config =>
  getSitemaps(config.queryApiUrl, config.productName)
    .then((sitemaps) => {
      if (!sitemaps) return process.exit(0);

      const sitemapdir = resolve(process.cwd(), 'build');

      if (!fs.existsSync(sitemapdir)) {
        fs.mkdirSync(sitemapdir);
      }

      async.forEach(sitemaps, (sitemap, sCb) => {
        const sitemapPath = `${sitemapdir}/${sitemap.filename}`;

        console.log('>>> creating', sitemapPath, `${Math.round(sitemap.content.length / 100000) / 10}MB`)

        // Save sitemap to disk
        fs.writeFile(sitemapPath, sitemap.content, sCb)
      }, err => {
        if (err) {
          console.log('>>> ERR:', err);
        }
      });
    })
