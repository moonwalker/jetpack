const path = require('path');
const StatsPlugin = require('stats-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const { paths } = require('../defaults');

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

module.exports = ({ outputDir, isClient = true }) => {
  const artifactsRelDir = path.relative(outputDir, paths.artifacts.path);
  const suffix = isClient ? 'client' : 'render';

  return {
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false,
        reportFilename: path.join(outputDir, `bundle-analysis--${suffix}.html`),
        generateStatsFile: false,
        statsOptions: STATS
      }),

      new StatsPlugin(path.join(artifactsRelDir, `webpack-stats--${suffix}.json`), STATS)
    ]
  };
};
