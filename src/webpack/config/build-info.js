const GenerateJSONPlugin = require('generate-json-webpack-plugin');

const { getCommitId } = require('../../utils');

module.exports = ({ output }) => ({
  plugins: [
    new GenerateJSONPlugin(
      output,
      {
        commit: getCommitId(),
        date: new Date()
      },
      null,
      2
    )
  ]
});
