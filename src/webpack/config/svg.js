module.exports = ({ context, include = context }) => ({
  module: {
    rules: [
      // Inline svg icons as React components
      {
        test: /\.svg.js$/,
        loader: 'react-svg-loader',
        enforce: 'pre',
        include
      }
    ]
  }
});
