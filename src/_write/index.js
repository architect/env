let { existsSync } = require('fs')
let { join } = require('path')
let dotEnv = require('./dotenv')
let prefs = require('./prefs')

module.exports = function write (params, callback) {
  let dotEnvPath = join(process.cwd(), '.env')
  if (existsSync(dotEnvPath)) {
    dotEnv(params)
    callback()
  }
  else prefs(params, callback)
}
