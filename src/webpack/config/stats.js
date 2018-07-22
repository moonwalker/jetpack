const path = require('path');
const StatsPlugin = require('stats-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const { paths } = require('../defaults');

module.exports = () => ({
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: path.join(paths.artifacts.path, 'bundle-analysis.html'),
    }),

    new StatsPlugin(
      path.relative(
        paths.output.path,
        path.join(paths.artifacts.path, 'webpack-state.json')
      ),
      {
        assets: true,
        performance: false,
        timings: false,
        children: false,
        source: false,
        modules: false,
        chunks: false
      }
    )
  ]
});
