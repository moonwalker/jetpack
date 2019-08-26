module.exports = {
  extends: ['airbnb', 'plugin:prettier/recommended'],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ['jest'],
  env: {
    'jest/globals': true
  },
  globals: {
    __STORYBOOK__: true,
    APP_CONFIG: true
  },
  rules: {
    // syntax enforcement, just warn
    'arrow-parens': 'warn',
    // syntax enforcement, just warn
    camelcase: 'warn',
    // we don't use comma dangle (ye)
    'comma-dangle': 'off',
    // syntax enforcement, just warn
    'implicit-arrow-linebreak': 'warn',
    // syntax enforcement, just warn
    'lines-between-class-members': 'warn',
    // syntax enforcement, just warn
    'max-len': 'warn',
    // syntax enforcement, just warn
    'no-extra-semi': 'warn',
    // not used
    'operator-linebreak': 'off',

    // we use named exports
    'import/prefer-default-export': 'off',
    // preffer './sub-dir' instead of 'sub-dir'
    'import/no-useless-path-segments': 'off',
    // do not require dependencies on story files
    'import/no-extraneous-dependencies': ['error', {
      devDependencies: [
        '**/*/*.stories.js'
      ]
    }],

    // correctly validate react-router Link
    'jsx-a11y/anchor-is-valid': ['error', {
      components: ['Link'],
      specialLink: ['to'],
      aspects: ['noHref', 'invalidHref', 'preferButton']
    }],
    'jsx-a11y/label-has-for': 'off',

    // helpful, but not required
    'react/default-props-match-prop-types': 'warn',
    // syntax enforcement, just warn
    'react/destructuring-assignment': 'warn',
    // we do not use .jsx
    'react/jsx-filename-extension': 'off',
    // helpful, but not required
    'react/jsx-props-no-spreading': 'warn',
    // helpful, but not required
    'react/jsx-fragments': 'warn',
    // helpful, but not required
    'react/prop-types': 'warn',
    // @TODO
    'react/react-in-jsx-scope': 'off',
    // helpful, but not required
    'react/require-default-props': 'warn',
    // syntax enforcement, just warn
    'react/sort-comp': 'warn',
  }
};
