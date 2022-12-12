module.exports = (srcDir) => ({
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: srcDir,
        enforce: 'pre',
        loader: 'ts-loader',
        options: {
          compilerOptions: {
            // Disable JS files check during webpack compilation, by default(tsconfig.json) is set
            // to true
            checkJs: false
          }
        }
      }
    ]
  }
});
