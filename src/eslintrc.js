module.exports = {
  extends: 'airbnb',
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ['jest'],
  rules: {
    'import/prefer-default-export': 0,
    'react/prop-types': 0,
    'react/jsx-filename-extension': 0,
    'react/react-in-jsx-scope': 0,
    'jsx-a11y/label-has-for': 0,
    'comma-dangle': 0
  }
};
