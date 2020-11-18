let { parser, lexer, stringify } = require('@architect/parser')
let fs = require('fs')
let { existsSync, readFileSync } = fs
let { join } = require('path')

module.exports = function write ({ envVars, update }) {
  // Establish filename, uh, preference
  let short = 'prefs.arc'
  let long = 'preferences.arc'
  let filename
  let prefsPath
  if (existsSync(join(process.cwd(), short))) {
    filename = short
    prefsPath = join(process.cwd(), short)
  }
  else {
    filename = long
    prefsPath = join(process.cwd(), long)
  }

  let arc
  if (existsSync(prefsPath)) {
    let raw = readFileSync(prefsPath).toString()
    arc = parser(lexer(raw))
    delete arc.env
  }
  else arc = {}

  function maybeQuote ({ name, value }) {
    // lol JS string/number coersion
    let isFloat = /^[\d]+\.?[\d]+$/
    if (isFloat.test(value)) return `${name} "${value}"`
    let hasSpecialChars = /[@# ]/g
    return hasSpecialChars.test(value) ? `${name} "${value}"` : `${name} ${value}`
  }

  let testingVars = envVars
    .filter(e => e.env === 'testing')
    .map(maybeQuote)
  let testing = testingVars.length
    ? testingVars.join('\n  ')
    : '# Add testing env vars with: arc env testing NAME value'

  let stagingVars = envVars
    .filter(e => e.env === 'staging')
    .map(maybeQuote)
  let staging = stagingVars.length
    ? stagingVars.join('\n  ')
    : '# Add staging env vars with: arc env staging NAME value'

  let productionVars = envVars
    .filter(e => e.env === 'production')
    .map(maybeQuote)
  let production = productionVars.length
    ? productionVars.join('\n  ')
    : '# Add production env vars with: arc env production NAME value'

  let envString = `# The @env pragma is synced (and overwritten) by running arc env
@env
testing
  ${testing}

staging
  ${staging}

production
  ${production}
`

  let prefs = stringify(arc)
  prefs = prefs ? prefs + '\n' : prefs
  let contents = prefs + envString
  fs.writeFileSync(prefsPath, contents)
  update.done(`Updated ${filename} file with latest environment variables`)
}
