let { readFileSync, writeFileSync } = require('fs')
let { parse } = require('dotenv')
let { join } = require('path')

module.exports = function dotEnv ({ envVars, update }) {
  let format = ([ name, value ]) => `${name}=${value}`
  let dotEnvPath = join(process.cwd(), '.env')

  let testingVars = envVars.filter(e => e.env === 'testing')
  if (testingVars.length) {
    let raw = readFileSync(dotEnvPath).toString()
    let envVars = parse(raw)
    testingVars.forEach(({ name, value }) => {
      envVars[name] = value
    })
    let contents = Object.entries(envVars).map(format).join('\n') + '\n'
    writeFileSync(dotEnvPath, contents)
    update.done(`Updated .env file with testing env vars`)
  }
}
