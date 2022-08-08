module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false
      }
    ],
    '@babel/preset-react'
  ],
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: false,
        helpers: true,
        regenerator: true,
        useESModules: false
      }
    ],
    '@babel/plugin-proposal-throw-expressions',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-syntax-import-meta',
    'babel-plugin-transform-react-remove-prop-types',
    'graphql-tag',
    'lodash',
    'react-require'
  ],
  env: {
    development: {
      plugins: [require.resolve('react-refresh/babel')]
    },
    test: {
      presets: ['@babel/preset-env', '@babel/preset-react'],
      plugins: [
        '@babel/plugin-proposal-throw-expressions',
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-syntax-import-meta',
        'react-require'
      ]
    },
    render: {
      presets: [['@babel/preset-env', { targets: { node: 'current' } }], '@babel/preset-react'],
      plugins: [
        '@babel/plugin-proposal-throw-expressions',
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-syntax-import-meta',
        'babel-plugin-transform-react-remove-prop-types',
        'react-require'
      ]
    }
  }
};
