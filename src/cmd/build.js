const { build } = require('../webpack')

module.exports = {
  run: () => {
    return build()
  }
}
