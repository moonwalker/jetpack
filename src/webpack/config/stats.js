const path = require('path');
const StatsPlugin = require('stats-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { BundleStatsWebpackPlugin } = require('bundle-stats');

const { paths } = require('../defaults');

const ARTIFACTS_REL_DIR = path.relative(paths.output.path, paths.artifacts.path);

const STATS = {
  context: paths.src,
  excludeAssets: [/artifacts/],
  assets: true,
  modules: true,
  chunks: true,
  timings: true,
  performance: false,
  children: false,
  source: false
};

module.exports = () => ({
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: path.join(paths.artifacts.path, 'bundle-analysis.html'),
      generateStatsFile: false,
      statsOptions: STATS
    }),

    new StatsPlugin(path.join(ARTIFACTS_REL_DIR, 'webpack-stats.json'), STATS),

    new BundleStatsWebpackPlugin({
      outDir: ARTIFACTS_REL_DIR,
      stats: STATS
    })
  ]
});
