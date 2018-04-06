const { prerender } = require('../webpack')

module.exports = {
  run: () => {
    return prerender()
  }
}
