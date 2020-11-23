let chalk = require('chalk')

module.exports = function printer (err, { envVars, update, prints }) {
  if (err) update.error(err)
  else {
    let fmt = ({ name, value }) => `${chalk.cyan.bold(name)} ${chalk.cyan(value)}`
    let msg = e => `None found! Add ${e} env vars with: ${chalk.cyan.bold(`arc env ${e} NAME value`)}`

    // Testing
    if (prints.testing) {
      let testing = envVars.filter(p => p.env === 'testing')
      let title = 'Testing env vars:'
      if (testing.length) {
        update.status(title, ...testing.map(fmt))
      }
      else {
        update.status(title, msg('testing'))
      }
    }

    // Staging
    if (prints.staging) {
      let staging = envVars.filter(p => p.env === 'staging')
      let title = 'Staging env vars:'
      if (staging.length) {
        update.status(title, ...staging.map(fmt))
      }
      else {
        update.status(title, msg('staging'))
      }
    }

    // Production
    if (prints.production) {
      let production = envVars.filter(p => p.env === 'production')
      let title = 'Production env vars:'
      if (production.length) {
        update.status(title, ...production.map(fmt))
      }
      else {
        update.status(title, msg('production'))
      }
    }
  }
}
