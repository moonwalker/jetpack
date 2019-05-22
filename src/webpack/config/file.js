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
      name: isDevelopment
        ? 'static/[path][name].[ext]'
        : 'static/[path][name].[hash:8].[ext]',
      emitFile,
      ...restOptions
    }
  };

  return { module: { rules: [fileRule] } };
};
