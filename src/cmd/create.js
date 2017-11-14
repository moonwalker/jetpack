const { resolve } = require('path')
const { execSync } = require('child_process')
const { copy } = require('fs-extra')

module.exports = {
  run: async(name, template = 'basic') => {
    if (!name) {
      return console.error(invalid())
    }

    console.time(`=> Project "${name}" created`)

    console.log('=> Creating new jetpack project...')
    const dest = resolve(process.cwd(), name)
    await copy(resolve(__dirname, '..', '..', 'examples', template), dest)

    const useYarn = yarnInstalled()
    console.log(`=> Installing dependencies (using ${useYarn ? 'yarn' : 'npm'})...`)

    execSync(
      `cd ${name} && \
       ${useYarn ? 'yarn' : 'npm install'}`
    )
    // ${useYarn ? 'yarn add @moonwalker/jetpack@latest' : 'npm install --save @moonwalker/jetpack@latest'}`

    console.timeEnd(`=> Project "${name}" created`)
  }
}

const invalid = () => {
  return `
error: Name is required.
example: jetpack create myproject
`
}

function yarnInstalled() {
  try {
    execSync('yarnpkg --version', { stdio: 'ignore' })
    return true
  } catch (e) {
    return false
  }
}
