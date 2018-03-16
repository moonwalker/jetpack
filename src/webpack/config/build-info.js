const { exec } = require('shelljs');
const GenerateJSONPlugin = require('generate-json-webpack-plugin');

const getCommitId = () =>
  exec('git rev-parse HEAD', { silent: true }).stdout.trim();

module.exports = ({ output }) => ({
  plugins: [
    new GenerateJSONPlugin(output, {
      commit: getCommitId(),
      date: new Date()
    }, null, 2)
  ]
});
