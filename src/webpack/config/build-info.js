const { execSync } = require('child_process');
const GenerateJSONPlugin = require('generate-json-webpack-plugin');

const getCommitId = () => execSync('git rev-parse HEAD').toString().trim();

module.exports = ({ output }) => ({
  plugins: [
    new GenerateJSONPlugin(output, {
      commit: getCommitId(),
      date: new Date()
    }, null, 2)
  ]
});
