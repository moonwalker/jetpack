const path = require('path');
const StatsPlugin = require('stats-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const { paths } = require('../defaults');

module.exports = () => ({
  stats: {
    source: false
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: path.join(paths.artifacts.path, 'bundle-analysis.html'),
      generateStatsFile: false,
      statsOptions: {
        context: process.cwd(),
        source: false
      }
    }),

    new StatsPlugin(
      path.relative(
        paths.output.path,
        path.join(paths.artifacts.path, 'webpack-stats.json')
      ),
      {
        context: process.cwd(),
        assets: true,
        timings: true,
        modules: true,
        chunks: true,
        performance: false,
        children: false,
        source: false,
      }
    )
  ]
});
