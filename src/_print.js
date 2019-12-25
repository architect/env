let chalk = require('chalk')
let {updater} = require('@architect/utils')
let update = updater('Env')

module.exports = function printer(err, result) {
  if (err) {
    update.error(err)
  }
  else {
    let testing = result.filter(p=> p.env === 'testing')
    let staging = result.filter(p=> p.env === 'staging')
    let production = result.filter(p=> p.env === 'production')
    if (testing.length > 0) {
      update.done('Added env var(s) to testing environment')
      testing.forEach(t=> {
        console.log(chalk.cyan.bold(t.name), chalk.cyan(t.value))
      })
      console.log('')
    }
    if (staging.length > 0) {
      update.done('Added env var(s) to staging environment')
      staging.forEach(t=> {
        console.log(chalk.cyan.bold(t.name), chalk.cyan(t.value))
      })
      console.log('')
    }
    if (production.length > 0) {
      update.done('Added env var(s) to production environment')
      production.forEach(t=> {
        console.log(chalk.cyan.bold(t.name), chalk.cyan(t.value))
      })
      console.log('')
    }
  }
}
