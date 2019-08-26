module.exports = {
  '**/*.{js,jsx}': [
    'npx prettier --write',
    'git add',
  ]
};
