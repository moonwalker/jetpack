module.exports = (options, env) => {
  const {
    context,
    include = context,
    emitFile = true,
    ...restOptions
  } = options;

  const isDevelopment = env.NODE_ENV === 'development';

  const fileRule = {
    test: /\.(png|jpg|jpeg|gif|svg|ico)$/,
    include,
    loader: 'file-loader',
    options: {
      context,
      name: isDevelopment ?
        '[path][name].[ext]' :
        '[path][name].[hash:5].[ext]',
      emitFile,
      ...restOptions
    }
  };

  return { module: { rules: [fileRule] } };
};
