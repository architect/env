let parser = require('@architect/parser')
let fs = require('fs')
let { existsSync, readFileSync } = fs
let { join } = require('path')
let waterfall = require('run-waterfall')
let prompt = require('./prompt')

module.exports = function write ({ envVars, update }, callback) {
  let cwd = process.cwd()
  // Establish filename, uh, preference
  let short = 'prefs.arc'
  let long = 'preferences.arc'
  let filename
  let prefsPath
  if (existsSync(join(cwd, short))) {
    filename = short
    prefsPath = join(cwd, short)
  }
  else {
    filename = long
    prefsPath = join(cwd, long)
  }

  let arc
  let prefsExists = existsSync(prefsPath)
  if (prefsExists) {
    let raw = readFileSync(prefsPath).toString()
    arc = parser(raw)
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
    ? 'testing\n  ' + testingVars.join('\n  ')
    : '# testing\n  # Add testing env vars with: arc env --add --env testing NAME value'

  let stagingVars = envVars
    .filter(e => e.env === 'staging')
    .map(maybeQuote)
  let staging = stagingVars.length
    ? 'staging\n  ' + stagingVars.join('\n  ')
    : '# staging\n  # Add staging env vars with: arc env --add --env staging NAME value'

  let productionVars = envVars
    .filter(e => e.env === 'production')
    .map(maybeQuote)
  let production = productionVars.length
    ? 'production\n  ' + productionVars.join('\n  ')
    : '# production\n  # Add production env vars with: arc env --add --env production NAME value'

  let envString = `# The @env pragma is synced (and overwritten) by running arc env
@env
${testing}

${staging}

${production}
`

  let gitignore
  let gitignorePath = join(cwd, '.gitignore')
  let hasGitignore = existsSync(gitignorePath)
  waterfall([
    function (callback) {
      if (prefsExists) callback(null, true)
      else {
        let question = 'Would you like to create a local preferences file? [Y|n]'
        let why = 'Sandbox uses this to load your env vars'
        update.status(question, why)
        prompt(update, callback)
      }
    },
    function (write, callback) {
      if (write) {
        let prefs = parser.stringify(arc)
        prefs = prefs ? prefs + '\n' : prefs
        let contents = prefs + envString
        fs.writeFileSync(prefsPath, contents)
        update.done(`Updated ${filename} file with latest env vars`)
        callback(null, true)
      }
      else callback(null, false)
    },
    function (wrote, callback) {
      let isGitRepo = existsSync(join(cwd, '.git'))
      let question = 'Would you like Git to ignore your preferences file (strongly recommended)? [Y|n]'
      if (isGitRepo && (prefsExists || wrote)) {
        if (!hasGitignore) {
          gitignore = filename + '\n'
          update.status(question)
          prompt(update, callback)
        }
        else {
          gitignore = readFileSync(gitignorePath).toString()
          let isIgnored = gitignore.split('\n').some(l => l.includes(filename))
          if (isIgnored) callback(null, false)
          else {
            gitignore = gitignore.trim() + `\n${filename}\n`
            update.status(question)
            prompt(update, callback)
          }
        }
      }
      else callback(null, false)
    },
    function (write, callback) {
      if (write) {
        fs.writeFileSync(gitignorePath, gitignore)
        let action = hasGitignore ? 'Updated' : 'Created'
        update.done(`${action} .gitignore with ${filename}`)
        callback()
      }
      else callback()
    }
  ], callback)
}
