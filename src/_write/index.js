let { existsSync } = require('fs')
let { join } = require('path')
let dotEnv = require('./dotenv')
let prefs = require('./prefs')

module.exports = function write (params) {
  let dotEnvPath = join(process.cwd(), '.env')
  if (existsSync(dotEnvPath)) dotEnv(params)
  else prefs(params)
}
